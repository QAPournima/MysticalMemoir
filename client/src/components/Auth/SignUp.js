import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import SortingCeremony from './SortingCeremony';
import './Auth.css';

const SignUp = ({ onSignUp }) => {
  const { HOUSES, getHouseInfo } = useTheme();
  const [currentStep, setCurrentStep] = useState('form'); // 'form', 'sorting', 'complete'
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    selectedHouse: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const houseInfo = formData.selectedHouse ? getHouseInfo(formData.selectedHouse) : null;

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
      
      // Move to sorting ceremony
      setCurrentStep('sorting');
    } catch (err) {
      setError(err.message || 'Please check your information and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortingComplete = async (sortedHouse) => {
    try {
      // Save user data with sorted house
      localStorage.setItem('user_authenticated', 'true');
      localStorage.setItem('user_email', formData.email);
      localStorage.setItem('user_name', `${formData.firstName} ${formData.lastName}`);
      localStorage.setItem('selected_house', sortedHouse);
      
      // Update form data
      setFormData(prev => ({ ...prev, selectedHouse: sortedHouse }));
      
      // Complete signup
      if (onSignUp) onSignUp();
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  // Show sorting ceremony if in sorting step
  if (currentStep === 'sorting') {
    return (
      <SortingCeremony 
        onSorted={handleSortingComplete}
        userName={`${formData.firstName} ${formData.lastName}`}
      />
    );
  }

  return (
    <div className="auth-container">
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
            <h1 className="logo-text">Harry Potter</h1>
            <div className="logo-subtitle">Magical Diary</div>
          </div>
        </div>

        <div className="auth-card signup-card">
          <div className="auth-form-header">
            <h2 className="auth-title">Begin Your Journey</h2>
            <p className="auth-subtitle">
              Enter your details to proceed to the Sorting Ceremony
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
                  placeholder="Harry"
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
                  placeholder="Potter"
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
                placeholder="your.email@hogwarts.edu"
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
                  placeholder="Create a magical password"
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
              className="auth-button gryffindor-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Preparing for Sorting...
                </>
              ) : (
                <>
                  <span className="button-icon">🎩</span>
                  Continue to Sorting Ceremony
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p className="auth-link-text">
              Already have a magical account?{' '}
              <Link to="/login" className="auth-link">
                Sign in here
              </Link>
            </p>
          </div>

          <div className="house-badge">
            <div className="house-info">
              <span className="house-mascot">🎩</span>
              <span className="house-name">Awaiting Sorting</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp; 