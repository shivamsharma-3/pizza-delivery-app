import React, { useState } from 'react';
import { loginUser } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const LoginCustomer = ({ setUser }) => {
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
      
      // Check if user is a customer (not admin)
      if (response.data.user.role !== 'user') {
        throw new Error('This is not a customer account. Please use admin login.');
      }
      
      // Store token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Update user state
      setUser(response.data.user);
      
      // Navigate to customer dashboard
      navigate('/customer/dashboard');
    } catch (error) {
      console.error('Customer login error:', error);
      setError(error.response?.data?.message || error.message || 'Login failed');
    }
    
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ff8a65 100%)',
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
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        opacity: 0.5
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
          }}>🍕</div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px'
          }}>
            Customer Login
          </h1>
          <p style={{
            color: '#666',
            fontSize: '16px',
            margin: 0
          }}>
            Welcome back to Pizza Pro! 👋
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
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              style={{
                fontSize: '16px',
                padding: '18px 20px'
              }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
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
            className="btn-primary"
            style={{
              width: '100%',
              fontSize: '18px',
              padding: '18px',
              marginTop: '10px',
              position: 'relative'
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
                Logging in...
              </div>
            ) : (
              'Login to Pizza Pro'
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
            Are you a restaurant staff member?
          </p>
          <button
            onClick={() => navigate('/admin/login')}
            style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
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
            Admin Login →
          </button>

          <div style={{ fontSize: '14px', color: '#666' }}>
            New to Pizza Pro?{' '}
            <button
              onClick={() => navigate('/register')}
              style={{
                background: 'none',
                border: 'none',
                color: '#ff6b35',
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
          background: 'rgba(102, 126, 234, 0.1)',
          borderRadius: '12px',
          fontSize: '12px',
          color: '#666'
        }}>
          <strong style={{ color: '#333' }}>Demo Customer Account:</strong><br/>
          Email: customer@test.com<br/>
          Password: password123
        </div>
      </div>
    </div>
  );
};

export default LoginCustomer;
