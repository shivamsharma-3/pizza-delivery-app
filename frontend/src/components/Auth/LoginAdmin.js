import React, { useState } from 'react';
import { loginUser } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const LoginAdmin = ({ setUser }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await loginUser(formData);
      
      // Check if user is an admin (not customer)
      if (response.data.user.role !== 'admin') {
        throw new Error('This is not an admin account. Please use customer login.');
      }
      
      // Store token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Update user state
      setUser(response.data.user);
      
      // Navigate to admin dashboard
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Admin login error:', error);
      setError(error.response?.data?.message || error.message || 'Login failed');
    }
    
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #896ab8 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
        opacity: 0.3
      }} />

      {/* Login Form */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '450px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '25px',
        padding: '50px 40px',
        boxShadow: '0 30px 60px rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '15px'
          }}>🛡️</div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px'
          }}>
            Admin Login
          </h1>
          <p style={{
            color: '#666',
            fontSize: '16px',
            margin: 0
          }}>
            Pizza Pro Staff & Administration Portal
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: 'rgba(244, 67, 54, 0.1)',
            border: '1px solid #f44336',
            borderRadius: '12px',
            padding: '15px',
            marginBottom: '25px',
            color: '#d32f2f',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Admin Email</label>
            <input
              className="form-input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your admin email"
              required
              style={{
                fontSize: '16px',
                padding: '18px 20px'
              }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Admin Password</label>
            <input
              className="form-input"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your admin password"
              required
              style={{
                fontSize: '16px',
                padding: '18px 20px'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              fontSize: '18px',
              padding: '18px',
              marginTop: '10px',
              background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: loading ? 'none' : '0 4px 15px rgba(102, 126, 234, 0.4)'
            }}
          >
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Authenticating...
              </div>
            ) : (
              'Access Admin Panel'
            )}
          </button>
        </form>

        {/* Links */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '30px',
          paddingTop: '25px',
          borderTop: '1px solid #eee'
        }}>
          <p style={{ 
            fontSize: '14px', 
            color: '#666',
            marginBottom: '15px'
          }}>
            Are you a customer looking to order?
          </p>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
              color: 'white',
              border: 'none',
              padding: '12px 25px',
              borderRadius: '25px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              marginBottom: '20px'
            }}
          >
            Customer Login →
          </button>

          <div style={{ fontSize: '14px', color: '#666' }}>
            New customer?{' '}
            <button
              onClick={() => navigate('/register')}
              style={{
                background: 'none',
                border: 'none',
                color: '#667eea',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Demo Credentials */}
        <div style={{
          marginTop: '25px',
          padding: '20px',
          background: 'rgba(255, 107, 53, 0.1)',
          borderRadius: '12px',
          fontSize: '12px',
          color: '#666'
        }}>
          <strong style={{ color: '#333' }}>Demo Admin Account:</strong><br/>
          Email: admin@pizzadelivery.com<br/>
          Password: admin123
        </div>

        {/* Security Notice */}
        <div style={{
          marginTop: '15px',
          padding: '15px',
          background: 'rgba(0, 0, 0, 0.05)',
          borderRadius: '10px',
          fontSize: '11px',
          color: '#555',
          textAlign: 'center'
        }}>
          🔒 This is a secure admin portal. All activities are logged and monitored.
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;
