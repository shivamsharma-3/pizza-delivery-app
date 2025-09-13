const express = require('express');
const Order = require('../models/Order');
const { authenticateToken } = require('../middleware/auth');
const emailService = require('../services/emailService');


const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Create new order
router.post('/', async (req, res) => {
  try {
    const { orderDetails, pricing, deliveryAddress, paymentDetails, specialInstructions } = req.body;
    
    const order = new Order({
      userId: req.user._id,
      orderDetails,
      pricing,
      deliveryAddress,
      paymentDetails,
      specialInstructions,
      cookingTime: calculateCookingTime(orderDetails),
      deliveryTime: 15 // Standard delivery time
    });

    await order.save();

    // Populate user details for response
    await order.populate('userId', 'name email');

    // Send confirmation email
    try {
      await emailService.sendOrderConfirmation(order, req.user);
      await emailService.sendAdminNotification(order, req.user, 'order');
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the order creation if email fails
    }

    res.status(201).json({
      message: 'Order created successfully',
      order
    });


  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
});

// Get user's orders
router.get('/my-orders', async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    let query = { userId: req.user._id, isActive: true };
    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalOrders = await Order.countDocuments(query);

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        hasNext: skip + orders.length < totalOrders,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Get single order with full tracking details
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId)
      .populate('userId', 'name email')
      .populate('statusHistory.updatedBy', 'name role');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns the order or is admin
    if (order.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Error fetching order' });
  }
});

// Track order by order number (public endpoint for customers)
router.get('/track/:orderNumber', async (req, res) => {
  try {
    const { orderNumber } = req.params;
    
    const order = await Order.findOne({ orderNumber })
      .populate('userId', 'name')
      .select('orderNumber orderStatus statusHistory estimatedDelivery actualDelivery createdAt orderDetails');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const trackingInfo = {
      orderNumber: order.orderNumber,
      currentStatus: order.orderStatus,
      progress: order.getProgress(),
      isInProgress: order.isInProgress(),
      estimatedDelivery: order.estimatedDelivery,
      actualDelivery: order.actualDelivery,
      orderDate: order.createdAt,
      statusHistory: order.statusHistory.map(history => ({
        status: history.status,
        timestamp: history.timestamp,
        notes: history.notes
      })),
      orderSummary: {
        base: order.orderDetails.base,
        size: order.orderDetails.size,
        quantity: order.orderDetails.quantity
      }
    };

    res.json(trackingInfo);
  } catch (error) {
    console.error('Track order error:', error);
    res.status(500).json({ message: 'Error tracking order' });
  }
});

// Cancel order (customer can only cancel if not started cooking)
router.put('/:orderId/cancel', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check ownership
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if cancellation is allowed
    const nonCancellableStatuses = ['preparing', 'baking', 'ready', 'out-for-delivery', 'delivered'];
    if (nonCancellableStatuses.includes(order.orderStatus)) {
      return res.status(400).json({ 
        message: 'Order cannot be cancelled at this stage. Please contact support.' 
      });
    }

    await order.updateStatus('cancelled', req.user._id, `Customer cancellation: ${reason || 'No reason provided'}`);

    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Error cancelling order' });
  }
});

// Rate and review order
router.post('/:orderId/review', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { score, review } = req.body;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check ownership
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if order is delivered
    if (order.orderStatus !== 'delivered') {
      return res.status(400).json({ message: 'Can only review delivered orders' });
    }

    order.rating = {
      score,
      review,
      reviewDate: new Date()
    };

    await order.save();

    res.json({ message: 'Review submitted successfully', order });
  } catch (error) {
    console.error('Review order error:', error);
    res.status(500).json({ message: 'Error submitting review' });
  }
});

// Helper function to calculate cooking time based on order details
function calculateCookingTime(orderDetails) {
  let baseTime = 15; // Base cooking time in minutes
  
  // Add time based on size
  const sizeTime = {
    'small': 0,
    'medium': 3,
    'large': 5,
    'extra-large': 8
  };
  
  baseTime += sizeTime[orderDetails.size] || 0;
  
  // Add time for each topping
  const toppingsCount = (orderDetails.vegetables?.length || 0) + (orderDetails.meats?.length || 0);
  baseTime += toppingsCount * 2;
  
  // Add time for quantity
  baseTime += (orderDetails.quantity - 1) * 5;
  
  return Math.min(baseTime, 45); // Cap at 45 minutes
}

module.exports = router;
