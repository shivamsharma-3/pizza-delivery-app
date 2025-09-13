const mongoose = require('mongoose');
const Order = require('./models/Order');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pizzadelivery');

async function seedOrders() {
  try {
    // Find a user to create orders for
    let user = await User.findOne({ role: 'user' });
    
    if (!user) {
      console.log('❌ No regular user found. Creating a test user...');
      
      // Create a test user
      user = new User({
        name: 'Test Customer',
        email: 'customer@test.com',
        password: 'password123',
        role: 'user',
        isVerified: true
      });
      
      await user.save();
      console.log('✅ Test user created: customer@test.com');
    }

    console.log(`📝 Creating orders for user: ${user.name} (${user.email})`);

    // Clear existing orders
    await Order.deleteMany({});
    console.log('🗑️ Cleared existing orders');

    // Sample orders
    const sampleOrders = [
      {
        userId: user._id,
        orderDetails: {
          base: 'Thin Crust',
          sauce: 'Tomato Sauce',
          cheese: 'Mozzarella',
          vegetables: ['Mushrooms', 'Bell Peppers'],
          meats: ['Pepperoni'],
          size: 'medium',
          quantity: 1
        },
        pricing: {
          totalPrice: 299
        },
        deliveryAddress: {
          street: '123 Pizza Street, Andheri West',
          city: 'Mumbai',
          zipCode: '400053',
          phone: '9876543210'
        },
        paymentDetails: {
          paymentStatus: 'completed',
          paymentMethod: 'razorpay',
          paymentId: 'pay_test123'
        },
        orderStatus: 'preparing',
        cookingTime: 25,
        deliveryTime: 15,
        specialInstructions: 'Extra crispy base please'
      },
      {
        userId: user._id,
        orderDetails: {
          base: 'Thick Crust',
          sauce: 'White Sauce',
          cheese: 'Mixed Cheese',
          vegetables: ['Onions', 'Tomatoes'],
          meats: [],
          size: 'large',
          quantity: 2
        },
        pricing: {
          totalPrice: 599
        },
        deliveryAddress: {
          street: '456 Food Lane, CP',
          city: 'New Delhi',
          zipCode: '110001',
          phone: '9876543211'
        },
        paymentDetails: {
          paymentStatus: 'completed',
          paymentMethod: 'cod'
        },
        orderStatus: 'delivered',
        cookingTime: 30,
        deliveryTime: 20,
        actualDelivery: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        userId: user._id,
        orderDetails: {
          base: 'Stuffed Crust',
          sauce: 'BBQ Sauce',
          cheese: 'Cheddar',
          vegetables: ['Corn'],
          meats: ['Chicken'],
          size: 'extra-large',
          quantity: 1
        },
        pricing: {
          totalPrice: 799
        },
        deliveryAddress: {
          street: '789 Delivery Drive',
          city: 'Bangalore',
          zipCode: '560001',
          phone: '9876543212'
        },
        paymentDetails: {
          paymentStatus: 'completed',
          paymentMethod: 'razorpay',
          paymentId: 'pay_test456'
        },
        orderStatus: 'out-for-delivery',
        cookingTime: 35,
        deliveryTime: 25
      }
    ];

    console.log('📦 Creating sample orders...');

    // Create orders one by one
    for (let i = 0; i < sampleOrders.length; i++) {
      const orderData = sampleOrders[i];
      console.log(`Creating order ${i + 1}/${sampleOrders.length}...`);
      
      // Create order
      const order = new Order(orderData);
      await order.save();
      
      console.log(`✅ Created order: ${order.orderNumber}`);
      
      // Update status with history for different order states
      if (orderData.orderStatus === 'delivered') {
        await order.updateStatus('confirmed', user._id, 'Order confirmed by restaurant');
        await order.updateStatus('preparing', user._id, 'Started cooking your pizza');
        await order.updateStatus('baking', user._id, 'Pizza in the oven');
        await order.updateStatus('ready', user._id, 'Pizza ready for pickup');
        await order.updateStatus('out-for-delivery', user._id, 'Driver assigned');
        await order.updateStatus('delivered', user._id, 'Successfully delivered');
      } else if (orderData.orderStatus === 'preparing') {
        await order.updateStatus('confirmed', user._id, 'Order confirmed');
        await order.updateStatus('preparing', user._id, 'Chef started preparing your delicious pizza');
      } else if (orderData.orderStatus === 'out-for-delivery') {
        await order.updateStatus('confirmed', user._id, 'Order confirmed');
        await order.updateStatus('preparing', user._id, 'Started cooking');
        await order.updateStatus('baking', user._id, 'Pizza baking');
        await order.updateStatus('ready', user._id, 'Ready for delivery');
        await order.updateStatus('out-for-delivery', user._id, 'Out for delivery');
      }
      
      console.log(`📈 Status history updated for order: ${order.orderNumber}`);
    }
    
    console.log('\n🎉 Sample orders created successfully!');
    console.log(`📦 Created ${sampleOrders.length} orders for user: ${user.name}`);
    console.log('📧 Test user login: customer@test.com / password123');
    console.log('🔍 You can now test order tracking and admin dashboard');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding orders:', error);
    process.exit(1);
  }
}

seedOrders();
