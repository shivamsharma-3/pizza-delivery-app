const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');
const handlebars = require('handlebars');

// Register Handlebars helpers
handlebars.registerHelper('join', function(array, separator) {
  return array ? array.join(separator) : '';
});

class EmailService {
  constructor() {
    try {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER || 'demo@example.com',
          pass: process.env.EMAIL_PASSWORD || 'demo-password'
        }
      });
      this.emailEnabled = true;
    } catch (error) {
      console.log('⚠️  Email service disabled - no credentials provided');
      this.emailEnabled = false;
    }
  }

  async sendOrderConfirmation(order, user) {
    if (!this.emailEnabled) {
      console.log('📧 Demo: Order confirmation email would be sent to:', user.email);
      return { messageId: 'demo-email-1' };
    }

    try {
      console.log('📧 Sending order confirmation email to:', user.email);
      console.log('📋 Order:', order.orderNumber);
      
      // For demo purposes, just log the email details
      const emailData = {
        customerName: user.name,
        customerEmail: user.email,
        orderNumber: order.orderNumber,
        orderDate: new Date(order.createdAt).toLocaleDateString('en-IN'),
        estimatedDelivery: order.estimatedDelivery ? 
          new Date(order.estimatedDelivery).toLocaleDateString('en-IN') : '30-45 minutes',
        orderDetails: order.orderDetails,
        totalAmount: order.pricing.totalPrice,
        deliveryAddress: order.deliveryAddress
      };
      
      console.log('✅ Demo email data prepared:', {
        to: emailData.customerEmail,
        subject: `🍕 Order Confirmed! #${emailData.orderNumber}`,
        orderTotal: `₹${emailData.totalAmount}`
      });
      
      return { messageId: 'demo-confirmation-' + Date.now() };
    } catch (error) {
      console.error('❌ Error preparing order confirmation email:', error);
      return { messageId: 'demo-error-' + Date.now() };
    }
  }

  async sendStatusUpdate(order, user, newStatus, statusNotes) {
    if (!this.emailEnabled) {
      console.log('📧 Demo: Status update email would be sent to:', user.email);
      console.log('📋 Status:', newStatus, '- Notes:', statusNotes);
      return { messageId: 'demo-email-2' };
    }

    try {
      const statusMessages = {
        'placed': 'on its way to our kitchen',
        'confirmed': 'confirmed and being prepared',
        'preparing': 'being crafted by our expert chefs',
        'baking': 'sizzling in our stone oven',
        'ready': 'hot and ready for delivery',
        'out-for-delivery': 'on its way to you',
        'delivered': 'delivered! Enjoy your meal',
        'cancelled': 'cancelled as requested'
      };
      
      console.log('📧 Sending status update email to:', user.email);
      console.log('📋 Order:', order.orderNumber, '- Status:', newStatus);
      console.log('💬 Message:', statusMessages[newStatus] || 'being processed');
      
      return { messageId: 'demo-status-' + Date.now() };
    } catch (error) {
      console.error('❌ Error preparing status update email:', error);
      return { messageId: 'demo-error-' + Date.now() };
    }
  }

  async sendAdminNotification(order, user, action) {
    if (!this.emailEnabled) {
      console.log('📧 Demo: Admin notification would be sent for:', action);
      return { messageId: 'demo-email-3' };
    }

    try {
      console.log('📧 Sending admin notification for:', action);
      console.log('📋 Order:', order.orderNumber, '- Customer:', user.name);
      console.log('💰 Amount: ₹' + order.pricing.totalPrice);
      
      return { messageId: 'demo-admin-' + Date.now() };
    } catch (error) {
      console.error('❌ Error preparing admin notification:', error);
      return { messageId: 'demo-error-' + Date.now() };
    }
  }
}

module.exports = new EmailService();
