import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useDiary } from '../../context/DiaryContext';
import './Home.css';

const Home = () => {
  const { getHouseInfo } = useTheme();
  const { entries } = useDiary();
  const [recentEntries, setRecentEntries] = useState([]);
  const [drawings, setDrawings] = useState([]);
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState({
    totalEntries: 0,
    totalDrawings: 0,
    totalTodos: 0,
    currentStreak: 0
  });

  const currentHouse = localStorage.getItem('selected_element') || localStorage.getItem('selected_house') || 'moonlight';
  const houseInfo = getHouseInfo(currentHouse);
  const userName = localStorage.getItem('user_name') || 'Young Wizard';

  useEffect(() => {
    // Fetch recent diary entries
    if (entries && entries.length > 0) {
      const recent = entries.slice(0, 6).map(entry => ({
        ...entry,
        type: 'diary'
      }));
      setRecentEntries(recent);
    }

    // Fetch drawings from localStorage or API
    const savedDrawings = JSON.parse(localStorage.getItem('saved_drawings') || '[]');
    setDrawings(savedDrawings.slice(0, 4).map(drawing => ({
      ...drawing,
      type: 'drawing'
    })));

    // Fetch todos from localStorage or API
    const savedTodos = JSON.parse(localStorage.getItem('magical_quests') || '[]');
    setTodos(savedTodos.slice(0, 4).map(todo => ({
      ...todo,
      type: 'todo'
    })));

    // Calculate stats
    setStats({
      totalEntries: entries?.length || 0,
      totalDrawings: savedDrawings.length,
      totalTodos: savedTodos.length,
      currentStreak: Math.floor(Math.random() * 7) + 1 // Mock streak
    });
  }, [entries]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <motion.div 
      className="magical-library"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Library Header */}
      <motion.div className="library-header" variants={itemVariants}>
        <div className="welcome-section">
          <h1 className="library-title">
            🏰 The Magical Library of Memories
          </h1>
          <p className="library-subtitle">
            {getTimeGreeting()}, {userName}! Welcome to your personal collection of magical memories.
          </p>
          <div className="house-welcome">
            <span className="house-mascot">{houseInfo.mascot}</span>
            <span className="house-text">House {houseInfo.name} Archives</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="library-stats">
          <div className="stat-item">
            <span className="stat-icon">📖</span>
            <span className="stat-number">{stats.totalEntries}</span>
            <span className="stat-label">Diary Entries</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🎨</span>
            <span className="stat-number">{stats.totalDrawings}</span>
            <span className="stat-label">Magical Arts</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">✅</span>
            <span className="stat-number">{stats.totalTodos}</span>
            <span className="stat-label">Quests</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🔥</span>
            <span className="stat-number">{stats.currentStreak}</span>
            <span className="stat-label">Day Streak</span>
          </div>
        </div>
      </motion.div>

      {/* Main Library Shelves */}
      <div className="library-shelves">
        
        {/* Recent Diary Entries Shelf */}
        <motion.section className="bookshelf diary-shelf" variants={itemVariants}>
          <div className="shelf-header">
            <h2 className="shelf-title">
              <span className="shelf-icon">📚</span>
              Recent Memoir Chronicles
            </h2>
            <Link to="/diary" className="shelf-link">View All →</Link>
          </div>
          
          <div className="books-container">
            {recentEntries.length > 0 ? (
              recentEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  className="magical-book diary-book"
                  whileHover={{ y: -10, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to={`/diary/${entry.id}`} className="book-link">
                    <div className="book-spine">
                      <div className="book-title">{entry.title || 'Untitled Entry'}</div>
                      <div className="book-date">{new Date(entry.date).toLocaleDateString()}</div>
                      <div className="book-pages">{Math.floor(Math.random() * 20) + 5} pages</div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="empty-shelf">
                <p>📖 Your diary awaits your first magical entry...</p>
                <Link to="/diary/new" className="magical-button">Start Writing</Link>
              </div>
            )}
          </div>
        </motion.section>

        {/* Drawings Shelf */}
        <motion.section className="bookshelf drawing-shelf" variants={itemVariants}>
          <div className="shelf-header">
            <h2 className="shelf-title">
              <span className="shelf-icon">🎨</span>
              Magical Artworks Gallery
            </h2>
            <Link to="/gallery" className="shelf-link">View All →</Link>
          </div>
          
          <div className="scrolls-container">
            {drawings.length > 0 ? (
              drawings.map((drawing, index) => (
                <motion.div
                  key={drawing.id || index}
                  className="magical-scroll"
                  whileHover={{ y: -10, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/drawing" className="scroll-link">
                    <div className="scroll-wrapper">
                      <div className="scroll-title">{drawing.title || `Artwork ${index + 1}`}</div>
                      <div className="scroll-preview">🖼️</div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="empty-shelf">
                <p>🎨 Your magical canvas awaits your creativity...</p>
                <Link to="/drawing" className="magical-button">Start Drawing</Link>
              </div>
            )}
          </div>
        </motion.section>

        {/* Todo Lists Shelf */}
        <motion.section className="bookshelf quest-shelf" variants={itemVariants}>
          <div className="shelf-header">
            <h2 className="shelf-title">
              <span className="shelf-icon">⚔️</span>
              Active Magical Quests
            </h2>
            <Link to="/todos" className="shelf-link">View All →</Link>
          </div>
          
          <div className="quest-container">
            {todos.length > 0 ? (
              todos.map((todo, index) => (
                <motion.div
                  key={todo.id || index}
                  className={`quest-item ${todo.completed ? 'completed' : 'active'}`}
                  whileHover={{ x: 10 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link to="/todos" className="quest-link">
                    <div className="quest-icon">
                      {todo.completed ? '✅' : '⏳'}
                    </div>
                    <div className="quest-content">
                      <div className="quest-title">{todo.text || todo.title || 'Mysterious Quest'}</div>
                      <div className="quest-status">
                        {todo.completed ? 'Completed' : 'In Progress'}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="empty-shelf">
                <p>⚔️ No active quests... Time to embark on new adventures!</p>
                <Link to="/todos" className="magical-button">Create Quest</Link>
              </div>
            )}
          </div>
        </motion.section>
      </div>

      {/* Quick Actions */}
      <motion.section className="quick-actions" variants={itemVariants}>
        <h3 className="actions-title">✨ Quick Magical Actions</h3>
        <div className="actions-grid">
          <Link to="/diary/new" className="action-card diary-action">
            <div className="action-icon">📝</div>
            <div className="action-title">New Memoir Entry</div>
            <div className="action-subtitle">Capture today's magic</div>
          </Link>
          
          <Link to="/drawing" className="action-card drawing-action">
            <div className="action-icon">🎨</div>
            <div className="action-title">Create Artwork</div>
            <div className="action-subtitle">Express your creativity</div>
          </Link>
          
          <Link to="/todos" className="action-card quest-action">
            <div className="action-icon">⚔️</div>
            <div className="action-title">New Quest</div>
            <div className="action-subtitle">Plan your adventures</div>
          </Link>
          
          <Link to="/gallery" className="action-card gallery-action">
            <div className="action-icon">🖼️</div>
            <div className="action-title">Browse Gallery</div>
            <div className="action-subtitle">Relive memories</div>
          </Link>
        </div>
      </motion.section>

      {/* Floating magical elements */}
      <div className="library-atmosphere">
        <div className="floating-book book-1">📖</div>
        <div className="floating-book book-2">📚</div>
        <div className="floating-book book-3">📜</div>
        <div className="floating-candle candle-1">🕯️</div>
        <div className="floating-candle candle-2">🕯️</div>
        <div className="floating-sparkle sparkle-1">✨</div>
        <div className="floating-sparkle sparkle-2">⭐</div>
        <div className="floating-sparkle sparkle-3">💫</div>
      </div>
    </motion.div>
  );
};

export default Home; 