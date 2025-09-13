import React, { useState } from 'react';
import axios from 'axios';

const RazorpayCheckout = ({ cartItems, totalAmount, user, onPaymentSuccess }) => {
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    zipCode: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('online');

  const handleAddressChange = (e) => {
    setDeliveryAddress({
      ...deliveryAddress,
      [e.target.name]: e.target.value
    });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.zipCode || !deliveryAddress.phone) {
      alert('Please fill all delivery address fields');
      return;
    }

    setLoading(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert('Failed to load payment gateway. Please try again.');
        setLoading(false);
        return;
      }

      // Create order
      const orderResponse = await axios.post('/api/payment/create-order', {
        amount: totalAmount,
        currency: 'INR',
        orderDetails: cartItems[0], // For simplicity, taking first item
        deliveryAddress,
        userId: user.id
      });

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        name: 'Pizza Delivery Pro',
        description: 'Premium Pizza Order',
        order_id: orderResponse.data.razorpayOrderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await axios.post('/api/payment/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderResponse.data.orderId
            });

            if (verifyResponse.data.success) {
              onPaymentSuccess(orderResponse.data.orderId);
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please contact support.');
          }
          setLoading(false);
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: deliveryAddress.phone
        },
        theme: {
          color: '#ff6b35'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error('Payment initiation error:', error);
      alert('Failed to initiate payment. Please try again.');
      setLoading(false);
    }
  };

  const handleCashOnDelivery = async () => {
    if (!deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.zipCode || !deliveryAddress.phone) {
      alert('Please fill all delivery address fields');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/payment/create-order', {
        amount: totalAmount,
        orderDetails: cartItems[0],
        deliveryAddress,
        userId: user.id,
        paymentMethod: 'cod'
      });

      if (response.data.success) {
        onPaymentSuccess(response.data.orderId);
      }
    } catch (error) {
      console.error('COD order error:', error);
      alert('Failed to place order. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ color: '#ff6b35', textAlign: 'center' }}>🏪 Premium Checkout</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '30px' }}>
        {/* Delivery Address */}
        <div style={{ backgroundColor: '#f8f9fa', padding: '25px', borderRadius: '10px' }}>
          <h2 style={{ marginBottom: '20px', color: '#333' }}>📍 Delivery Address</h2>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Street Address:</label>
            <input
              type="text"
              name="street"
              value={deliveryAddress.street}
              onChange={handleAddressChange}
              placeholder="Enter your full address"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px'
              }}
              required
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>City:</label>
              <input
                type="text"
                name="city"
                value={deliveryAddress.city}
                onChange={handleAddressChange}
                placeholder="City"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                required
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ZIP Code:</label>
              <input
                type="text"
                name="zipCode"
                value={deliveryAddress.zipCode}
                onChange={handleAddressChange}
                placeholder="ZIP"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                required
              />
            </div>
          </div>
          
          <div style={{ marginTop: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Phone Number:</label>
            <input
              type="tel"
              name="phone"
              value={deliveryAddress.phone}
              onChange={handleAddressChange}
              placeholder="Your contact number"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px'
              }}
              required
            />
          </div>
        </div>

        {/* Order Summary */}
        <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '10px', border: '1px solid #ddd' }}>
          <h2 style={{ marginBottom: '20px', color: '#333' }}>📋 Order Summary</h2>
          
          {cartItems.map((item, index) => (
            <div key={index} style={{
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              marginBottom: '15px'
            }}>
              <h4 style={{ color: '#ff6b35', marginBottom: '8px' }}>Pizza #{index + 1}</h4>
              <p><strong>Base:</strong> {item.base}</p>
              <p><strong>Sauce:</strong> {item.sauce}</p>
              <p><strong>Cheese:</strong> {item.cheese}</p>
              {item.vegetables?.length > 0 && <p><strong>Vegetables:</strong> {item.vegetables.join(', ')}</p>}
              {item.meats?.length > 0 && <p><strong>Meats:</strong> {item.meats.join(', ')}</p>}
              <p><strong>Size:</strong> {item.size}</p>
              <p><strong>Quantity:</strong> {item.quantity}</p>
              <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#28a745', marginTop: '8px' }}>₹{item.totalPrice}</p>
            </div>
          ))}
          
          <div style={{
            borderTop: '2px solid #ff6b35',
            paddingTop: '15px',
            marginTop: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold' }}>
              <span>Total Amount:</span>
              <span style={{ color: '#ff6b35' }}>₹{totalAmount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '25px', color: '#333' }}>💳 Choose Payment Method</h2>
        
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <button
            onClick={handlePayment}
            disabled={loading}
            style={{
              padding: '18px 35px',
              backgroundColor: '#ff6b35',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              transition: 'transform 0.2s ease'
            }}
            onMouseOver={(e) => !loading && (e.target.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => !loading && (e.target.style.transform = 'scale(1)')}
          >
            {loading ? '⏳ Processing...' : '💳 Pay with Razorpay'}
          </button>
          
          <button
            onClick={handleCashOnDelivery}
            disabled={loading}
            style={{
              padding: '18px 35px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              transition: 'transform 0.2s ease'
            }}
            onMouseOver={(e) => !loading && (e.target.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => !loading && (e.target.style.transform = 'scale(1)')}
          >
            {loading ? '⏳ Processing...' : '💰 Cash on Delivery'}
          </button>
        </div>
        
        <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
          <p>🔒 Your payment information is secure and encrypted</p>
          <p>🚚 Estimated delivery: 30-45 minutes</p>
        </div>
      </div>
    </div>
  );
};

export default RazorpayCheckout;
