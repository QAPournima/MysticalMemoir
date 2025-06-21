import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './Settings.css';

const Settings = ({ currentHouse, setCurrentHouse }) => {
  const { ELEMENTS, UI_THEMES, getElementInfo, currentUITheme, changeUITheme, changeElement, preferences, updatePreferences, sendMagicalNotification } = useTheme();
  
  const handleElementChange = (element) => {
    console.log('✨ Settings element change requested:', element);
    setCurrentHouse(element); // Keep for backwards compatibility
    changeElement(element); // This will trigger the notification
  };

  const handlePreferenceChange = (key, value) => {
    console.log('🔧 Settings preference changed:', key, '=', value);
    updatePreferences({ [key]: value });
    
    // Send notification when notifications are enabled
    if (key === 'notifications' && value === true) {
      setTimeout(() => {
        sendMagicalNotification('Notifications Enabled!', {
          body: 'You\'ll now receive mystical updates from your memoir! 🌟✨',
          tag: 'notification-enabled'
        });
      }, 1000);
    }
  };

  return (
    <div className="settings">
      <div className="settings-header">
        <h1 className="magical-title">⚙️ Mystical Settings</h1>
        <p className="settings-subtitle">
          Customize your mystical memoir experience
        </p>
      </div>
      
      <div className="settings-content">
        {/* Element Selection */}
        <div className="settings-section magical-card">
          <h3 className="section-title">🌟 Choose Your Element</h3>
          <p className="section-description">
            Select your mystical element to customize the app's theme and experience.
          </p>
          
          <div className="house-grid">
            {Object.entries(ELEMENTS).map(([key, element]) => (
              <button
                key={key}
                onClick={() => {
                  console.log('✨ Element card clicked:', key, element.name);
                  handleElementChange(key);
                }}
                className={`house-card ${key === currentHouse ? 'selected' : ''}`}
              >
                <div className="house-mascot">{element.mascot}</div>
                <div className="house-info">
                  <h4 className="house-name">{element.name}</h4>
                  <p className="house-founder">{element.essence}</p>
                  <div className="house-traits">
                    {element.traits.slice(0, 2).map((trait, index) => (
                      <span key={index} className="trait">{trait}</span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* UI Theme Selection */}
        <div className="settings-section magical-card">
          <h3 className="section-title">🎨 Visual Themes</h3>
          <p className="section-description">
            Choose the mystical atmosphere and environment for your memoir experience.
          </p>
          
          <div className="theme-grid">
            {Object.entries(UI_THEMES).map(([key, theme]) => (
                             <button
                 key={key}
                 onClick={() => {
                   console.log('🎨 Theme card clicked:', key);
                   changeUITheme(key);
                 }}
                 className={`theme-card ${key === currentUITheme ? 'selected' : ''}`}
               >
                <div className="theme-preview" style={{
                  background: theme.colors.background,
                  border: `3px solid ${theme.colors.accent}`
                }}>
                  <div className="theme-emoji">{theme.emoji}</div>
                  <div className="theme-particles">
                    {theme.atmosphereParticles.slice(0, 3).map((particle, index) => (
                      <span key={index} className="particle">{particle}</span>
                    ))}
                  </div>
                </div>
                <div className="theme-info">
                  <h4 className="theme-name" style={{ color: theme.colors.primary }}>
                    {theme.name}
                  </h4>
                  <p className="theme-description" style={{ color: theme.colors.textSecondary }}>
                    {theme.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* App Preferences */}
        <div className="settings-section magical-card">
          <h3 className="section-title">🎨 App Preferences</h3>
          

          
          <div className="preference-item">
            <label htmlFor="fontSize">Font Size</label>
            <select
              id="fontSize"
              value={preferences.fontSize}
              onChange={(e) => handlePreferenceChange('fontSize', e.target.value)}
              className="magical-input"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
          
          <div className="preference-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={preferences.autoSave}
                onChange={(e) => handlePreferenceChange('autoSave', e.target.checked)}
              />
              <span>Enable Auto-Save</span>
            </label>
          </div>
          
          <div className="preference-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={preferences.notifications}
                onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
              />
              <span>Enable Notifications</span>
            </label>
            
                         {preferences.notifications && (
               <div style={{ marginTop: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                 <button
                   onClick={() => {
                     console.log('🧪 Testing general notification system...');
                     sendMagicalNotification('Test Notification', {
                       body: 'This is a test notification to verify the system is working! 🌟✨',
                       tag: 'test-notification'
                     });
                   }}
                   className="magical-button"
                   style={{ fontSize: '0.9rem', padding: '8px 16px' }}
                 >
                   🧪 Test Notifications
                 </button>
                 
                 <button
                   onClick={() => {
                     console.log('✨ Testing element notification...');
                     const elementInfo = getElementInfo(currentHouse);
                     sendMagicalNotification('Element Test!', {
                       body: `Welcome to ${elementInfo.name}! ${elementInfo.mascot} ${elementInfo.traits[0]} and ${elementInfo.traits[1]} await you! ⚡`,
                       tag: 'element-test'
                     });
                   }}
                   className="magical-button"
                   style={{ fontSize: '0.9rem', padding: '8px 16px' }}
                 >
                   🌟 Test Element Notification
                 </button>
               </div>
             )}
          </div>
        </div>

        {/* About */}
        <div className="settings-section magical-card">
          <h3 className="section-title">📖 About Mystical Memoir</h3>
          <p className="about-text">
            Welcome to your mystical memoir experience! This enchanted journal app 
            lets you capture your thoughts, create todo lists, draw mystical artwork, and 
            share your memories with friends.
          </p>
          
          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-icon">📝</span>
              <span className="feature-text">Rich Text Memoir Entries</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✅</span>
              <span className="feature-text">Mystical Todo Lists</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎨</span>
              <span className="feature-text">Drawing Canvas</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📸</span>
              <span className="feature-text">Image Gallery</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✨</span>
              <span className="feature-text">Mystical Stickers</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📤</span>
              <span className="feature-text">Easy Sharing</span>
            </div>
          </div>
          
          <div className="version-info">
            <p>Version 1.0.0</p>
            <p>Made with ✨ magic and ❤️</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 