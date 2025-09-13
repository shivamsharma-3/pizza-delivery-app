const mongoose = require('mongoose');
const User = require('./models/User');
const Order = require('./models/Order');
const Inventory = require('./models/Inventory');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pizzadelivery');

async function checkDatabase() {
  try {
    const userCount = await User.countDocuments();
    const orderCount = await Order.countDocuments();
    const inventoryCount = await Inventory.countDocuments();
    
    console.log('📊 Database Status:');
    console.log(`👥 Users: ${userCount}`);
    console.log(`📦 Orders: ${orderCount}`);
    console.log(`🍕 Inventory Items: ${inventoryCount}`);
    
    if (userCount > 0) {
      console.log('\n👤 Users in database:');
      const users = await User.find().select('name email role');
      users.forEach(user => {
        console.log(`  - ${user.name} (${user.email}) - ${user.role}`);
      });
    }
    
    if (orderCount > 0) {
      console.log('\n📋 Orders in database:');
      const orders = await Order.find().select('orderNumber orderStatus createdAt').limit(5);
      orders.forEach(order => {
        console.log(`  - ${order.orderNumber} - ${order.orderStatus} (${order.createdAt})`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking database:', error);
    process.exit(1);
  }
}

checkDatabase();
