const mongoose = require('mongoose');
const Inventory = require('./models/Inventory');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pizzadelivery');

const sampleInventory = [
  // Pizza Bases
  { itemType: 'base', itemName: 'Thin Crust', price: 150, stock: 50, threshold: 10, description: 'Crispy thin crust' },
  { itemType: 'base', itemName: 'Thick Crust', price: 180, stock: 45, threshold: 10, description: 'Fluffy thick crust' },
  { itemType: 'base', itemName: 'Stuffed Crust', price: 220, stock: 30, threshold: 8, description: 'Cheese stuffed crust' },
  { itemType: 'base', itemName: 'Gluten Free', price: 200, stock: 20, threshold: 5, description: 'Gluten-free base' },
  { itemType: 'base', itemName: 'Whole Wheat', price: 170, stock: 35, threshold: 8, description: 'Healthy whole wheat' },

  // Sauces
  { itemType: 'sauce', itemName: 'Tomato Sauce', price: 30, stock: 100, threshold: 20, description: 'Classic tomato sauce' },
  { itemType: 'sauce', itemName: 'White Sauce', price: 40, stock: 80, threshold: 15, description: 'Creamy white sauce' },
  { itemType: 'sauce', itemName: 'BBQ Sauce', price: 45, stock: 60, threshold: 12, description: 'Smoky BBQ sauce' },
  { itemType: 'sauce', itemName: 'Pesto Sauce', price: 50, stock: 40, threshold: 10, description: 'Fresh basil pesto' },
  { itemType: 'sauce', itemName: 'Spicy Sauce', price: 35, stock: 70, threshold: 15, description: 'Hot and spicy sauce' },

  // Cheese
  { itemType: 'cheese', itemName: 'Mozzarella', price: 80, stock: 60, threshold: 15, description: 'Classic mozzarella' },
  { itemType: 'cheese', itemName: 'Cheddar', price: 90, stock: 40, threshold: 10, description: 'Sharp cheddar cheese' },
  { itemType: 'cheese', itemName: 'Parmesan', price: 120, stock: 30, threshold: 8, description: 'Aged parmesan' },
  { itemType: 'cheese', itemName: 'Mixed Cheese', price: 100, stock: 45, threshold: 12, description: 'Blend of cheeses' },

  // Vegetables
  { itemType: 'vegetable', itemName: 'Mushrooms', price: 25, stock: 40, threshold: 10, description: 'Fresh mushrooms' },
  { itemType: 'vegetable', itemName: 'Bell Peppers', price: 20, stock: 50, threshold: 10, description: 'Colorful bell peppers' },
  { itemType: 'vegetable', itemName: 'Onions', price: 15, stock: 60, threshold: 15, description: 'Fresh onions' },
  { itemType: 'vegetable', itemName: 'Tomatoes', price: 18, stock: 45, threshold: 12, description: 'Fresh tomatoes' },
  { itemType: 'vegetable', itemName: 'Olives', price: 30, stock: 35, threshold: 8, description: 'Black olives' },
  { itemType: 'vegetable', itemName: 'Corn', price: 22, stock: 40, threshold: 10, description: 'Sweet corn kernels' },

  // Meats
  { itemType: 'meat', itemName: 'Pepperoni', price: 60, stock: 35, threshold: 8, description: 'Spicy pepperoni' },
  { itemType: 'meat', itemName: 'Chicken', price: 70, stock: 30, threshold: 7, description: 'Grilled chicken chunks' },
  { itemType: 'meat', itemName: 'Ham', price: 65, stock: 25, threshold: 6, description: 'Smoked ham slices' },
  { itemType: 'meat', itemName: 'Sausage', price: 75, stock: 28, threshold: 6, description: 'Italian sausage' }
];

async function seedInventory() {
  try {
    // Clear existing inventory
    await Inventory.deleteMany({});
    
    // Insert sample data
    await Inventory.insertMany(sampleInventory);
    
    console.log('✅ Inventory seeded successfully!');
    console.log(`📦 Added ${sampleInventory.length} inventory items`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding inventory:', error);
    process.exit(1);
  }
}

seedInventory();
