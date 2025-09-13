import React, { useState, useEffect } from 'react';
import { getUserOrders, getOrderDetails, trackOrderByNumber } from '../../utils/api';

const OrderTracking = ({ user, onBack }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);

  useEffect(() => {
    loadUserOrders();
  }, []);

  const loadUserOrders = async () => {
    try {
      const response = await getUserOrders();
      setOrders(response.data.orders || []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading orders:', error);
      setLoading(false);
    }
  };

  const handleOrderClick = async (orderId) => {
    try {
      const response = await getOrderDetails(orderId);
      setSelectedOrder(response.data);
    } catch (error) {
      console.error('Error loading order details:', error);
    }
  };

  const handleTrackOrder = async () => {
    if (!trackingNumber) {
      alert('Please enter an order number');
      return;
    }

    try {
      const response = await trackOrderByNumber(trackingNumber);
      setTrackingResult(response.data);
    } catch (error) {
      console.error('Error tracking order:', error);
      setTrackingResult({ error: 'Order not found or invalid order number' });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'placed': '#6c757d',
      'confirmed': '#17a2b8',
      'preparing': '#ffc107',
      'baking': '#fd7e14',
      'ready': '#20c997',
      'out-for-delivery': '#007bff',
      'delivered': '#28a745',
      'cancelled': '#dc3545'
    };
    return colors[status] || '#6c757d';
  };

  const getProgressSteps = () => {
    return [
      { key: 'placed', label: '📋 Placed', description: 'Order received' },
      { key: 'confirmed', label: '✅ Confirmed', description: 'Order confirmed' },
      { key: 'preparing', label: '👨‍🍳 Preparing', description: 'Chef is working' },
      { key: 'baking', label: '🔥 Baking', description: 'In the oven' },
      { key: 'ready', label: '🍕 Ready', description: 'Ready for pickup' },
      { key: 'out-for-delivery', label: '🚚 On the Way', description: 'Out for delivery' },
      { key: 'delivered', label: '✨ Delivered', description: 'Enjoy your pizza!' }
    ];
  };

  const renderProgressBar = (currentStatus, statusHistory) => {
    const steps = getProgressSteps();
    const currentIndex = steps.findIndex(step => step.key === currentStatus);

    return (
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          {steps.map((step, index) => {
            const isCompleted = index <= currentIndex;
            const isActive = index === currentIndex;
            
            return (
              <div key={step.key} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: isCompleted ? '#28a745' : (isActive ? '#ffc107' : '#dee2e6'),
                  color: isCompleted || isActive ? 'white' : '#6c757d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  position: 'relative',
                  zIndex: 2
                }}>
                  {isCompleted ? '✓' : index + 1}
                </div>
                
                {index < steps.length - 1 && (
                  <div style={{
                    flex: 1,
                    height: '4px',
                    backgroundColor: isCompleted ? '#28a745' : '#dee2e6',
                    marginLeft: '10px',
                    marginRight: '10px',
                    position: 'relative',
                    zIndex: 1
                  }} />
                )}
              </div>
            );
          })}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {steps.map((step, index) => (
            <div key={step.key} style={{ 
              textAlign: 'center', 
              flex: 1,
              fontSize: '12px'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{step.label}</div>
              <div style={{ color: '#666' }}>{step.description}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Loading your orders...</h2>
      </div>
    );
  }

  // Order Details View
  if (selectedOrder) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <button 
            onClick={() => setSelectedOrder(null)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginRight: '15px'
            }}
          >
            ← Back to Orders
          </button>
          <button 
            onClick={onBack}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ff6b35',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            ← Dashboard
          </button>
        </div>

        <div style={{
          backgroundColor: '#fff',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ color: '#ff6b35', marginBottom: '10px' }}>
            🍕 Order #{selectedOrder.orderNumber}
          </h1>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '20px',
            marginBottom: '30px',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <div>
              <p><strong>Status:</strong> 
                <span style={{ 
                  color: getStatusColor(selectedOrder.orderStatus),
                  fontWeight: 'bold',
                  marginLeft: '10px',
                  textTransform: 'capitalize'
                }}>
                  {selectedOrder.orderStatus.replace('-', ' ')}
                </span>
              </p>
              <p><strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              <p><strong>Total Amount:</strong> ₹{selectedOrder.pricing.totalPrice}</p>
            </div>
            <div>
              <p><strong>Delivery Address:</strong></p>
              <p style={{ fontSize: '14px', color: '#666' }}>
                {selectedOrder.deliveryAddress.street}<br/>
                {selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.zipCode}<br/>
                📞 {selectedOrder.deliveryAddress.phone}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          {renderProgressBar(selectedOrder.orderStatus, selectedOrder.statusHistory)}

          {/* Order Details */}
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h3>📋 Order Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <p><strong>Base:</strong> {selectedOrder.orderDetails.base}</p>
                <p><strong>Sauce:</strong> {selectedOrder.orderDetails.sauce}</p>
                <p><strong>Cheese:</strong> {selectedOrder.orderDetails.cheese}</p>
              </div>
              <div>
                <p><strong>Size:</strong> {selectedOrder.orderDetails.size}</p>
                <p><strong>Quantity:</strong> {selectedOrder.orderDetails.quantity}</p>
                {selectedOrder.orderDetails.vegetables?.length > 0 && (
                  <p><strong>Vegetables:</strong> {selectedOrder.orderDetails.vegetables.join(', ')}</p>
                )}
                {selectedOrder.orderDetails.meats?.length > 0 && (
                  <p><strong>Meats:</strong> {selectedOrder.orderDetails.meats.join(', ')}</p>
                )}
              </div>
            </div>
          </div>

          {/* Status History */}
          <div>
            <h3>📈 Order Timeline</h3>
            <div style={{ marginTop: '15px' }}>
              {selectedOrder.statusHistory?.map((history, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '15px',
                  backgroundColor: index === 0 ? 'rgba(255, 107, 53, 0.1)' : '#fff',
                  border: '1px solid #dee2e6',
                  borderRadius: '8px',
                  marginBottom: '10px'
                }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: getStatusColor(history.status),
                    marginRight: '15px'
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                      {history.status.replace('-', ' ')}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {new Date(history.timestamp).toLocaleString()}
                    </div>
                    {history.notes && (
                      <div style={{ fontSize: '14px', color: '#333', marginTop: '5px' }}>
                        {history.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Estimated Delivery */}
          {selectedOrder.estimatedDelivery && selectedOrder.orderStatus !== 'delivered' && (
            <div style={{
              backgroundColor: '#e7f3ff',
              border: '1px solid #b8daff',
              borderRadius: '8px',
              padding: '15px',
              marginTop: '20px',
              textAlign: 'center'
            }}>
              <h4 style={{ color: '#004085', margin: '0 0 10px 0' }}>
                🕒 Estimated Delivery Time
              </h4>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#004085', margin: 0 }}>
                {new Date(selectedOrder.estimatedDelivery).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main Orders List View
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={onBack}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          ← Back to Dashboard
        </button>
      </div>

      <h1 style={{ color: '#ff6b35', marginBottom: '30px' }}>📋 Your Order History</h1>

      {/* Track Order by Number */}
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h3>🔍 Track Any Order</h3>
        <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Enter order number (e.g., PZ1234567890)"
            style={{
              flex: 1,
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '14px'
            }}
          />
          <button
            onClick={handleTrackOrder}
            style={{
              padding: '12px 24px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Track Order
          </button>
        </div>

        {trackingResult && (
          <div style={{
            marginTop: '15px',
            padding: '15px',
            backgroundColor: trackingResult.error ? '#f8d7da' : '#d1ecf1',
            borderRadius: '5px'
          }}>
            {trackingResult.error ? (
              <p style={{ color: '#721c24', margin: 0 }}>{trackingResult.error}</p>
            ) : (
              <div>
                <h4 style={{ margin: '0 0 10px 0' }}>Order #{trackingResult.orderNumber}</h4>
                <p><strong>Status:</strong> <span style={{ 
                  color: getStatusColor(trackingResult.currentStatus),
                  fontWeight: 'bold',
                  textTransform: 'capitalize'
                }}>
                  {trackingResult.currentStatus.replace('-', ' ')}
                </span></p>
                <p><strong>Progress:</strong> {trackingResult.progress}% complete</p>
                {trackingResult.estimatedDelivery && (
                  <p><strong>Estimated Delivery:</strong> {new Date(trackingResult.estimatedDelivery).toLocaleString()}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div style={{
          backgroundColor: '#fff',
          padding: '50px',
          borderRadius: '10px',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>No orders found</h3>
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {orders.map((order) => (
            <div key={order._id} style={{
              backgroundColor: '#fff',
              padding: '25px',
              borderRadius: '10px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
              ':hover': { transform: 'translateY(-2px)' }
            }}
            onClick={() => handleOrderClick(order._id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', color: '#ff6b35' }}>
                    Order #{order.orderNumber}
                  </h3>
                  <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    padding: '6px 12px',
                    backgroundColor: getStatusColor(order.orderStatus),
                    color: 'white',
                    borderRadius: '15px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textTransform: 'capitalize'
                  }}>
                    {order.orderStatus.replace('-', ' ')}
                  </div>
                  <p style={{ margin: '10px 0 0 0', fontWeight: 'bold', fontSize: '16px' }}>
                    ₹{order.pricing.totalPrice}
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '14px' }}>
                <div>
                  <p><strong>Pizza:</strong> {order.orderDetails.size} {order.orderDetails.base}</p>
                  <p><strong>Quantity:</strong> {order.orderDetails.quantity}</p>
                </div>
                <div>
                  <p><strong>Delivery:</strong> {order.deliveryAddress.city}</p>
                  <p><strong>Payment:</strong> {order.paymentDetails.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'}</p>
                </div>
              </div>

              <div style={{ 
                marginTop: '15px', 
                padding: '10px 0', 
                borderTop: '1px solid #eee',
                textAlign: 'center',
                color: '#ff6b35',
                fontWeight: 'bold'
              }}>
                Click to view full details & track progress →
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
