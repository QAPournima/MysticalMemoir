import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import './ThemeAnimations.css';

const ThemeAnimations = () => {
  const { getCurrentUITheme } = useTheme();
  const currentTheme = getCurrentUITheme();
  const [particles, setParticles] = useState([]);

  // Theme-specific particle configurations
  const themeConfigs = {
    default: {
      leftParticles: ['✨', '🪄', '⚡', '📜', '🏰', '🦉'],
      rightParticles: ['🕯️', '📖', '🔮', '⭐', '🌟', '✨'],
      colors: ['#D4AF37', '#8B4513', '#FFD700'],
      particleCount: 8
    },
    darkArts: {
      leftParticles: ['🕷️', '🦇', '💀', '🐍', '⚡', '🌑', '🔮', '🗝️'],
      rightParticles: ['🕯️', '📿', '🔥', '💨', '👁️', '🌫️', '⚰️', '🎭'],
      colors: ['#4A148C', '#2D1B2E', '#6A1B9A'],
      particleCount: 12
    },
    hogwartsSnow: {
      leftParticles: ['❄️', '☃️', '🎄', '🦌', '⭐', '🌨️', '🕯️'],
      rightParticles: ['🏰', '✨', '🌟', '❄️', '☃️', '🎄', '🦉'],
      colors: ['#ffffff', '#d4af37', '#1b1b2f'],
      particleCount: 16
    },
    greatHall: {
      leftParticles: ['🕯️', '🍖', '🍞', '🏆', '🦉', '✨', '🍷', '🧙‍♂️'],
      rightParticles: ['🕯️', '🍯', '🧺', '🪙', '👑', '🔥', '🏆', '✨'],
      colors: ['#FBBF24', '#F59E0B', '#D97706'],
      particleCount: 12
    },
    diagonAlley: {
      leftParticles: ['🪙', '📚', '🔮', '🦉', '📜', '⚡', '🛍️', '🗝️'],
      rightParticles: ['🏪', '🛍️', '💰', '🪄', '📖', '✨', '🎪', '🔮'],
      colors: ['#059669', '#7C3AED', '#F59E0B'],
      particleCount: 12
    },
    triwizard: {
      leftParticles: ['🏆', '🔥', '🐉', '⚡', '🪄', '⭐', '🛡️', '⚔️'],
      rightParticles: ['🏆', '🛡️', '⚔️', '🦅', '🐍', '🦡', '🐉', '🔥'],
      colors: ['#B91C1C', '#1D4ED8', '#FBBF24'],
      particleCount: 14
    },
    greenhouse: {
      leftParticles: ['🌿', '🌱', '🌸', '🍄', '🦋', '🐛', '🌻', '🌺'],
      rightParticles: ['🌻', '🌺', '🍃', '🌷', '🌹', '✨', '🌿', '🦋'],
      colors: ['#15803D', '#84CC16', '#FDE047'],
      particleCount: 14
    }

  };

  useEffect(() => {
    // Map theme names to config keys
    const themeNameMap = {
      'Classic Hogwarts': 'default',
      'Dark Arts': 'darkArts',
      'Hogwarts in the Snow': 'hogwartsSnow',
      'Great Hall': 'greatHall',
      'Diagon Alley': 'diagonAlley',
      'Triwizard Tournament': 'triwizard',
      "Professor Sprout's Greenhouse": 'greenhouse'
    };
    
    const configKey = themeNameMap[currentTheme.name] || 'default';
    const config = themeConfigs[configKey];
    
    console.log('🎨 ThemeAnimations: Active theme:', currentTheme.name, '-> Config:', configKey);
    
    // Generate particles for left and right sides
    const newParticles = [];
    const particleCount = config.particleCount;

    // Left side particles
    for (let i = 0; i < particleCount / 2; i++) {
      newParticles.push({
        id: `left-${i}`,
        symbol: config.leftParticles[i % config.leftParticles.length],
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
        symbol: config.rightParticles[i % config.rightParticles.length],
        side: 'right',
        animationDelay: Math.random() * 10,
        duration: 15 + Math.random() * 10,
        size: 0.8 + Math.random() * 0.8,
        opacity: 0.3 + Math.random() * 0.4,
        horizontalOffset: Math.random() * 100
      });
    }

    setParticles(newParticles);
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
        {currentTheme.name === 'Dark Arts' && (
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
        
        {currentTheme.name === 'Hogwarts in the Snow' && (
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
            <div className="flying-owl">🦉</div>
          </div>
        )}
        
        {currentTheme.name === 'Great Hall' && (
          <div className="candle-glow-overlay">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`floating-candle candle-${i}`}>🕯️</div>
            ))}
          </div>
        )}
        
        {currentTheme.name === 'Triwizard Tournament' && (
          <div className="tournament-overlay">
            {[...Array(6)].map((_, i) => (
              <div key={`trophy-${i}`} className={`floating-trophy trophy-${i}`}>🏆</div>
            ))}
            {[...Array(8)].map((_, i) => (
              <div key={`champion-${i}`} className={`champion-element champion-${i % 4}`}>
                {i % 4 === 0 ? '🔥' : i % 4 === 1 ? '🐉' : i % 4 === 2 ? '⚡' : '🪄'}
              </div>
            ))}
          </div>
        )}
        
        {(currentTheme.name === "Professor Sprout's Greenhouse" || currentTheme.name?.includes('Greenhouse')) && (
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