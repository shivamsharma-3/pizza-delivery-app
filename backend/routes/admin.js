const express = require('express');
const User = require('../models/User');
const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const emailService = require('../services/emailService');


const router = express.Router();

// Apply authentication and admin check to all routes
router.use(authenticateToken);
router.use(requireAdmin);

// Admin Dashboard Overview
router.get('/dashboard', async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Dashboard Statistics
    const stats = {
      totalUsers: await User.countDocuments({ role: 'user' }),
      totalOrders: await Order.countDocuments(),
      todayOrders: await Order.countDocuments({ 
        createdAt: { $gte: startOfDay } 
      }),
      weeklyOrders: await Order.countDocuments({ 
        createdAt: { $gte: startOfWeek } 
      }),
      monthlyOrders: await Order.countDocuments({ 
        createdAt: { $gte: startOfMonth } 
      }),
      
      // Revenue calculations (assuming completed orders)
      totalRevenue: await Order.aggregate([
        { $match: { 'paymentDetails.paymentStatus': 'completed' } },
        { $group: { _id: null, total: { $sum: '$pricing.totalPrice' } } }
      ]),
      
      todayRevenue: await Order.aggregate([
        { 
          $match: { 
            createdAt: { $gte: startOfDay },
            'paymentDetails.paymentStatus': 'completed'
          }
        },
        { $group: { _id: null, total: { $sum: '$pricing.totalPrice' } } }
      ]),

      // Inventory alerts
      lowStockItems: await Inventory.find({
        $expr: { $lte: ['$stock', '$threshold'] },
        isActive: true
      }).countDocuments(),

      outOfStockItems: await Inventory.find({
        stock: 0,
        isActive: true
      }).countDocuments()
    };

    // Recent Orders
    const recentOrders = await Order.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    // Order Status Distribution
    const orderStatusStats = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      stats: {
        ...stats,
        totalRevenue: stats.totalRevenue[0]?.total || 0,
        todayRevenue: stats.todayRevenue?.total || 0
      },
      recentOrders,
      orderStatusStats
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

// Get All Orders with Filters
router.get('/orders', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .populate('userId', 'name email')
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

// Update Order Status
router.put('/orders/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, estimatedDelivery } = req.body;

    const validStatuses = ['placed', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const updateData = { orderStatus: status };
    if (estimatedDelivery) {
      updateData.estimatedDelivery = new Date(estimatedDelivery);
    }

    const order = await Order.findByIdAndUpdate(
      orderId, 
      updateData, 
      { new: true }
    ).populate('userId', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Send status update email to customer
    try {
      await emailService.sendStatusUpdate(order, order.userId, status, req.body.notes);
    } catch (emailError) {
      console.error('Status update email failed:', emailError);
    }

    res.json({ message: 'Order status updated successfully', order });


  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Error updating order status' });
  }
});

// Inventory Management
router.get('/inventory', async (req, res) => {
  try {
    const { type, lowStock } = req.query;
    
    let query = { isActive: true };
    
    if (type && type !== 'all') {
      query.itemType = type;
    }
    
    if (lowStock === 'true') {
      query.$expr = { $lte: ['$stock', '$threshold'] };
    }

    const inventory = await Inventory.find(query).sort({ itemType: 1, itemName: 1 });
    
    // Get inventory statistics
    const inventoryStats = await Inventory.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$itemType',
          totalItems: { $sum: 1 },
          totalStock: { $sum: '$stock' },
          lowStockItems: {
            $sum: {
              $cond: [{ $lte: ['$stock', '$threshold'] }, 1, 0]
            }
          }
        }
      }
    ]);

    res.json({ inventory, inventoryStats });
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({ message: 'Error fetching inventory' });
  }
});

// Update Inventory Item
router.put('/inventory/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const { stock, threshold, price, isActive } = req.body;

    const updateData = {};
    if (stock !== undefined) updateData.stock = stock;
    if (threshold !== undefined) updateData.threshold = threshold;
    if (price !== undefined) updateData.price = price;
    if (isActive !== undefined) updateData.isActive = isActive;

    const item = await Inventory.findByIdAndUpdate(
      itemId,
      updateData,
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    res.json({ message: 'Inventory updated successfully', item });
  } catch (error) {
    console.error('Update inventory error:', error);
    res.status(500).json({ message: 'Error updating inventory' });
  }
});

// Get All Users
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const users = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalUsers = await User.countDocuments({ role: 'user' });

    // Get user order statistics
    const userStats = await Promise.all(
      users.map(async (user) => {
        const orderCount = await Order.countDocuments({ userId: user._id });
        const totalSpent = await Order.aggregate([
          { $match: { userId: user._id, 'paymentDetails.paymentStatus': 'completed' } },
          { $group: { _id: null, total: { $sum: '$pricing.totalPrice' } } }
        ]);
        
        return {
          ...user.toObject(),
          orderCount,
          totalSpent: totalSpent[0]?.total || 0
        };
      })
    );

    res.json({
      users: userStats,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        hasNext: skip + users.length < totalUsers,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Sales Analytics
router.get('/analytics', async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    
    let dateRange;
    const now = new Date();
    
    switch (period) {
      case 'day':
        dateRange = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        dateRange = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        dateRange = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        dateRange = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        dateRange = new Date(now.setDate(now.getDate() - 7));
    }

    // Sales over time
    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: dateRange },
          'paymentDetails.paymentStatus': 'completed'
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          totalSales: { $sum: '$pricing.totalPrice' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Popular items analysis
    const popularItems = await Order.aggregate([
      { $match: { createdAt: { $gte: dateRange } } },
      {
        $group: {
          _id: {
            base: '$orderDetails.base',
            size: '$orderDetails.size'
          },
          count: { $sum: '$orderDetails.quantity' },
          revenue: { $sum: '$pricing.totalPrice' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      salesData,
      popularItems,
      period
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Error fetching analytics' });
  }
});

module.exports = router;
