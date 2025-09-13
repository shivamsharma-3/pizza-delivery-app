const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pizzadelivery');

async function createTestUser() {
  try {
    // Check if customer already exists
    const existingCustomer = await User.findOne({ email: 'customer@test.com' });
    if (existingCustomer) {
      console.log('✅ Test customer already exists');
      console.log('📧 Email: customer@test.com');
      console.log('🔑 Password: password123');
      process.exit(0);
    }

    // Create test customer
    const customer = new User({
      name: 'Test Customer',
      email: 'customer@test.com',
      password: 'password123',
      role: 'user',
      isVerified: true
    });

    await customer.save();
    
    console.log('🎉 Test customer created successfully!');
    console.log('📧 Email: customer@test.com');
    console.log('🔑 Password: password123');
    console.log('🔒 Role: user');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test user:', error);
    process.exit(1);
  }
}

createTestUser();
