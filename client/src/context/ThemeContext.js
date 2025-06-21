import React, { createContext, useContext, useState, useEffect } from 'react';
import { clearInvalidThemeCache, forceThemeRefresh } from '../utils/themeUtils';

const ThemeContext = createContext();

const ELEMENTS = {
  moonlight: {
    name: 'Moonlight',
    colors: {
      primary: '#4A90E2',
      secondary: '#7BB3F0',
      accent: '#A8D0F7',
      light: '#E3F2FD'
    },
    traits: ['Wisdom', 'Serenity', 'Intuition', 'Reflection'],
    essence: 'The calm wisdom of moonlight',
    mascot: '🌙',
    element: 'Air'
  },
  ember: {
    name: 'Ember',
    colors: {
      primary: '#E74C3C',
      secondary: '#F39C12',
      accent: '#FFD93D',
      light: '#FFF3E0'
    },
    traits: ['Passion', 'Courage', 'Energy', 'Leadership'],
    essence: 'The fierce spirit of flame',
    mascot: '🔥',
    element: 'Fire'
  },
  nature: {
    name: 'Nature',
    colors: {
      primary: '#27AE60',
      secondary: '#2ECC71',
      accent: '#F4D03F',
      light: '#E8F5E8'
    },
    traits: ['Growth', 'Harmony', 'Patience', 'Nurturing'],
    essence: 'The gentle strength of earth',
    mascot: '🌿',
    element: 'Earth'
  },
  starlight: {
    name: 'Starlight',
    colors: {
      primary: '#9B59B6',
      secondary: '#8E44AD',
      accent: '#F1C40F',
      light: '#F8F4FF'
    },
    traits: ['Dreams', 'Magic', 'Creativity', 'Wonder'],
    essence: 'The infinite possibilities of stars',
    mascot: '⭐',
    element: 'Ether'
  }
};

const MAGICAL_STICKERS = [
  { id: 1, emoji: '✨', name: 'Sparkles', category: 'magical' },
  { id: 2, emoji: '🪄', name: 'Magic Wand', category: 'magical' },
  { id: 3, emoji: '🦉', name: 'Owl', category: 'creatures' },
  { id: 4, emoji: '🐺', name: 'Wolf', category: 'creatures' },
  { id: 5, emoji: '🦋', name: 'Butterfly', category: 'creatures' },
  { id: 6, emoji: '🐉', name: 'Dragon', category: 'creatures' },
  { id: 7, emoji: '🦌', name: 'Deer', category: 'creatures' },
  { id: 8, emoji: '🏰', name: 'Castle', category: 'places' },
  { id: 9, emoji: '📜', name: 'Scroll', category: 'items' },
  { id: 10, emoji: '🔮', name: 'Crystal Ball', category: 'magical' },
  { id: 11, emoji: '🧙‍♂️', name: 'Wizard', category: 'people' },
  { id: 12, emoji: '🧙‍♀️', name: 'Witch', category: 'people' },
  { id: 13, emoji: '🎭', name: 'Masks', category: 'magical' },
  { id: 14, emoji: '🗝️', name: 'Key', category: 'items' },
  { id: 15, emoji: '🏆', name: 'Trophy', category: 'items' },
  { id: 16, emoji: '💎', name: 'Gem', category: 'items' },
  { id: 17, emoji: '🌟', name: 'Star', category: 'magical' },
  { id: 18, emoji: '🌙', name: 'Moon', category: 'magical' },
  { id: 19, emoji: '🔥', name: 'Fire', category: 'elements' },
  { id: 20, emoji: '💧', name: 'Water', category: 'elements' },
  { id: 21, emoji: '🌿', name: 'Leaves', category: 'elements' },
  { id: 22, emoji: '💫', name: 'Shooting Star', category: 'magical' },
  { id: 23, emoji: '🌈', name: 'Rainbow', category: 'magical' },
  { id: 24, emoji: '⚡', name: 'Lightning', category: 'elements' }
];

const MOOD_OPTIONS = [
  { id: 'happy', emoji: '😊', name: 'Happy', color: '#FFD700' },
  { id: 'excited', emoji: '🤗', name: 'Excited', color: '#FF6347' },
  { id: 'calm', emoji: '😌', name: 'Calm', color: '#87CEEB' },
  { id: 'thoughtful', emoji: '🤔', name: 'Thoughtful', color: '#DDA0DD' },
  { id: 'sad', emoji: '😢', name: 'Sad', color: '#4682B4' },
  { id: 'angry', emoji: '😠', name: 'Angry', color: '#DC143C' },
  { id: 'magical', emoji: '✨', name: 'Magical', color: '#9370DB' },
  { id: 'adventurous', emoji: '🗺️', name: 'Adventurous', color: '#228B22' }
];

const WEATHER_OPTIONS = [
  { id: 'sunny', emoji: '☀️', name: 'Sunny' },
  { id: 'cloudy', emoji: '☁️', name: 'Cloudy' },
  { id: 'rainy', emoji: '🌧️', name: 'Rainy' },
  { id: 'stormy', emoji: '⛈️', name: 'Stormy' },
  { id: 'snowy', emoji: '❄️', name: 'Snowy' },
  { id: 'magical', emoji: '🌟', name: 'Magical' }
];

const UI_THEMES = {
  default: {
    name: 'Classic Mystical',
    emoji: '✨',
    description: 'The traditional mystical experience',
    colors: {
      primary: '#2C1810',
      secondary: '#8B4513',
      accent: '#D4AF37',
      background: '#F4ECD8',
      cardBg: '#FDFBF5',
      textPrimary: '#2C1810',
      textSecondary: '#5D4E37'
    },
    backgroundImage: null,
    atmosphereParticles: ['✨', '🪄', '⚡', '📜']
  },
  shadowRealm: {
    name: 'Shadow Realm',
    emoji: '🌑',
    description: 'Embrace the mysterious shadows and forbidden magic',
    colors: {
      primary: '#0A0A0A',
      secondary: '#2D1B2E',
      accent: '#4A148C',
      background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.8) 0%, rgba(13, 13, 13, 0.9) 100%)',
      cardBg: 'rgba(20, 20, 20, 0.85)',
      textPrimary: '#E8E8E8',
      textSecondary: '#B39DDB'
    },
    backgroundImage: 'url("/webpage%20background/Shadow%20Realm.jpeg")',
    backgroundOverlay: 'radial-gradient(circle at 20% 50%, rgba(74, 20, 140, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(50, 0, 50, 0.2) 0%, transparent 50%)',
    atmosphereParticles: ['🕷️', '🦇', '💀', '🐍', '⚡', '🌑', '🔮', '🗝️' ]
  },
  winterWonderland: {
    name: 'Winter Wonderland',
    emoji: '❄️',
    description: 'Mystical magic blankets the land in snow',
    colors: {
      primary: '#1b1b2f',
      secondary: '#3e3e55',
      accent: '#d4af37',
      background: 'linear-gradient(to bottom, rgba(27, 27, 47, 0.7) 0%, rgba(62, 62, 85, 0.8) 100%)',
      cardBg: 'rgba(255, 255, 255, 0.15)',
      textPrimary: '#ffffff',
      textSecondary: '#d4af37'
    },
    backgroundImage: 'url("/webpage%20background/Winter%20Wonderland.jpeg")',
    backgroundOverlay: 'radial-gradient(circle at 20% 30%, rgba(212, 175, 55, 0.1) 0%, transparent 70%), radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.05) 0%, transparent 60%)',
    atmosphereParticles: ['❄️', '☃️', '🎄', '🦌', '⭐', '🌨️', '✨', '🕯️', '🦉']
  },
  mysticMarket: {
    name: 'Mystic Market',
    emoji: '🏪',
    description: 'Bustling magical marketplace',
    colors: {
      primary: '#059669',
      secondary: '#7C3AED',
      accent: '#F59E0B',
      background: 'linear-gradient(135deg, rgba(236, 253, 245, 0.8) 0%, rgba(243, 232, 255, 0.9) 100%)',
      cardBg: 'rgba(236, 253, 245, 0.85)',
      textPrimary: '#059669',
      textSecondary: '#7C3AED'
    },
    backgroundImage: 'url("/webpage%20background/Mystic%20Market.jpeg")',
    backgroundOverlay: 'radial-gradient(circle at 40% 30%, rgba(124, 58, 237, 0.08) 0%, transparent 50%), radial-gradient(circle at 60% 70%, rgba(5, 150, 105, 0.08) 0%, transparent 50%)',
    atmosphereParticles: ['🪙', '📚', '🔮', '⚡', '🦉', '🛍️', '🗝️', '🎪']
  },
  enchantedGarden: {
    name: "Enchanted Garden",
    emoji: '🌿',
    description: 'Mystical plants and botanical wonders',
    colors: {
      primary: '#15803D',
      secondary: '#84CC16',
      accent: '#FDE047',
      background: 'linear-gradient(135deg, rgba(240, 253, 244, 0.8) 0%, rgba(236, 252, 203, 0.9) 100%)',
      cardBg: 'rgba(240, 253, 244, 0.85)',
      textPrimary: '#15803D',
      textSecondary: '#4D7C0F'
    },
    backgroundImage: 'url("/webpage%20background/Enchanted%20Garden.png")',
    backgroundOverlay: 'radial-gradient(circle at 35% 25%, rgba(132, 204, 22, 0.15) 0%, transparent 50%), radial-gradient(circle at 65% 75%, rgba(21, 128, 61, 0.1) 0%, transparent 50%)',
    atmosphereParticles: ['🌿', '🌱', '🌸', '🍄', '✨', '🦋', '🌻', '🌺']
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentElement, setCurrentElement] = useState('moonlight');
  const [currentUITheme, setCurrentUITheme] = useState('default');
  const [preferences, setPreferences] = useState({
    fontSize: 'medium',
    autoSave: true,
    notifications: true,
    darkMode: false
  });

  useEffect(() => {
    // Clear any invalid cached themes first
    const wasInvalid = clearInvalidThemeCache();
    if (wasInvalid) {
      return; // Page will reload, so exit early
    }
    
    // Load saved preferences
    const savedElement = localStorage.getItem('selected_element') || localStorage.getItem('selected_house'); // backward compatibility
    const savedUITheme = localStorage.getItem('selected_ui_theme');
    const savedPreferences = localStorage.getItem('user_preferences');

    if (savedElement && ELEMENTS[savedElement]) {
      setCurrentElement(savedElement);
    } else if (savedElement) {
      // If old house name, map to new element
      const elementMap = {
        'gryffindor': 'ember',
        'slytherin': 'nature', 
        'ravenclaw': 'moonlight',
        'hufflepuff': 'starlight'
      };
      const mappedElement = elementMap[savedElement] || 'moonlight';
      setCurrentElement(mappedElement);
      localStorage.setItem('selected_element', mappedElement);
      localStorage.removeItem('selected_house'); // cleanup old key
    }

    if (savedUITheme && UI_THEMES[savedUITheme]) {
      console.log('🎨 Loading saved UI theme:', savedUITheme);
      setCurrentUITheme(savedUITheme);
    } else if (savedUITheme) {
      console.log('⚠️ Saved UI theme no longer exists:', savedUITheme, '- resetting to default');
      setCurrentUITheme('default');
      localStorage.setItem('selected_ui_theme', 'default');
    }
    
    // Force immediate theme application
    setTimeout(() => {
      const theme = UI_THEMES[currentUITheme] || UI_THEMES.default;
      const root = document.documentElement;
      console.log('🔧 Force applying theme on mount:', currentUITheme, theme.name);
      
      // Apply theme colors
      root.style.setProperty('--theme-primary', theme.colors.primary);
      root.style.setProperty('--theme-secondary', theme.colors.secondary);
      root.style.setProperty('--theme-accent', theme.colors.accent);
      root.style.setProperty('--theme-background', theme.colors.background);
      root.style.setProperty('--theme-card-bg', theme.colors.cardBg);
      root.style.setProperty('--theme-text-primary', theme.colors.textPrimary);
      root.style.setProperty('--theme-text-secondary', theme.colors.textSecondary);
      
      if (theme.backgroundImage) {
        root.style.setProperty('--theme-background-image', theme.backgroundImage);
      } else {
        root.style.removeProperty('--theme-background-image');
      }
      
      if (theme.backgroundOverlay) {
        root.style.setProperty('--theme-background-overlay', theme.backgroundOverlay);
      } else {
        root.style.removeProperty('--theme-background-overlay');
      }
      
      // Apply theme-specific background animation
      const animationMap = {
        'Shadow Realm': 'shadowRealmAnimation',
        'Winter Wonderland': 'winterWonderlandAnimation',
        'Mystic Market': 'mysticMarketAnimation',
        "Enchanted Garden": 'enchantedGardenAnimation'
      };
      
      const animationName = animationMap[theme.name] || 'defaultBackgroundAnimation';
      root.style.setProperty('--theme-background-animation', animationName);
    }, 100);

    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }

    // Request notification permission on load
    if (preferences.notifications && 'Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  // Apply UI theme to CSS custom properties
  useEffect(() => {
    const theme = UI_THEMES[currentUITheme] || UI_THEMES.default;
    const root = document.documentElement;
    
    console.log('🎨 Applying UI Theme:', currentUITheme, theme);
    
    // Apply theme colors
    root.style.setProperty('--theme-primary', theme.colors.primary);
    root.style.setProperty('--theme-secondary', theme.colors.secondary);
    root.style.setProperty('--theme-accent', theme.colors.accent);
    root.style.setProperty('--theme-background', theme.colors.background);
    root.style.setProperty('--theme-card-bg', theme.colors.cardBg);
    root.style.setProperty('--theme-text-primary', theme.colors.textPrimary);
    root.style.setProperty('--theme-text-secondary', theme.colors.textSecondary);
    
          // Apply background image if exists
      if (theme.backgroundImage) {
        root.style.setProperty('--theme-background-image', theme.backgroundImage);
      } else {
        root.style.removeProperty('--theme-background-image');
      }
      
      // Apply background overlay if exists (for layered effects)
      if (theme.backgroundOverlay) {
        root.style.setProperty('--theme-background-overlay', theme.backgroundOverlay);
      } else {
        root.style.removeProperty('--theme-background-overlay');
      }
      
      // Apply theme-specific background animation
      const animationMap = {
        'Shadow Realm': 'shadowRealmAnimation',
        'Winter Wonderland': 'winterWonderlandAnimation',
        'Mystic Market': 'mysticMarketAnimation',
        "Enchanted Garden": 'enchantedGardenAnimation'
      };
      
      const animationName = animationMap[theme.name] || 'defaultBackgroundAnimation';
      root.style.setProperty('--theme-background-animation', animationName);
    
    console.log('✅ CSS custom properties applied:', {
      primary: theme.colors.primary,
      background: theme.colors.background,
      textPrimary: theme.colors.textPrimary
    });
    
    // Force browser repaint to ensure immediate visual update
    document.body.style.display = 'none';
    // eslint-disable-next-line no-unused-expressions
    document.body.offsetHeight; // Trigger reflow
    document.body.style.display = '';
    
    // Visual confirmation that theme changed
    const themeIndicator = document.createElement('div');
    themeIndicator.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${theme.colors.primary};
      color: ${theme.colors.cardBg};
      padding: 10px 20px;
      border-radius: 8px;
      font-family: 'Cinzel', serif;
      font-weight: 600;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: all 0.3s ease;
    `;
    themeIndicator.textContent = `🎨 ${theme.name}`;
    document.body.appendChild(themeIndicator);
    
    setTimeout(() => {
      themeIndicator.style.opacity = '0';
      themeIndicator.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        document.body.removeChild(themeIndicator);
      }, 300);
    }, 2000);
  }, [currentUITheme]);

  const changeElement = (element) => {
    console.log('🏠 Changing element to:', element);
    
    setCurrentElement(element);
    localStorage.setItem('selected_element', element);
    
    // Send notification about element change
    const elementInfo = ELEMENTS[element];
    if (elementInfo) {
      console.log('🔔 Sending element change notification for:', elementInfo.name);
      
      sendMagicalNotification('Element Changed!', {
        body: `Welcome to ${elementInfo.name}! ${elementInfo.mascot} ${elementInfo.traits[0]} and ${elementInfo.traits[1]} await you! ⚡`,
        tag: 'element-change'
      });
    }
  };

  const changeUITheme = (theme) => {
    console.log('🎨 Changing theme from:', currentUITheme, 'to:', theme);
    console.log('🎨 Available themes:', Object.keys(UI_THEMES));
    console.log('🎨 Theme exists?', UI_THEMES[theme] ? 'Yes' : 'No');
    
    // Add transition effect
    document.body.classList.add('theme-changing');
    
    setCurrentUITheme(theme);
    localStorage.setItem('selected_ui_theme', theme);
    
    // Send notification about theme change
    const themeName = UI_THEMES[theme]?.name || 'a new theme';
    console.log('🔔 Sending theme change notification for:', themeName);
    
    sendMagicalNotification('Theme Changed!', {
      body: `You've switched to ${themeName}! ✨`,
      tag: 'theme-change'
    });

    // Remove transition class after animation
    setTimeout(() => {
      document.body.classList.remove('theme-changing');
    }, 800);
  };

  const getCurrentUITheme = () => {
    return UI_THEMES[currentUITheme] || UI_THEMES.default;
  };

  const updatePreferences = (newPreferences) => {
    const updated = { ...preferences, ...newPreferences };
    setPreferences(updated);
    localStorage.setItem('user_preferences', JSON.stringify(updated));

    // Handle notification permission change
    if (updated.notifications && !preferences.notifications && 'Notification' in window) {
      Notification.requestPermission();
    }
  };

  const getElementInfo = (element = currentElement) => {
    return ELEMENTS[element] || ELEMENTS.moonlight;
  };

  // Magical Notification Service with Owl Icon
  const sendMagicalNotification = (title, options = {}) => {
    console.log('🔔 Notification requested:', { title, options, notificationsEnabled: preferences.notifications });
    
    if (!preferences.notifications) {
      console.log('❌ Notifications disabled in preferences');
      return;
    }

    // Always show in-app notification as fallback
    const inAppEvent = new CustomEvent('magicalNotification', {
      detail: {
        title,
        body: options.body || '',
        duration: options.duration || 4000
      }
    });
    window.dispatchEvent(inAppEvent);
    console.log('📱 In-app notification sent');

    // Try browser notification if supported
    if (!('Notification' in window)) {
      console.log('❌ Browser does not support notifications, using in-app only');
      return;
    }

    console.log('🔍 Notification permission:', Notification.permission);

    if (Notification.permission === 'granted') {
      try {
        // Create a simple SVG icon without emoji characters
        const simpleIcon = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="#8B4513" stroke="#D4AF37" stroke-width="3"/>
            <circle cx="35" cy="40" r="8" fill="white"/>
            <circle cx="65" cy="40" r="8" fill="white"/>
            <circle cx="35" cy="40" r="4" fill="black"/>
            <circle cx="65" cy="40" r="4" fill="black"/>
            <path d="M 45 55 Q 50 60 55 55" stroke="white" stroke-width="2" fill="none"/>
          </svg>
        `);

        const notification = new Notification(`🦉 ${title}`, {
          icon: simpleIcon,
          body: options.body || '',
          tag: options.tag || 'magical-diary',
          requireInteraction: options.requireInteraction || false,
          silent: options.silent || false,
          ...options
        });

        console.log('✅ Browser notification created successfully:', notification);

        // Auto-close notification after 5 seconds unless requireInteraction is true
        if (!options.requireInteraction) {
          setTimeout(() => {
            notification.close();
          }, 5000);
        }

        return notification;
      } catch (error) {
        console.error('❌ Error creating browser notification:', error);
      }
    } else if (Notification.permission === 'default') {
      console.log('🔔 Requesting notification permission...');
      Notification.requestPermission().then(permission => {
        console.log('🔔 Permission result:', permission);
        if (permission === 'granted') {
          // Don't send in-app again, just the browser notification
          sendBrowserNotification(title, options);
        }
      });
    } else {
      console.log('❌ Browser notification permission denied, using in-app only');
    }
  };

  // Helper function for browser notifications only
  const sendBrowserNotification = (title, options = {}) => {
    if (Notification.permission === 'granted') {
      try {
        const simpleIcon = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="#8B4513" stroke="#D4AF37" stroke-width="3"/>
            <circle cx="35" cy="40" r="8" fill="white"/>
            <circle cx="65" cy="40" r="8" fill="white"/>
            <circle cx="35" cy="40" r="4" fill="black"/>
            <circle cx="65" cy="40" r="4" fill="black"/>
            <path d="M 45 55 Q 50 60 55 55" stroke="white" stroke-width="2" fill="none"/>
          </svg>
        `);

        const notification = new Notification(`🦉 ${title}`, {
          icon: simpleIcon,
          body: options.body || '',
          tag: options.tag || 'magical-diary',
          requireInteraction: options.requireInteraction || false,
          silent: options.silent || false,
          ...options
        });

        if (!options.requireInteraction) {
          setTimeout(() => {
            notification.close();
          }, 5000);
        }

        return notification;
      } catch (error) {
        console.error('❌ Error creating browser notification:', error);
      }
    }
  };

  const value = {
    currentElement,
    changeElement,
    currentUITheme,
    changeUITheme,
    getCurrentUITheme,
    preferences,
    updatePreferences,
    getElementInfo,
    sendMagicalNotification,
    ELEMENTS,
    UI_THEMES,
    MAGICAL_STICKERS,
    MOOD_OPTIONS,
    WEATHER_OPTIONS
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return {
    ...context,
    // Backwards compatibility aliases
    currentHouse: context.currentElement,
    changeHouse: context.changeElement,
    getHouseInfo: context.getElementInfo,
    HOUSES: context.ELEMENTS
  };
}; 