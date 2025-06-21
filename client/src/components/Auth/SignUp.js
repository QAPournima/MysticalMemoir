import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import ElementDiscovery from './SortingCeremony';
import AuthBackgroundMusic from '../UI/AuthBackgroundMusic';
import './Auth.css';

const SignUp = ({ onSignUp }) => {
  const { ELEMENTS, getElementInfo } = useTheme();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('form'); // 'form', 'discovery', 'complete'
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    selectedElement: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const elementInfo = formData.selectedElement ? getElementInfo(formData.selectedElement) : null;

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
      // Validation
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Simulate form validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Move to element discovery
      setCurrentStep('discovery');
    } catch (err) {
      setError(err.message || 'Please check your information and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscoveryComplete = async (discoveredElement) => {
    try {
      // Save user data with discovered element
      localStorage.setItem('user_authenticated', 'true');
      localStorage.setItem('user_email', formData.email);
      localStorage.setItem('user_name', `${formData.firstName} ${formData.lastName}`);
      localStorage.setItem('selected_house', discoveredElement); // Keep for backwards compatibility
      localStorage.setItem('selected_element', discoveredElement);
      
      // Update form data
      setFormData(prev => ({ ...prev, selectedElement: discoveredElement }));
      
      // Complete signup and navigate to home
      if (onSignUp) onSignUp();
      
      // Navigate to home page after a short delay
      setTimeout(() => {
        navigate('/home');
      }, 100);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  // Show element discovery if in discovery step
  if (currentStep === 'discovery') {
    return (
      <ElementDiscovery 
        onSorted={handleDiscoveryComplete}
        userName={`${formData.firstName} ${formData.lastName}`}
        userData={formData}
      />
    );
  }

  return (
    <div className="auth-container">
      <AuthBackgroundMusic isPlaying={true} />
      <div className="magical-background">
        <div className="stars"></div>
        <div className="floating-particles">
          {['✨', '🪄', '⚡', '🔮', '🦉', '📜', '🕯️', '⭐', '🌟', '💫'].map((symbol, index) => (
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

        <div className="auth-card signup-card">
          <div className="magical-sparkles"></div>
          <div className="auth-form-header">
            <h2 className="auth-title">Begin Your Journey</h2>
            <p className="auth-subtitle">
              Enter your details to proceed to Element Discovery
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="magical-input"
                  placeholder="Your first name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName" className="form-label">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="magical-input"
                  placeholder="Your last name"
                  required
                />
              </div>
            </div>

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
              <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="magical-input"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="magical-input"
                  placeholder="Create a secure password"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="magical-input"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="auth-button mystical-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Preparing for Discovery...
                </>
              ) : (
                <>
                  <img src="/image/SortingHat .gif" alt="Mystic Oracle" className="button-icon" />
                  Continue to Element Discovery
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <div className="auth-footer-buttons">
              <Link to="/login" className="auth-secondary-button">
                <span className="button-icon">✨</span>
                Back to Login
              </Link>
            </div>
            <p className="auth-link-text">
              Already have an account?
            </p>
          </div>

          <div className="house-badge">
            <div className="house-info">
              <img src="/image/SortingHat .gif" alt="Mystic Oracle" className="house-mascot-only-gif" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp; 