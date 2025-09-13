const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pizzadelivery');

async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@pizzadelivery.com' });
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log('📧 Email: admin@pizzadelivery.com');
      console.log('🔑 Password: admin123');
      process.exit(0);
    }

    // Create admin user
    const admin = new User({
      name: 'Pizza Admin',
      email: 'admin@pizzadelivery.com',
      password: 'admin123',
      role: 'admin',
      isVerified: true
    });

    await admin.save();
    
    console.log('🎉 Admin user created successfully!');
    console.log('📧 Email: admin@pizzadelivery.com');
    console.log('🔑 Password: admin123');
    console.log('🔒 Role: admin');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
