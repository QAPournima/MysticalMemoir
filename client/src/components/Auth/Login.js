import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import AuthBackgroundMusic from '../UI/AuthBackgroundMusic';
import './Auth.css';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Check if user already has a house assigned
  const { getHouseInfo } = useTheme();
  const currentHouse = localStorage.getItem('selected_house');
  const houseInfo = currentHouse ? getHouseInfo(currentHouse) : null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate login API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any email/password
      if (formData.email && formData.password) {
        // Set authentication in localStorage
        localStorage.setItem('user_authenticated', 'true');
        localStorage.setItem('user_email', formData.email);
        
        // Call the parent onLogin function
        if (onLogin) {
          onLogin();
        }
        
        // Navigate to home page
        navigate('/home', { replace: true });
      } else {
        throw new Error('Please fill in all fields');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <AuthBackgroundMusic isPlaying={true} />
      <div className="magical-background">
        <div className="stars"></div>
        <div className="floating-particles">
          {['✨', '🪄', '⚡', '🔮', '🦉', '📜', '🕯️', '⭐'].map((symbol, index) => (
            <span key={index} className={`floating-symbol symbol-${index}`}>
              {symbol}
            </span>
          ))}
        </div>
      </div>

      <div className="auth-content">
        <div className="auth-header">
          <div className="app-logo">
            <h1 className="logo-text">Mystical Memoir</h1>
            <div className="logo-subtitle">Enchanted Journal</div>
          </div>
        </div>

        <div className="auth-card">
          <div className="magical-sparkles"></div>
          <div className="auth-form-header">
            <h2 className="auth-title">Welcome Back</h2>
            <p className="auth-subtitle">
              Enter your credentials to access your mystical memoir
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="magical-input"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="magical-input"
                placeholder="Enter your mystical password"
                required
              />
            </div>

            <button
              type="submit"
              className={`auth-button ${currentHouse ? currentHouse + '-button' : 'mystical-button'}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Connecting...
                </>
              ) : (
                <>
                  <span className="button-icon">✨</span>
                  Enter the Mystical Realm
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p className="auth-link-text">
              New to the mystical realm?{' '}
              <Link to="/signup" className="auth-link">
                Create your mystical account
              </Link>
            </p>
          </div>

          <div className="house-badge">
            <div className="house-info">
              {houseInfo ? (
                <span className="house-mascot-only">{houseInfo.mascot}</span>
              ) : (
                <span className="house-mascot-only">🏰</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 