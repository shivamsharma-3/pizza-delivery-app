const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    unique: true,
    required: false
  },
  orderDetails: {
    base: {
      type: String,
      required: true
    },
    sauce: {
      type: String,
      required: true
    },
    cheese: {
      type: String,
      required: true
    },
    vegetables: [{
      type: String
    }],
    meats: [{
      type: String
    }],
    size: {
      type: String,
      required: true,
      enum: ['small', 'medium', 'large', 'extra-large']
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      default: 1
    }
  },
  pricing: {
    basePrice: Number,
    toppingsPrice: Number,
    sizeMultiplier: Number,
    totalPrice: {
      type: Number,
      required: true,
      min: [0, 'Total price cannot be negative']
    }
  },
  deliveryAddress: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  paymentDetails: {
    paymentId: String,
    paymentMethod: {
      type: String,
      enum: ['razorpay', 'cod'],
      default: 'razorpay'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    razorpayOrderId: String,
    razorpaySignature: String
  },
  orderStatus: {
    type: String,
    enum: ['placed', 'confirmed', 'preparing', 'baking', 'ready', 'out-for-delivery', 'delivered', 'cancelled'],
    default: 'placed'
  },
  statusHistory: [{
    status: {
      type: String,
      enum: ['placed', 'confirmed', 'preparing', 'baking', 'ready', 'out-for-delivery', 'delivered', 'cancelled']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String
  }],
  estimatedDelivery: Date,
  actualDelivery: Date,
  cookingTime: Number, // in minutes
  deliveryTime: Number, // in minutes
  specialInstructions: String,
  rating: {
    score: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    reviewDate: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', function(next) {
  if (this.isNew && !this.orderNumber) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderNumber = `PZ${timestamp}${random}`;
    
    // Add initial status to history if not exists
    if (!this.statusHistory || this.statusHistory.length === 0) {
      this.statusHistory = [{
        status: 'placed',
        timestamp: new Date()
      }];
    }
  }
  next();
});

// Method to update status with history tracking
orderSchema.methods.updateStatus = async function(newStatus, updatedBy, notes) {
  this.orderStatus = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    updatedBy,
    notes
  });
  
  // Auto-calculate estimated delivery time
  if (newStatus === 'confirmed') {
    const estimatedTime = new Date();
    estimatedTime.setMinutes(estimatedTime.getMinutes() + (this.cookingTime || 25) + (this.deliveryTime || 15));
    this.estimatedDelivery = estimatedTime;
  }
  
  if (newStatus === 'delivered') {
    this.actualDelivery = new Date();
  }
  
  return this.save();
};

// Get order progress percentage
orderSchema.methods.getProgress = function() {
  const statusOrder = ['placed', 'confirmed', 'preparing', 'baking', 'ready', 'out-for-delivery', 'delivered'];
  const currentIndex = statusOrder.indexOf(this.orderStatus);
  return currentIndex >= 0 ? Math.round(((currentIndex + 1) / statusOrder.length) * 100) : 0;
};

// Check if order is in progress
orderSchema.methods.isInProgress = function() {
  return !['delivered', 'cancelled'].includes(this.orderStatus);
};

// Index for efficient queries
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ orderNumber: 1 });

module.exports = mongoose.model('Order', orderSchema);
