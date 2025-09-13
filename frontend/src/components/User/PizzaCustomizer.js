import React, { useState, useEffect } from 'react';
import { fetchInventory, calculatePizzaPrice } from '../../utils/api';

const PizzaCustomizer = ({ onOrderReady }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [inventory, setInventory] = useState({
    bases: [],
    sauces: [],
    cheeses: [],
    vegetables: [],
    meats: []
  });
  const [selectedOptions, setSelectedOptions] = useState({
    base: '',
    sauce: '',
    cheese: '',
    vegetables: [],
    meats: [],
    size: 'medium',
    quantity: 1
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps = [
    { id: 0, name: 'Base', icon: '🍞', description: 'Choose your foundation' },
    { id: 1, name: 'Sauce', icon: '🍅', description: 'Select your sauce' },
    { id: 2, name: 'Cheese', icon: '🧀', description: 'Pick your cheese' },
    { id: 3, name: 'Vegetables', icon: '🥬', description: 'Add fresh veggies' },
    { id: 4, name: 'Meat', icon: '🥓', description: 'Choose your protein' },
    { id: 5, name: 'Size', icon: '📏', description: 'Select pizza size' },
    { id: 6, name: 'Review', icon: '✅', description: 'Final review' }
  ];

  useEffect(() => {
    loadInventory();
  }, []);

  useEffect(() => {
    if (selectedOptions.base && selectedOptions.sauce && selectedOptions.cheese) {
      calculatePrice();
    }
  }, [selectedOptions]);

  const loadInventory = async () => {
    try {
      const response = await fetchInventory();
      const items = response.data;
      
      setInventory({
        bases: items.filter(item => item.itemType === 'base'),
        sauces: items.filter(item => item.itemType === 'sauce'),
        cheeses: items.filter(item => item.itemType === 'cheese'),
        vegetables: items.filter(item => item.itemType === 'vegetable'),
        meats: items.filter(item => item.itemType === 'meat')
      });
      setLoading(false);
    } catch (error) {
      console.error('Error loading inventory:', error);
      setLoading(false);
    }
  };

  const calculatePrice = async () => {
    try {
      const response = await calculatePizzaPrice(selectedOptions);
      setTotalPrice(response.data.totalPrice);
    } catch (error) {
      console.error('Error calculating price:', error);
    }
  };

  const handleSingleSelect = (category, value) => {
    setSelectedOptions(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleMultipleSelect = (category, value) => {
    setSelectedOptions(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return selectedOptions.base;
      case 1: return selectedOptions.sauce;
      case 2: return selectedOptions.cheese;
      case 3: return true; // Vegetables are optional
      case 4: return true; // Meat is optional
      case 5: return selectedOptions.size;
      default: return true;
    }
  };

  const proceedToOrder = () => {
    if (!selectedOptions.base || !selectedOptions.sauce || !selectedOptions.cheese) {
      alert('Please complete all required steps to continue.');
      return;
    }

    const orderData = {
      ...selectedOptions,
      totalPrice: totalPrice
    };

    onOrderReady(orderData);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            border: '4px solid rgba(255,255,255,0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 30px'
          }}></div>
          <h2 style={{ fontSize: '28px', marginBottom: '10px' }}>Loading Fresh Ingredients...</h2>
          <p style={{ opacity: 0.8 }}>Preparing your customization experience</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        opacity: 0.5
      }} />

      {/* Professional Header */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.2)',
        padding: '20px 0',
        position: 'relative',
        zIndex: 100
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white' }}>
              🍕 Pizza Builder
            </div>
            <div style={{ 
              background: 'rgba(255,255,255,0.2)', 
              padding: '8px 16px', 
              borderRadius: '20px',
              color: 'white',
              fontSize: '14px'
            }}>
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
          
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'white',
            background: 'rgba(255,107,53,0.8)',
            padding: '12px 24px',
            borderRadius: '25px'
          }}>
            ₹{totalPrice}
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        backdropFilter: 'blur(10px)',
        padding: '30px 0',
        position: 'relative',
        zIndex: 10
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div 
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => setCurrentStep(index)}
                >
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: index <= currentStep 
                      ? 'linear-gradient(135deg, #ff6b35, #f7931e)' 
                      : 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    color: 'white',
                    fontWeight: 'bold',
                    transform: index === currentStep ? 'scale(1.1)' : 'scale(1)',
                    boxShadow: index === currentStep ? '0 10px 30px rgba(255,107,53,0.5)' : 'none'
                  }}>
                    {index < currentStep ? '✓' : step.icon}
                  </div>
                  <div style={{ 
                    marginTop: '10px', 
                    fontSize: '12px', 
                    color: 'white',
                    fontWeight: index === currentStep ? 'bold' : 'normal',
                    opacity: index === currentStep ? 1 : 0.7
                  }}>
                    {step.name}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div style={{
                    flex: 1,
                    height: '4px',
                    background: index < currentStep 
                      ? 'linear-gradient(90deg, #ff6b35, #f7931e)' 
                      : 'rgba(255,255,255,0.2)',
                    margin: '0 20px',
                    borderRadius: '2px',
                    transition: 'all 0.3s ease'
                  }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container" style={{ 
        padding: '40px 20px 100px',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '25px',
          padding: '50px',
          boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.2)',
          minHeight: '500px',
          opacity: isAnimating ? 0.5 : 1,
          transform: isAnimating ? 'translateY(20px)' : 'translateY(0)',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ 
              fontSize: '48px',
              marginBottom: '15px',
              background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {steps[currentStep].icon} {steps[currentStep].name}
            </h1>
            <p style={{ fontSize: '20px', color: '#666', marginBottom: '40px' }}>
              {steps[currentStep].description}
            </p>
          </div>

          {/* Step Content */}
          {renderStepContent()}

          {/* Navigation */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '50px',
            paddingTop: '30px',
            borderTop: '1px solid #eee'
          }}>
            <button 
              onClick={prevStep}
              disabled={currentStep === 0}
              style={{
                background: currentStep === 0 ? '#ddd' : 'transparent',
                color: currentStep === 0 ? '#999' : '#ff6b35',
                border: currentStep === 0 ? 'none' : '2px solid #ff6b35',
                padding: '15px 30px',
                borderRadius: '50px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              ← Previous
            </button>

            <div style={{ 
              background: '#f8f9fa',
              padding: '15px 25px',
              borderRadius: '20px',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#333'
            }}>
              Total: ₹{totalPrice}
            </div>

            {currentStep === steps.length - 1 ? (
              <button 
                onClick={proceedToOrder}
                disabled={!canProceed()}
                className="btn-primary"
                style={{ 
                  fontSize: '18px',
                  padding: '15px 35px'
                }}
              >
                Add to Cart 🛒
              </button>
            ) : (
              <button 
                onClick={nextStep}
                disabled={!canProceed()}
                className="btn-primary"
                style={{ 
                  fontSize: '16px',
                  padding: '15px 30px'
                }}
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  function renderStepContent() {
    const optionCardStyle = {
      background: 'white',
      borderRadius: '15px',
      padding: '25px',
      margin: '10px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: '2px solid #eee',
      textAlign: 'center',
      minHeight: '150px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      position: 'relative'
    };

    const selectedCardStyle = {
      ...optionCardStyle,
      border: '2px solid #ff6b35',
      background: 'linear-gradient(135deg, rgba(255,107,53,0.1), rgba(247,147,30,0.1))',
      transform: 'scale(1.05)',
      boxShadow: '0 10px 30px rgba(255,107,53,0.3)'
    };

    switch (currentStep) {
      case 0: // Base Selection
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
            {inventory.bases.map(base => (
              <div 
                key={base._id}
                style={selectedOptions.base === base.itemName ? selectedCardStyle : optionCardStyle}
                onClick={() => handleSingleSelect('base', base.itemName)}
              >
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>🍞</div>
                <h3 style={{ color: '#333', marginBottom: '10px' }}>{base.itemName}</h3>
                <p style={{ color: '#ff6b35', fontSize: '20px', fontWeight: 'bold' }}>₹{base.price}</p>
                <p style={{ color: '#666', fontSize: '14px' }}>{base.description}</p>
                {base.stock <= base.threshold && (
                  <div style={{ 
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    background: '#ff9800',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '15px',
                    fontSize: '10px',
                    fontWeight: 'bold'
                  }}>
                    Low Stock
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 1: // Sauce Selection
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
            {inventory.sauces.map(sauce => (
              <div 
                key={sauce._id}
                style={selectedOptions.sauce === sauce.itemName ? selectedCardStyle : optionCardStyle}
                onClick={() => handleSingleSelect('sauce', sauce.itemName)}
              >
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>🍅</div>
                <h3 style={{ color: '#333', marginBottom: '10px' }}>{sauce.itemName}</h3>
                <p style={{ color: '#ff6b35', fontSize: '20px', fontWeight: 'bold' }}>₹{sauce.price}</p>
                <p style={{ color: '#666', fontSize: '14px' }}>{sauce.description}</p>
              </div>
            ))}
          </div>
        );

      case 2: // Cheese Selection
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
            {inventory.cheeses.map(cheese => (
              <div 
                key={cheese._id}
                style={selectedOptions.cheese === cheese.itemName ? selectedCardStyle : optionCardStyle}
                onClick={() => handleSingleSelect('cheese', cheese.itemName)}
              >
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>🧀</div>
                <h3 style={{ color: '#333', marginBottom: '10px' }}>{cheese.itemName}</h3>
                <p style={{ color: '#ff6b35', fontSize: '20px', fontWeight: 'bold' }}>₹{cheese.price}</p>
                <p style={{ color: '#666', fontSize: '14px' }}>{cheese.description}</p>
              </div>
            ))}
          </div>
        );

      case 3: // Vegetables Selection
        return (
          <div>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px', fontSize: '16px' }}>
              Select as many vegetables as you'd like (optional)
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
              {inventory.vegetables.map(vegetable => (
                <div 
                  key={vegetable._id}
                  style={selectedOptions.vegetables.includes(vegetable.itemName) ? selectedCardStyle : optionCardStyle}
                  onClick={() => handleMultipleSelect('vegetables', vegetable.itemName)}
                >
                  <div style={{ fontSize: '40px', marginBottom: '10px' }}>🥬</div>
                  <h4 style={{ color: '#333', marginBottom: '8px' }}>{vegetable.itemName}</h4>
                  <p style={{ color: '#ff6b35', fontSize: '18px', fontWeight: 'bold' }}>₹{vegetable.price}</p>
                  <p style={{ color: '#666', fontSize: '12px' }}>{vegetable.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 4: // Meat Selection
        return (
          <div>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px', fontSize: '16px' }}>
              Add premium meats to your pizza (optional)
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
              {inventory.meats.map(meat => (
                <div 
                  key={meat._id}
                  style={selectedOptions.meats.includes(meat.itemName) ? selectedCardStyle : optionCardStyle}
                  onClick={() => handleMultipleSelect('meats', meat.itemName)}
                >
                  <div style={{ fontSize: '40px', marginBottom: '10px' }}>🥓</div>
                  <h4 style={{ color: '#333', marginBottom: '8px' }}>{meat.itemName}</h4>
                  <p style={{ color: '#ff6b35', fontSize: '18px', fontWeight: 'bold' }}>₹{meat.price}</p>
                  <p style={{ color: '#666', fontSize: '12px' }}>{meat.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 5: // Size Selection
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '30px' }}>
            {[
              { size: 'small', label: 'Personal (8")', multiplier: '1.0x', description: 'Perfect for 1 person', emoji: '🍕' },
              { size: 'medium', label: 'Regular (12")', multiplier: '1.3x', description: 'Great for 2-3 people', emoji: '🍕🍕' },
              { size: 'large', label: 'Large (16")', multiplier: '1.6x', description: 'Ideal for 3-4 people', emoji: '🍕🍕🍕' },
              { size: 'extra-large', label: 'Family (20")', multiplier: '2.0x', description: 'Perfect for 4-6 people', emoji: '🍕🍕🍕🍕' }
            ].map(option => (
              <div 
                key={option.size}
                style={selectedOptions.size === option.size ? selectedCardStyle : optionCardStyle}
                onClick={() => handleSingleSelect('size', option.size)}
              >
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>{option.emoji}</div>
                <h3 style={{ color: '#333', marginBottom: '10px' }}>{option.label}</h3>
                <p style={{ color: '#ff6b35', fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>
                  {option.multiplier}
                </p>
                <p style={{ color: '#666', fontSize: '14px' }}>{option.description}</p>
              </div>
            ))}
          </div>
        );

      case 6: // Review
        return (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{
              background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
              borderRadius: '20px',
              padding: '40px',
              color: 'white',
              marginBottom: '30px'
            }}>
              <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '32px' }}>
                Your Perfect Pizza 🍕
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                <div>
                  <p><strong>Base:</strong> {selectedOptions.base}</p>
                  <p><strong>Sauce:</strong> {selectedOptions.sauce}</p>
                  <p><strong>Cheese:</strong> {selectedOptions.cheese}</p>
                </div>
                <div>
                  <p><strong>Size:</strong> {selectedOptions.size}</p>
                  <p><strong>Quantity:</strong> {selectedOptions.quantity}</p>
                  {selectedOptions.vegetables.length > 0 && (
                    <p><strong>Vegetables:</strong> {selectedOptions.vegetables.join(', ')}</p>
                  )}
                  {selectedOptions.meats.length > 0 && (
                    <p><strong>Meats:</strong> {selectedOptions.meats.join(', ')}</p>
                  )}
                </div>
              </div>

              <div style={{
                textAlign: 'center',
                padding: '20px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '15px',
                backdropFilter: 'blur(10px)'
              }}>
                <h3 style={{ fontSize: '36px', margin: '0' }}>₹{totalPrice}</h3>
                <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>Total Amount</p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div style={{
              background: 'white',
              borderRadius: '15px',
              padding: '30px',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginBottom: '20px' }}>Quantity</h3>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '20px'
              }}>
                <button 
                  onClick={() => handleSingleSelect('quantity', Math.max(1, selectedOptions.quantity - 1))}
                  style={{ 
                    width: '50px', 
                    height: '50px', 
                    borderRadius: '50%',
                    background: '#ff6b35',
                    color: 'white',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer'
                  }}
                >
                  -
                </button>
                <span style={{ 
                  fontSize: '32px', 
                  fontWeight: 'bold',
                  minWidth: '60px',
                  color: '#333'
                }}>
                  {selectedOptions.quantity}
                </span>
                <button 
                  onClick={() => handleSingleSelect('quantity', selectedOptions.quantity + 1)}
                  style={{ 
                    width: '50px', 
                    height: '50px', 
                    borderRadius: '50%',
                    background: '#ff6b35',
                    color: 'white',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer'
                  }}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  }
};

export default PizzaCustomizer;
