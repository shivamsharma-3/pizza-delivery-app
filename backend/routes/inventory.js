const express = require('express');
const Inventory = require('../models/Inventory');

const router = express.Router();

// Get all inventory items
router.get('/', async (req, res) => {
  try {
    const inventory = await Inventory.find({ isActive: true });
    res.json(inventory);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ message: 'Server error fetching inventory' });
  }
});

// Get inventory by type
router.get('/type/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const items = await Inventory.find({ 
      itemType: type, 
      isActive: true 
    });
    res.json(items);
  } catch (error) {
    console.error('Error fetching inventory by type:', error);
    res.status(500).json({ message: 'Server error fetching inventory' });
  }
});

// Calculate pizza price
router.post('/calculate-price', async (req, res) => {
  try {
    const { base, sauce, cheese, vegetables = [], meats = [], size = 'medium', quantity = 1 } = req.body;
    
    let totalPrice = 0;
    
    // Get base price
    if (base) {
      const baseItem = await Inventory.findOne({ itemType: 'base', itemName: base, isActive: true });
      if (baseItem) totalPrice += baseItem.price;
    }
    
    // Get sauce price
    if (sauce) {
      const sauceItem = await Inventory.findOne({ itemType: 'sauce', itemName: sauce, isActive: true });
      if (sauceItem) totalPrice += sauceItem.price;
    }
    
    // Get cheese price
    if (cheese) {
      const cheeseItem = await Inventory.findOne({ itemType: 'cheese', itemName: cheese, isActive: true });
      if (cheeseItem) totalPrice += cheeseItem.price;
    }
    
    // Get vegetables price
    for (const veggie of vegetables) {
      const veggieItem = await Inventory.findOne({ itemType: 'vegetable', itemName: veggie, isActive: true });
      if (veggieItem) totalPrice += veggieItem.price;
    }
    
    // Get meat price
    for (const meat of meats) {
      const meatItem = await Inventory.findOne({ itemType: 'meat', itemName: meat, isActive: true });
      if (meatItem) totalPrice += meatItem.price;
    }
    
    // Apply size multiplier
    const sizeMultipliers = {
      small: 1,
      medium: 1.3,
      large: 1.6,
      'extra-large': 2
    };
    
    const multiplier = sizeMultipliers[size] || 1.3;
    totalPrice = Math.round(totalPrice * multiplier);
    
    // Apply quantity
    const finalPrice = totalPrice * quantity;
    
    res.json({ 
      totalPrice: finalPrice,
      basePrice: totalPrice,
      quantity,
      size,
      multiplier 
    });
  } catch (error) {
    console.error('Error calculating price:', error);
    res.status(500).json({ message: 'Server error calculating price' });
  }
});

module.exports = router;
