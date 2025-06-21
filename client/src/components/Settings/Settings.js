import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './Settings.css';

const Settings = ({ currentHouse, setCurrentHouse }) => {
  const { HOUSES, UI_THEMES, getHouseInfo, currentUITheme, changeUITheme, changeHouse, preferences, updatePreferences, sendMagicalNotification } = useTheme();
  
  const handleHouseChange = (house) => {
    console.log('🏠 Settings house change requested:', house);
    setCurrentHouse(house);
    changeHouse(house); // This will trigger the notification
  };

  const handlePreferenceChange = (key, value) => {
    console.log('🔧 Settings preference changed:', key, '=', value);
    updatePreferences({ [key]: value });
    
    // Send notification when notifications are enabled
    if (key === 'notifications' && value === true) {
      setTimeout(() => {
        sendMagicalNotification('Notifications Enabled!', {
          body: 'You\'ll now receive magical updates from your diary! 🦉✨',
          tag: 'notification-enabled'
        });
      }, 1000);
    }
  };

  return (
    <div className="settings">
      <div className="settings-header">
        <h1 className="magical-title">⚙️ Magical Settings</h1>
        <p className="settings-subtitle">
          Customize your magical diary experience
        </p>
      </div>
      
      <div className="settings-content">
        {/* House Selection */}
        <div className="settings-section magical-card">
          <h3 className="section-title">🏰 Choose Your House</h3>
          <p className="section-description">
            Select your Hogwarts house to customize the app's theme and experience.
          </p>
          
          <div className="house-grid">
            {Object.entries(HOUSES).map(([key, house]) => (
              <button
                key={key}
                onClick={() => {
                  console.log('🏠 House card clicked:', key, house.name);
                  handleHouseChange(key);
                }}
                className={`house-card ${key === currentHouse ? 'selected' : ''}`}
              >
                <div className="house-mascot">{house.mascot}</div>
                <div className="house-info">
                  <h4 className="house-name">{house.name}</h4>
                  <p className="house-founder">Founded by {house.founder}</p>
                  <div className="house-traits">
                    {house.traits.slice(0, 2).map((trait, index) => (
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
            Choose the magical atmosphere and environment for your diary experience.
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
                       body: 'This is a test notification to verify the system is working! 🦉✨',
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
                     console.log('🏠 Testing house notification...');
                     const houseInfo = getHouseInfo(currentHouse);
                     sendMagicalNotification('House Test!', {
                       body: `Welcome to ${houseInfo.name}! ${houseInfo.mascot} ${houseInfo.traits[0]} and ${houseInfo.traits[1]} await you! ⚡`,
                       tag: 'house-test'
                     });
                   }}
                   className="magical-button"
                   style={{ fontSize: '0.9rem', padding: '8px 16px' }}
                 >
                   🏠 Test House Notification
                 </button>
               </div>
             )}
          </div>
        </div>

        {/* About */}
        <div className="settings-section magical-card">
          <h3 className="section-title">📖 About Magical Diary</h3>
          <p className="about-text">
            Welcome to your magical diary experience! This Harry Potter-themed journal app 
            lets you capture your thoughts, create todo lists, draw magical artwork, and 
            share your memories with friends.
          </p>
          
          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-icon">📝</span>
              <span className="feature-text">Rich Text Diary Entries</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✅</span>
              <span className="feature-text">Magical Todo Lists</span>
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
              <span className="feature-text">Magical Stickers</span>
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