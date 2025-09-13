import React, { useState, useEffect } from 'react';
import PizzaCustomizer from './PizzaCustomizer';
import OrderTracking from './OrderTracking';
import { getUserOrders } from '../../utils/api';


const Dashboard = ({ user, onLogout }) => {
  const [view, setView] = useState('home');
  const [cart, setCart] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    memberSince: '',
    loyaltyPoints: 0
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const ordersResponse = await getUserOrders({ limit: 5 });
      const orders = ordersResponse.data.orders || [];
      setRecentOrders(orders);
      
      // Calculate stats
      const totalSpent = orders.reduce((sum, order) => sum + (order.pricing?.totalPrice || 0), 0);
      setStats({
        totalOrders: orders.length,
        totalSpent: totalSpent,
        memberSince: new Date(user.createdAt || Date.now()).toLocaleDateString(),
        loyaltyPoints: Math.floor(totalSpent / 10) // 1 point per ₹10 spent
      });
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleOrderReady = (orderData) => {
    setCart([...cart, orderData]);
    setView('cart');
  };

  // Header Component
  const Header = () => (
    <header style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(0,0,0,0.1)',
      padding: '15px 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="container" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ 
            fontSize: '28px', 
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🍕 Pizza Pro
          </div>
          {view !== 'home' && (
            <button
              onClick={() => setView('home')}
              style={{
                background: 'rgba(255, 107, 53, 0.1)',
                border: '1px solid #ff6b35',
                color: '#ff6b35',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              ← Dashboard
            </button>
          )}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ textAlign: 'right', marginRight: '10px' }}>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>
              {user.name}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              ⭐ {stats.loyaltyPoints} Points
            </div>
          </div>
          <div style={{
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 'bold',
            color: 'white',
            cursor: 'pointer'
          }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <button 
            onClick={onLogout}
            style={{
              background: 'rgba(220, 53, 69, 0.1)',
              border: '1px solid #dc3545',
              color: '#dc3545',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );

  if (view === 'customize') {
    return (
      <div style={{ minHeight: '100vh', background: '#fafafa' }}>
        <Header />
        <PizzaCustomizer onOrderReady={handleOrderReady} />
      </div>
    );
  }

  if (view === 'orders') {
    return (
      <div style={{ minHeight: '100vh', background: '#fafafa' }}>
        <Header />
        <OrderTracking user={user} onBack={() => setView('home')} />
      </div>
    );
  }

  if (view === 'cart') {
    return (
      <div style={{ minHeight: '100vh', background: '#fafafa' }}>
        <Header />
        <div className="container" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
          {cart.length === 0 ? (
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '80px 40px',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
            }}>
              <div style={{ fontSize: '80px', marginBottom: '20px' }}>🛒</div>
              <h2 style={{ color: '#333', marginBottom: '15px', fontSize: '28px' }}>Your cart is empty</h2>
              <p style={{ color: '#666', marginBottom: '30px', fontSize: '16px' }}>
                Ready to create your perfect pizza?
              </p>
              <button 
                onClick={() => setView('customize')}
                className="btn-primary"
                style={{ fontSize: '18px', padding: '15px 35px' }}
              >
                Start Building Your Pizza 🍕
              </button>
            </div>
          ) : (
            <div>
              <h1 style={{ fontSize: '36px', marginBottom: '30px', color: '#333' }}>🛒 Your Cart</h1>
              <div style={{ display: 'grid', gap: '20px', marginBottom: '30px' }}>
                {cart.map((item, index) => (
                  <div key={index} style={{
                    background: 'white',
                    borderRadius: '15px',
                    padding: '25px',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                    border: '1px solid #f0f0f0'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h3 style={{ color: '#ff6b35', fontSize: '20px', marginBottom: '10px' }}>
                          🍕 Custom Pizza #{index + 1}
                        </h3>
                        <p style={{ color: '#666', margin: '5px 0' }}>
                          {item.size} {item.base} with {item.sauce} and {item.cheese}
                        </p>
                        <p style={{ color: '#666', margin: '5px 0' }}>
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                          ₹{item.totalPrice}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div style={{
                background: 'linear-gradient(135deg, #28a745, #20c997)',
                borderRadius: '20px',
                padding: '30px',
                color: 'white',
                textAlign: 'center'
              }}>
                <h2 style={{ fontSize: '32px', marginBottom: '20px' }}>
                  Total: ₹{cart.reduce((sum, item) => sum + item.totalPrice, 0)}
                </h2>
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button style={{
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: '2px solid rgba(255,255,255,0.3)',
                    padding: '15px 30px',
                    borderRadius: '50px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}>
                    Proceed to Checkout 💳
                  </button>
                  <button 
                    onClick={() => setView('customize')}
                    style={{
                      background: 'transparent',
                      color: 'white',
                      border: '2px solid rgba(255,255,255,0.5)',
                      padding: '15px 30px',
                      borderRadius: '50px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Add More Items +
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main Dashboard Home
  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <Header />
      
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
        color: 'white',
        padding: '60px 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        
        <div className="container" style={{ position: 'relative', textAlign: 'center', maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <h1 style={{ 
            fontSize: '42px', 
            fontWeight: 'bold', 
            marginBottom: '15px',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            Welcome back, {user.name}! 👋
          </h1>
          <p style={{ 
            fontSize: '18px', 
            opacity: 0.9,
            marginBottom: '40px'
          }}>
            Ready to create your next amazing pizza experience?
          </p>
          
          <button 
            onClick={() => setView('customize')}
            style={{
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.3)',
              padding: '18px 35px',
              borderRadius: '50px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Start Building Pizza 🍕
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '40px 0', background: 'white', borderBottom: '1px solid #f0f0f0' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '25px'
          }}>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff6b35', marginBottom: '5px' }}>
                {stats.totalOrders}
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>Total Orders</div>
            </div>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745', marginBottom: '5px' }}>
                ₹{stats.totalSpent}
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>Total Spent</div>
            </div>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#667eea', marginBottom: '5px' }}>
                {stats.loyaltyPoints}
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>Loyalty Points</div>
            </div>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#764ba2', marginBottom: '5px' }}>
                {stats.memberSince}
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>Member Since</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section style={{ padding: '50px 0' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ fontSize: '32px', textAlign: 'center', marginBottom: '40px', color: '#333' }}>
            What would you like to do?
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '25px'
          }}>
            <div 
              onClick={() => setView('customize')}
              className="card"
              style={{ 
                cursor: 'pointer',
                padding: '35px',
                textAlign: 'center',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
                color: 'white',
                border: 'none'
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🍕</div>
              <h3 style={{ fontSize: '24px', marginBottom: '15px', fontWeight: 'bold' }}>
                Build Custom Pizza
              </h3>
              <p style={{ opacity: 0.9, lineHeight: '1.6' }}>
                Create your perfect pizza with premium ingredients and artisanal bases
              </p>
            </div>

            <div 
              onClick={() => setView('orders')}
              className="card"
              style={{ 
                cursor: 'pointer',
                padding: '35px',
                textAlign: 'center',
                borderRadius: '20px'
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>📋</div>
              <h3 style={{ fontSize: '24px', marginBottom: '15px', color: '#333', fontWeight: 'bold' }}>
                Track Orders
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Real-time tracking with live updates and delivery notifications
              </p>
            </div>

            <div 
              onClick={() => setView('cart')}
              className="card"
              style={{ 
                cursor: 'pointer',
                padding: '35px',
                textAlign: 'center',
                borderRadius: '20px',
                position: 'relative'
              }}
            >
              {cart.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: '#ff6b35',
                  color: 'white',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>
                  {cart.length}
                </div>
              )}
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🛒</div>
              <h3 style={{ fontSize: '24px', marginBottom: '15px', color: '#333', fontWeight: 'bold' }}>
                View Cart
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Review selections and proceed to secure checkout
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <section style={{ padding: '50px 0', background: 'white' }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <h2 style={{ fontSize: '28px', marginBottom: '30px', color: '#333' }}>
              Recent Orders 📈
            </h2>
            <div style={{ display: 'grid', gap: '15px' }}>
              {recentOrders.slice(0, 3).map((order, index) => (
                <div key={index} style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid #f0f0f0',
                  cursor: 'pointer'
                }}
                onClick={() => setView('orders')}
                >
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '5px', color: '#333' }}>
                      Order #{order.orderNumber}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
                      ₹{order.pricing?.totalPrice}
                    </div>
                    <div className={`status-badge status-${order.orderStatus}`}>
                      {order.orderStatus}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
