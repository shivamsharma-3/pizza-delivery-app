const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  itemType: {
    type: String,
    required: true,
    enum: ['base', 'sauce', 'cheese', 'vegetable', 'meat']
  },
  itemName: {
    type: String,
    required: true,
    trim: true
  },
  stock: {
    type: Number,
    required: true,
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  threshold: {
    type: Number,
    required: true,
    min: [1, 'Threshold must be at least 1'],
    default: 10
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  description: String
}, {
  timestamps: true
});

// Method to check if item is low on stock
inventorySchema.methods.isLowStock = function() {
  return this.stock <= this.threshold;
};

module.exports = mongoose.model('Inventory', inventorySchema);

