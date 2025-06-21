import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import './ThemeAnimations.css';

const ThemeAnimations = () => {
  const { getCurrentUITheme } = useTheme();
  const currentTheme = getCurrentUITheme();
  const [particles, setParticles] = useState([]);

  const themeAnimations = {
    default: {
      name: 'Classic Mystical',
      particles: ['✨', '⭐', '🌟', '💫'],
      background: null,
      animationName: 'defaultBackgroundAnimation',
      description: 'Classic mystical atmosphere'
    },
    shadowRealm: {
      name: 'Shadow Realm',
      particles: ['🕷️', '🦇', '💀', '⚡'],
      background: null,
      animationName: 'shadowRealmAnimation',
      description: 'Dark and mysterious realm'
    },
    winterWonderland: {
      name: 'Winter Wonderland',
      particles: ['❄️', '⛄', '🎄', '⭐'],
      background: null,
      animationName: 'winterWonderlandAnimation',
      description: 'Mystical winter landscape'
    },
    mysticMarket: {
      name: 'Mystic Market',
      particles: ['🪙', '📚', '🔮', '⚡'],
      background: null,
      animationName: 'mysticMarketAnimation',
      description: 'Bustling marketplace'
    },
    enchantedGarden: {
      name: 'Enchanted Garden',
      particles: ['🌿', '🌸', '🦋', '🌻'],
      background: null,
      animationName: 'enchantedGardenAnimation',
      description: 'Botanical wonderland'
    }
  };

  // Legacy theme name mapping for backwards compatibility
  const legacyThemeMapping = {
    'Classic Mystical': 'default',
    'Shadow Realm': 'shadowRealm',
    'Winter Wonderland': 'winterWonderland',
    'Mystic Market': 'mysticMarket',
    'Enchanted Garden': 'enchantedGarden'
  };

  useEffect(() => {
    // Map theme names to config keys
    const themeNameMap = {
      'Classic Mystical': 'default',
      'Shadow Realm': 'shadowRealm',
      'Winter Wonderland': 'winterWonderland',
      'Mystic Market': 'mysticMarket',
      'Enchanted Garden': 'enchantedGarden'
    };
    
    const configKey = themeNameMap[currentTheme.name] || 'default';
    const config = themeAnimations[configKey];
    
    console.log('🎨 ThemeAnimations: Active theme:', currentTheme.name, '-> Config:', configKey);
    
    // Generate particles for left and right sides
    const newParticles = [];
    const particleCount = config.particles.length;

    // Left side particles
    for (let i = 0; i < particleCount / 2; i++) {
      newParticles.push({
        id: `left-${i}`,
        symbol: config.particles[i % config.particles.length],
        side: 'left',
        animationDelay: Math.random() * 10,
        duration: 15 + Math.random() * 10,
        size: 0.8 + Math.random() * 0.8,
        opacity: 0.3 + Math.random() * 0.4,
        horizontalOffset: Math.random() * 100
      });
    }

    // Right side particles
    for (let i = 0; i < particleCount / 2; i++) {
      newParticles.push({
        id: `right-${i}`,
        symbol: config.particles[i % config.particles.length],
        side: 'right',
        animationDelay: Math.random() * 10,
        duration: 15 + Math.random() * 10,
        size: 0.8 + Math.random() * 0.8,
        opacity: 0.3 + Math.random() * 0.4,
        horizontalOffset: Math.random() * 100
      });
    }

    setParticles(newParticles);

    // Apply background animation
    const backgroundElement = document.querySelector('.magical-background');
    const animationName = config.animationName;
    if (backgroundElement && animationName) {
      backgroundElement.style.animation = `${animationName} 20s ease-in-out infinite`;
      backgroundElement.style.animationDelay = '0s';
      backgroundElement.style.animationFillMode = 'both';
    } else if (backgroundElement) {
      backgroundElement.style.animation = 'defaultBackgroundAnimation 30s ease-in-out infinite';
    }
  }, [currentTheme]);

  return (
    <div className="theme-animations">
      {/* Left side magical elements */}
      <div className="animation-side left-side">
        {particles
          .filter(p => p.side === 'left')
          .map((particle) => (
            <div
              key={particle.id}
              className="magical-particle"
              style={{
                '--delay': `${particle.animationDelay}s`,
                '--duration': `${particle.duration}s`,
                '--size': particle.size,
                '--opacity': particle.opacity,
                '--offset': `${particle.horizontalOffset}px`,
                fontSize: `${particle.size}rem`
              }}
            >
              {particle.symbol}
            </div>
          ))}
        
        {/* Left side magical aura */}
        <div 
          className="magical-aura left-aura"
          style={{
            background: `radial-gradient(circle at 0% 50%, ${currentTheme.colors?.accent}15 0%, transparent 70%)`
          }}
        />
      </div>

      {/* Right side magical elements */}
      <div className="animation-side right-side">
        {particles
          .filter(p => p.side === 'right')
          .map((particle) => (
            <div
              key={particle.id}
              className="magical-particle"
              style={{
                '--delay': `${particle.animationDelay}s`,
                '--duration': `${particle.duration}s`,
                '--size': particle.size,
                '--opacity': particle.opacity,
                '--offset': `${particle.horizontalOffset}px`,
                fontSize: `${particle.size}rem`
              }}
            >
              {particle.symbol}
            </div>
          ))}
        
        {/* Right side magical aura */}
        <div 
          className="magical-aura right-aura"
          style={{
            background: `radial-gradient(circle at 100% 50%, ${currentTheme.colors?.accent}15 0%, transparent 70%)`
          }}
        />
      </div>

      {/* Theme-specific floating elements */}
      <div className="floating-theme-elements">
        {currentTheme.name === 'Shadow Realm' && (
          <>
            <div className="dark-smoke smoke-1"></div>
            <div className="dark-smoke smoke-2"></div>
            <div className="dark-arts-overlay">
              {[...Array(8)].map((_, i) => (
                <div key={`shadow-${i}`} className={`shadow-element shadow-${i % 4}`}>
                  {i % 4 === 0 ? '🕷️' : i % 4 === 1 ? '🦇' : i % 4 === 2 ? '💀' : '🐍'}
                </div>
              ))}
              {[...Array(6)].map((_, i) => (
                <div key={`dark-orb-${i}`} className={`dark-orb orb-${i}`}>🔮</div>
              ))}
            </div>
          </>
        )}
        
        {currentTheme.name === 'Winter Wonderland' && (
          <div className="snow-overlay">
            {[...Array(30)].map((_, i) => (
              <div key={`snow-${i}`} className={`snowflake snowflake-${i % 6}`}>❄</div>
            ))}
            {[...Array(8)].map((_, i) => (
              <div key={`winter-${i}`} className={`winter-element winter-${i % 4}`}>
                {i % 4 === 0 ? '☃️' : i % 4 === 1 ? '🎄' : i % 4 === 2 ? '🦌' : '⭐'}
              </div>
            ))}
            {[...Array(10)].map((_, i) => (
              <div key={`candle-${i}`} className={`floating-candle-snow candle-snow-${i}`}>🕯️</div>
            ))}
            <div className="flying-owl"></div>
          </div>
        )}
        
        {currentTheme.name === 'Mystic Market' && (
          <div className="market-overlay">
            {[...Array(6)].map((_, i) => (
              <div key={`coin-${i}`} className={`floating-coin coin-${i}`}>🪙</div>
            ))}
            {[...Array(4)].map((_, i) => (
              <div key={`book-${i}`} className={`floating-book book-${i}`}>📚</div>
            ))}
            {[...Array(5)].map((_, i) => (
              <div key={`crystal-${i}`} className={`floating-crystal crystal-${i}`}>🔮</div>
            ))}
            {[...Array(3)].map((_, i) => (
              <div key={`owl-${i}`} className={`market-owl owl-${i}`}>🦉</div>
            ))}
          </div>
        )}
        
        {(currentTheme.name === 'Enchanted Garden' || currentTheme.name?.includes('Garden')) && (
          <div className="nature-overlay">
            {[...Array(8)].map((_, i) => (
              <div key={`leaf-${i}`} className={`floating-leaf leaf-${i}`}>🍃</div>
            ))}
            {[...Array(6)].map((_, i) => (
              <div key={`flower-${i}`} className={`floating-flower flower-${i}`}>
                {i % 3 === 0 ? '🌸' : i % 3 === 1 ? '🌺' : '🌻'}
              </div>
            ))}
            {[...Array(4)].map((_, i) => (
              <div key={`butterfly-${i}`} className={`flying-butterfly butterfly-${i}`}>🦋</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeAnimations; 