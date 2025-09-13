import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LandingPage from './components/Landing/LandingPage';
import LoginCustomer from './components/Auth/LoginCustomer';
import LoginAdmin from './components/Auth/LoginAdmin';
import Register from './components/Auth/Register';
import Dashboard from './components/User/Dashboard';
import AdminDashboard from './components/Admin/AdminDashboard';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
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
          <h2>Loading Pizza Pro...</h2>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={
            user ? (
              user.role === 'admin' ? 
                <Navigate to="/admin/dashboard" /> : 
                <Navigate to="/customer/dashboard" />
            ) : (
              <LandingPage />
            )
          } />

          {/* Customer Login */}
          <Route path="/login" element={
            user ? (
              user.role === 'admin' ? 
                <Navigate to="/admin/dashboard" /> : 
                <Navigate to="/customer/dashboard" />
            ) : (
              <LoginCustomer setUser={setUser} />
            )
          } />

          {/* Admin Login */}
          <Route path="/admin/login" element={
            user ? (
              user.role === 'admin' ? 
                <Navigate to="/admin/dashboard" /> : 
                <Navigate to="/customer/dashboard" />
            ) : (
              <LoginAdmin setUser={setUser} />
            )
          } />

          {/* Customer Registration */}
          <Route path="/register" element={
            user ? (
              user.role === 'admin' ? 
                <Navigate to="/admin/dashboard" /> : 
                <Navigate to="/customer/dashboard" />
            ) : (
              <Register setUser={setUser} />
            )
          } />

          {/* Customer Dashboard */}
          <Route path="/customer/dashboard" element={
            user && user.role === 'user' ? (
              <Dashboard user={user} onLogout={handleLogout} />
            ) : user && user.role === 'admin' ? (
              <Navigate to="/admin/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          } />

          {/* Admin Dashboard */}
          <Route path="/admin/dashboard" element={
            user && user.role === 'admin' ? (
              <AdminDashboard user={user} onLogout={handleLogout} />
            ) : user && user.role === 'user' ? (
              <Navigate to="/customer/dashboard" />
            ) : (
              <Navigate to="/admin/login" />
            )
          } />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
