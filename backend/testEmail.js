const emailService = require('./services/emailService');
const mongoose = require('mongoose');
const Order = require('./models/Order');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pizzadelivery');

async function testEmail() {
  try {
    // Find a user and order
    const user = await User.findOne({ role: 'user' });
    const order = await Order.findOne().populate('userId');
    
    if (!user || !order) {
      console.log('❌ Need user and order data to test email');
      process.exit(1);
    }
    
    console.log('📧 Testing email system...');
    console.log(`Sending to: ${user.email}`);
    
    // Test order confirmation email
    await emailService.sendOrderConfirmation(order, user);
    console.log('✅ Order confirmation email sent!');
    
    // Test status update email
    await emailService.sendStatusUpdate(order, user, 'preparing', 'Your pizza is being prepared by our expert chef!');
    console.log('✅ Status update email sent!');
    
    // Test admin notification
    await emailService.sendAdminNotification(order, user, 'order');
    console.log('✅ Admin notification sent!');
    
    console.log('\n🎉 All test emails sent successfully!');
    console.log('📬 Check your email inbox for the beautiful HTML emails');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Email test failed:', error);
    console.log('\n💡 Note: Email functionality requires proper EMAIL_USER and EMAIL_PASSWORD in .env file');
    console.log('For Gmail, you need to use App Passwords: https://support.google.com/accounts/answer/185833');
    process.exit(1);
  }
}

testEmail();
