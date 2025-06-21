import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import './Navbar.css';

const Navbar = ({ currentHouse, setCurrentHouse, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showElementSelector, setShowElementSelector] = useState(false);
  const location = useLocation();
  const { getElementInfo, ELEMENTS, changeElement } = useTheme();

  const currentElementInfo = getElementInfo(currentHouse);

  const navigationItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/diary', label: 'Memoir', icon: '📖' },
    { path: '/todos', label: 'Tasks', icon: '📝' },
    { path: '/drawing', label: 'Draw', icon: '🎨' },
    { path: '/gallery', label: 'Gallery', icon: '🖼️' },
    { path: '/settings', label: 'Settings', icon: '⚙️' }
  ];

  const handleElementChange = (element) => {
    console.log('✨ Navbar element change requested:', element);
    setCurrentHouse(element); // Still using setCurrentHouse for backwards compatibility
    changeElement(element); // This will trigger the notification and save to localStorage
    setShowElementSelector(false);
    // Add magical effect
    document.body.classList.add('element-changing');
    setTimeout(() => {
      document.body.classList.remove('element-changing');
    }, 500);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`magical-navbar ${currentHouse}-theme`}>
      <div className="navbar-container">
        {/* Logo and Title */}
        <div className="navbar-brand">
          <Link to="/" className="brand-link">
            <div className="brand-icon">✨</div>
            <div className="brand-text">
              <h1 className="brand-title">Mystical Memoir</h1>
              <p className="brand-subtitle">{currentElementInfo.name}</p>
            </div>
          </Link>
        </div>

        {/* Element Selector */}
        <div className="house-selector-container">
          <button
            className="house-selector-btn"
            onClick={() => setShowElementSelector(!showElementSelector)}
          >
            <span className="house-mascot">{currentElementInfo.mascot}</span>
            <span className="house-name">{currentElementInfo.name}</span>
            <span className="dropdown-arrow">▼</span>
          </button>

          {showElementSelector && (
            <motion.div
              className="house-dropdown"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {Object.entries(ELEMENTS).map(([key, element]) => (
                <button
                  key={key}
                  className={`house-option ${key === currentHouse ? 'active' : ''}`}
                  onClick={() => {
                    console.log('✨ Navbar element option clicked:', key, element.name);
                    handleElementChange(key);
                  }}
                >
                  <span className="house-mascot">{element.mascot}</span>
                  <div className="house-info">
                    <span className="house-name">{element.name}</span>
                    <span className="house-traits">{element.traits[0]}, {element.traits[1]}</span>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Desktop Navigation */}
        <div className="desktop-nav">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {isActive(item.path) && (
                <motion.div
                  className="active-indicator"
                  layoutId="activeTab"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          ))}
          
          {/* Logout Button */}
          <button
            className="nav-link logout-btn"
            onClick={onLogout}
          >
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Logout</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          className="mobile-nav"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
          
          {/* Mobile Logout Button */}
          <button
            className="mobile-nav-link logout-btn"
            onClick={() => {
              setIsMenuOpen(false);
              onLogout();
            }}
          >
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Logout</span>
          </button>
        </motion.div>
      )}

      {/* Magical particles effect */}
      <div className="navbar-particles">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`particle particle-${i}`}>✨</div>
        ))}
      </div>
    </nav>
  );
};

export default Navbar; 