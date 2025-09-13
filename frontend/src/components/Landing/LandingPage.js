import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    padding: '15px 0',
    transition: 'all 0.3s ease',
    background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
    backdropFilter: scrolled ? 'blur(10px)' : 'none',
    borderBottom: scrolled ? '1px solid rgba(0,0,0,0.1)' : 'none'
  };

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'Menu', href: '#menu' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <div>
      {/* Professional Header */}
      <header style={headerStyle}>
        <nav className="container" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          {/* Logo */}
          <div style={{ 
            fontSize: '28px', 
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🍕 Pizza Pro
          </div>

          {/* Desktop Navigation */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '40px',
            '@media (max-width: 768px)': { display: 'none' }
          }}>
            {navItems.map((item) => (
              <a key={item.name} href={item.href} style={{
                textDecoration: 'none',
                color: scrolled ? '#333' : 'white',
                fontWeight: '500',
                transition: 'color 0.3s ease',
                ':hover': { color: '#ff6b35' }
              }}>
                {item.name}
              </a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <button 
              onClick={() => navigate('/login')}
              style={{
                background: 'transparent',
                border: scrolled ? '2px solid #ff6b35' : '2px solid white',
                color: scrolled ? '#ff6b35' : 'white',
                padding: '10px 20px',
                borderRadius: '25px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="btn-primary"
            >
              Get Started
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ff8a65 100%)',
        display: 'flex',
        alignItems: 'center',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Animation */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          animation: 'float 6s ease-in-out infinite'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h1 className="hero-title fade-in">
              World's Most <br />
              <span style={{ color: '#FFE082' }}>Delicious</span> Pizza
            </h1>
            <p className="hero-subtitle fade-in" style={{ color: 'rgba(255,255,255,0.9)' }}>
              Crafted with premium ingredients, baked to perfection, and delivered hot to your doorstep. 
              Experience the taste that millions love worldwide.
            </p>
            
            <div style={{ 
              display: 'flex', 
              gap: '20px', 
              justifyContent: 'center',
              marginTop: '40px',
              flexWrap: 'wrap'
            }}>
              <button 
                onClick={() => navigate('/register')}
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
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.3)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.2)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Order Now 🍕
              </button>
              <button 
                onClick={() => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' })}
                style={{
                  background: 'transparent',
                  color: 'white',
                  border: '2px solid rgba(255,255,255,0.5)',
                  padding: '18px 35px',
                  borderRadius: '50px',
                  fontSize: '18px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Explore Menu
              </button>
            </div>

            {/* Stats */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '40px',
              marginTop: '80px',
              padding: '40px 0'
            }}>
              <div className="fade-in">
                <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '10px' }}>1M+</div>
                <div style={{ color: 'rgba(255,255,255,0.8)' }}>Happy Customers</div>
              </div>
              <div className="fade-in">
                <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '10px' }}>50k+</div>
                <div style={{ color: 'rgba(255,255,255,0.8)' }}>Orders Daily</div>
              </div>
              <div className="fade-in">
                <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '10px' }}>99%</div>
                <div style={{ color: 'rgba(255,255,255,0.8)' }}>Satisfaction</div>
              </div>
              <div className="fade-in">
                <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '10px' }}>15min</div>
                <div style={{ color: 'rgba(255,255,255,0.8)' }}>Avg Delivery</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="menu" className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 className="section-title">Why Choose Pizza Pro?</h2>
            <p className="section-subtitle">
              We're not just another pizza place. We're the premium pizza experience.
            </p>
          </div>

          <div className="grid grid-3">
            <div className="card">
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🚀</div>
              <h3 style={{ marginBottom: '15px', color: '#333' }}>Lightning Fast Delivery</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Average 15-minute delivery with real-time tracking. Your pizza arrives hot and fresh, guaranteed.
              </p>
            </div>

            <div className="card">
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>👨‍🍳</div>
              <h3 style={{ marginBottom: '15px', color: '#333' }}>Master Chefs</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Our Italian-trained chefs use traditional techniques with premium ingredients from around the world.
              </p>
            </div>

            <div className="card">
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📱</div>
              <h3 style={{ marginBottom: '15px', color: '#333' }}>Smart Technology</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Advanced order tracking, AI-powered recommendations, and seamless payment experience.
              </p>
            </div>

            <div className="card">
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🌿</div>
              <h3 style={{ marginBottom: '15px', color: '#333' }}>Fresh Ingredients</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Sourced daily from local farms. No preservatives, no artificial flavors. Pure, natural taste.
              </p>
            </div>

            <div className="card">
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>💎</div>
              <h3 style={{ marginBottom: '15px', color: '#333' }}>Premium Quality</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Every pizza is crafted to perfection. If you're not 100% satisfied, we'll remake it for free.
              </p>
            </div>

            <div className="card">
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎯</div>
              <h3 style={{ marginBottom: '15px', color: '#333' }}>Personalized Experience</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Custom recommendations based on your preferences. Every order is tailored just for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '100px 0'
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '20px', fontWeight: 'bold' }}>
            Ready to Experience Pizza Perfection?
          </h2>
          <p style={{ fontSize: '1.3rem', marginBottom: '40px', opacity: 0.9 }}>
            Join millions of satisfied customers worldwide. Start your journey today.
          </p>
          <button 
            onClick={() => navigate('/register')}
            style={{
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.3)',
              padding: '20px 40px',
              borderRadius: '50px',
              fontSize: '20px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Start Ordering Now → 
          </button>
        </div>
      </section>

      {/* Professional Footer */}
      <footer style={{
        background: '#1a1a1a',
        color: 'white',
        padding: '80px 0 40px'
      }}>
        <div className="container">
          <div className="grid grid-4" style={{ marginBottom: '60px' }}>
            <div>
              <div style={{ 
                fontSize: '28px', 
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '20px'
              }}>
                🍕 Pizza Pro
              </div>
              <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '20px' }}>
                The world's most loved pizza delivery service. Premium quality, lightning-fast delivery, 
                and unmatched customer satisfaction.
              </p>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  background: '#ff6b35', 
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}>📘</div>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  background: '#ff6b35', 
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}>🐦</div>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  background: '#ff6b35', 
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}>📷</div>
              </div>
            </div>

            <div>
              <h3 style={{ marginBottom: '20px', color: '#ff6b35' }}>Quick Links</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a href="#" style={{ color: '#aaa', textDecoration: 'none' }}>Order Now</a>
                <a href="#" style={{ color: '#aaa', textDecoration: 'none' }}>Track Order</a>
                <a href="#" style={{ color: '#aaa', textDecoration: 'none' }}>Menu</a>
                <a href="#" style={{ color: '#aaa', textDecoration: 'none' }}>Locations</a>
                <a href="#" style={{ color: '#aaa', textDecoration: 'none' }}>Careers</a>
              </div>
            </div>

            <div>
              <h3 style={{ marginBottom: '20px', color: '#ff6b35' }}>Support</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a href="#" style={{ color: '#aaa', textDecoration: 'none' }}>Help Center</a>
                <a href="#" style={{ color: '#aaa', textDecoration: 'none' }}>Contact Us</a>
                <a href="#" style={{ color: '#aaa', textDecoration: 'none' }}>Privacy Policy</a>
                <a href="#" style={{ color: '#aaa', textDecoration: 'none' }}>Terms of Service</a>
                <a href="#" style={{ color: '#aaa', textDecoration: 'none' }}>Refund Policy</a>
              </div>
            </div>

            <div>
              <h3 style={{ marginBottom: '20px', color: '#ff6b35' }}>Contact Info</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', color: '#aaa' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>📞</span> +1-800-PIZZA-PRO
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>✉️</span> hello@pizzapro.com
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>📍</span> 123 Pizza Street, Flavor City
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>🕐</span> 24/7 Open
                </div>
              </div>
            </div>
          </div>

          <div style={{ 
            borderTop: '1px solid #333',
            paddingTop: '30px',
            textAlign: 'center',
            color: '#666'
          }}>
            <p>© 2025 Pizza Pro. All rights reserved. | Built with ❤️ for pizza lovers worldwide</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
