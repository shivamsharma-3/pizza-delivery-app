import React, { useState, useEffect } from 'react';
import { getAdminDashboard, getAdminOrders, updateOrderStatus } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [ordersData, setOrdersData] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    todayOrders: 0,
    totalRevenue: 0,
    lowStockItems: 0
  });

  useEffect(() => {
    loadDashboard();
    loadOrders();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await getAdminDashboard();
      setDashboardData(response.data);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const response = await getAdminOrders({ limit: 5 });
      setOrdersData(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleLogoutClick = () => {
    onLogout();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(255,255,255,0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <h2>Loading Admin Panel...</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f4f6f8' }}>
      {/* Admin Header */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid #e0e0e0',
        padding: '15px 0',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div className="container" style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              fontSize: '28px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              🛡️ Pizza Pro Admin
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>{user.name}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>{user.email}</div>
            </div>
            <button
              onClick={handleLogoutClick}
              style={{
                background: 'rgba(220,53,69,0.1)',
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

      {/* Stats Overview */}
      <section style={{
        padding: '40px 0',
        background: 'white',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <div className="container" style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '25px'
          }}>
            <StatCard icon="👥" label="Users" value={stats.totalUsers} color="#28a745" />
            <StatCard icon="📦" label="Total Orders" value={stats.totalOrders} color="#ff6b35" />
            <StatCard icon="🕒" label="Today's Orders" value={stats.todayOrders} color="#17a2b8" />
            <StatCard icon="💰" label="Revenue" value={`₹${stats.totalRevenue}`} color="#ffc107" />
            <StatCard icon="⚠️" label="Low Stock" value={stats.lowStockItems} color="#dc3545" />
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section style={{ padding: '40px 0' }}>
        <div className="container" style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <h2 style={{
            fontSize: '24px',
            marginBottom: '20px',
            color: '#333'
          }}>
            Quick Actions
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '20px'
          }}>
            <ActionCard label="Manage Orders" onClick={() => navigate('/admin/dashboard')} />
            <ActionCard label="Manage Inventory" onClick={() => alert('Inventory Module Coming Soon')} />
            <ActionCard label="User Management" onClick={() => alert('User Management Coming Soon')} />
            <ActionCard label="Analytics" onClick={() => alert('Analytics Coming Soon')} />
          </div>
        </div>
      </section>

      {/* Recent Orders Table */}
      <section style={{ padding: '40px 0', background: 'white' }}>
        <div className="container" style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <h2 style={{
            fontSize: '24px',
            marginBottom: '20px',
            color: '#333'
          }}>
            Recent Orders
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              background: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <thead style={{ background: '#f8f9fa' }}>
                <tr>
                  <th style={thStyle}>Order #</th>
                  <th style={thStyle}>Customer</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Amount</th>
                  <th style={thStyle}>Date</th>
                </tr>
              </thead>
              <tbody>
                {ordersData.map((order) => (
                  <tr key={order._id} style={{ cursor: 'pointer' }} onClick={() => alert(`View Order ${order.orderNumber}`)}>
                    <td style={tdStyle}>{order.orderNumber}</td>
                    <td style={tdStyle}>{order.userId?.name}</td>
                    <td style={tdStyle}>
                      <span style={{
                        ...badgeStyle,
                        background: order.orderStatus === 'delivered' ? '#e8f5e9' : '#fff3cd',
                        color: order.orderStatus === 'delivered' ? '#388e3c' : '#856404'
                      }}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td style={tdStyle}>₹{order.pricing?.totalPrice}</td>
                    <td style={tdStyle}>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

// Reusable components

const StatCard = ({ icon, label, value, color }) => (
  <div style={{
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
    border: `1px solid ${color}`,
    color: '#333'
  }}>
    <div style={{ fontSize: '32px', marginBottom: '10px' }}>{icon}</div>
    <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' }}>{value}</div>
    <div style={{ fontSize: '14px', color: '#666' }}>{label}</div>
  </div>
);

const ActionCard = ({ label, onClick }) => (
  <div 
    onClick={onClick}
    style={{
      background: '#fff',
      borderRadius: '12px',
      padding: '20px',
      textAlign: 'center',
      boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    }}
    onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
    onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
  >
    <div style={{ fontSize: '24px', marginBottom: '10px' }}>🛠️</div>
    <div style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>{label}</div>
  </div>
);

const thStyle = {
  padding: '12px', textAlign: 'left', fontSize: '14px', color: '#666'
};

const tdStyle = {
  padding: '12px', borderTop: '1px solid #e0e0e0', fontSize: '14px', color: '#333'
};

const badgeStyle = {
  display: 'inline-block',
  padding: '4px 12px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: '600'
};

export default AdminDashboard;
