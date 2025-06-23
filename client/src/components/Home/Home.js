import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useDiary } from '../../context/DiaryContext';
import './Home.css';

const Home = () => {
  const { getHouseInfo } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    diaryEntries, 
    todos,
    drawings,
    fetchDiaryEntries, 
    fetchTodos, 
    fetchDrawings,
    loading 
  } = useDiary();
  
  const [recentEntries, setRecentEntries] = useState([]);
  const [recentDrawings, setRecentDrawings] = useState([]);
  const [recentTodos, setRecentTodos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalEntries: 0,
    totalDrawings: 0,
    totalTodos: 0,
    currentStreak: 0
  });

  const currentHouse = localStorage.getItem('selected_element') || localStorage.getItem('selected_house') || 'moonlight';
  const houseInfo = getHouseInfo(currentHouse);
  const userName = localStorage.getItem('user_name') || 'Young Wizard';

  // Fetch all data function
  const fetchAllData = async (showLoading = true) => {
    try {
      if (showLoading) setRefreshing(true);
      console.log('🚀 Starting data fetch...');
      
      const fetchPromise = fetchDiaryEntries();
      console.log('📞 Calling fetchDiaryEntries...');
      
      await Promise.all([
        fetchPromise,
        fetchTodos(),
        fetchDrawings()
      ]);
      
      console.log('✅ All data fetched successfully');
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      console.error('📊 Error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data
      });
    } finally {
      if (showLoading) setRefreshing(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    console.log('🏠 Home component mounted, fetching data...');
    fetchAllData();
    
    // Force a second fetch after a short delay to ensure fresh data
    const delayedFetch = setTimeout(() => {
      console.log('🔄 Performing delayed fetch to ensure fresh data...');
      fetchAllData(false);
    }, 1000);
    
    return () => clearTimeout(delayedFetch);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Additional effect to force refresh when diaryEntries context changes
  useEffect(() => {
    console.log('📝 Diary context updated, entries count:', diaryEntries?.length || 0);
  }, [diaryEntries]);

  // Refetch data when navigating to home page
  useEffect(() => {
    if (location.pathname === '/home') {
      // Small delay to ensure any recent saves are completed
      const timer = setTimeout(() => {
        fetchAllData(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Manual refresh function
  const handleManualRefresh = async () => {
    await fetchAllData(true);
  };

  // Update local state when context data changes
  useEffect(() => {
    console.log('📊 Processing diary data:', {
      diaryEntries: diaryEntries?.length || 0,
      diaryData: diaryEntries?.slice(0, 3)?.map(entry => ({
        id: entry.id,
        title: entry.title,
        house: entry.house,
        date: entry.date
      }))
    });

    // Process diary entries - include ALL entries for proper theme-based sorting
    if (diaryEntries && diaryEntries.length > 0) {
      const allEntries = diaryEntries.map(entry => ({
        ...entry,
        type: 'diary'
      }));
      setRecentEntries(allEntries);
      console.log('📚 All entries processed for theme-based sorting:', allEntries.length);
      console.log('📖 Entry distribution by house:', allEntries.reduce((acc, e) => {
        const house = e.house?.toLowerCase() || 'moonlight';
        acc[house] = (acc[house] || 0) + 1;
        return acc;
      }, {}));
    } else {
      setRecentEntries([]);
      console.log('📭 No diary entries found');
    }

    // Process drawings
    if (drawings && drawings.length > 0) {
      console.log('🎨 Processing drawings data:', drawings);
      const recent = drawings
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 4)
        .map(drawing => ({
      ...drawing,
      type: 'drawing'
        }));
      console.log('🖼️ Recent drawings for gallery:', recent.map(d => ({ id: d.id, title: d.title, hasCanvasData: !!d.canvas_data, hasImageData: !!d.image_data })));
      setRecentDrawings(recent);
    } else {
      setRecentDrawings([]);
      console.log('📭 No drawings found');
    }

    // Process todos
    if (todos && todos.length > 0) {
      const recent = todos
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 4)
        .map(todo => ({
      ...todo,
      type: 'todo'
        }));
      setRecentTodos(recent);
    } else {
      setRecentTodos([]);
    }

    // Calculate stats
    setStats({
      totalEntries: diaryEntries?.length || 0,
      totalDrawings: drawings?.length || 0,
      totalTodos: todos?.length || 0,
      currentStreak: Math.floor(Math.random() * 7) + 1 // Mock streak for now
    });
  }, [diaryEntries, drawings, todos]);

  // Sorting function
  const sortEntries = (entries, sortBy, sortOrder) => {
    const sortedEntries = [...entries].sort((a, b) => {
      let aValue, bValue;
      
      if (sortBy === 'date') {
        aValue = new Date(a.date || a.created_at || a.updated_at);
        bValue = new Date(b.date || b.created_at || b.updated_at);
      } else if (sortBy === 'title') {
        aValue = (a.title || '').toLowerCase();
        bValue = (b.title || '').toLowerCase();
      } else if (sortBy === 'modified') {
        aValue = new Date(a.updated_at || a.date || a.created_at);
        bValue = new Date(b.updated_at || b.date || b.created_at);
      }
      
      // Proper comparison logic
      if (aValue < bValue) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0; // Equal values
    });
    
    return sortedEntries;
  };

  // Group entries by mystical elements
  const groupEntriesByElement = (entries, sortBy, sortOrder) => {
    const elementMapping = {
      'moonlight': 'moonlight',
      'gryffindor': 'ember', // Legacy mapping
      'ember': 'ember',
      'slytherin': 'nature', // Legacy mapping
      'nature': 'nature',
      'ravenclaw': 'starlight', // Legacy mapping
      'starlight': 'starlight',
      'hufflepuff': 'moonlight', // Legacy mapping
      // Additional mappings for common cases
      'null': 'moonlight',
      'undefined': 'moonlight',
      '': 'moonlight'
    };

    const grouped = {
      moonlight: [],
      ember: [],
      nature: [],
      starlight: []
    };

    console.log('🔄 Grouping entries by element:', entries);
    console.log('📊 Using sort criteria:', { sortBy, sortOrder });

    entries.forEach(entry => {
      const houseValue = entry.house?.toLowerCase() || 'moonlight';
      const element = elementMapping[houseValue] || 'moonlight';
      grouped[element].push(entry);
      console.log(`📖 Entry "${entry.title}" (house: ${entry.house}) → ${element} element`);
    });

    // Sort entries within each group
    Object.keys(grouped).forEach(element => {
      if (grouped[element].length > 0) {
        console.log(`🔢 BEFORE sorting ${element} entries (${grouped[element].length} items) by ${sortBy} ${sortOrder}:`, 
          grouped[element].map(e => ({ 
            title: e.title, 
            date: e.date || e.created_at,
            sortValue: sortBy === 'title' ? e.title : (e.date || e.created_at)
          }))
        );
        
        grouped[element] = sortEntries(grouped[element], sortBy, sortOrder);
        
        console.log(`✅ AFTER sorting ${element} entries:`, grouped[element].map(e => ({ 
          title: e.title, 
          date: e.date || e.created_at,
          sortValue: sortBy === 'title' ? e.title : (e.date || e.created_at)
        })));
      }
    });

    console.log('📚 Final grouped and sorted entries:', {
      moonlight: grouped.moonlight.length,
      ember: grouped.ember.length,
      nature: grouped.nature.length,
      starlight: grouped.starlight.length
    });

    return grouped;
  };

  const elementInfo = {
    moonlight: {
      name: 'Moonlight',
      emoji: '🌙',
      gradient: 'linear-gradient(135deg, rgba(70, 130, 180, 0.3), rgba(106, 90, 205, 0.3))',
      color: '#4682B4',
      description: 'Wisdom & Serenity',
      keyWord: 'SERENITY'
    },
    ember: {
      name: 'Ember',
      emoji: '🔥',
      gradient: 'linear-gradient(135deg, rgba(220, 20, 60, 0.3), rgba(255, 69, 0, 0.3))',
      color: '#DC143C',
      description: 'Passion & Courage',
      keyWord: 'COURAGE'
    },
    nature: {
      name: 'Nature',
      emoji: '🌿',
      gradient: 'linear-gradient(135deg, rgba(34, 139, 34, 0.3), rgba(107, 142, 35, 0.3))',
      color: '#228B22',
      description: 'Growth & Harmony',
      keyWord: 'HARMONY'
    },
    starlight: {
      name: 'Starlight',
      emoji: '⭐',
      gradient: 'linear-gradient(135deg, rgba(138, 43, 226, 0.3), rgba(148, 0, 211, 0.3))',
      color: '#8A2BE2',
      description: 'Dreams & Magic',
      keyWord: 'MAGIC'
    }
  };

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

  // Sorting state declared early
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isSorting, setIsSorting] = useState(false);
  const [activeTheme, setActiveTheme] = useState('all'); // Add theme filter state

  // Handle sorting changes with loading state
  const handleSortByChange = (newSortBy) => {
    setIsSorting(true);
    setSortBy(newSortBy);
    console.log(`🔄 Changing sort criteria to: ${newSortBy}`);
    setTimeout(() => setIsSorting(false), 300);
  };

  const handleSortOrderToggle = () => {
    setIsSorting(true);
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    console.log(`🔄 Toggling sort order to: ${newOrder}`);
    setTimeout(() => setIsSorting(false), 300);
  };

  // Handle theme filtering
  const handleThemeFilter = (theme) => {
    setActiveTheme(theme);
  };

  // useMemo can now safely access sortBy/sortOrder
  const groupedEntries = useMemo(() => {
    console.log(`🧮 Recalculating grouped entries with sort: ${sortBy} ${sortOrder}`);
    return groupEntriesByElement(recentEntries, sortBy, sortOrder);
  }, [recentEntries, sortBy, sortOrder]);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Book navigation state for each theme (when more than 5 books)
  const [bookPages, setBookPages] = useState({
    moonlight: 0,
    ember: 0,
    nature: 0,
    starlight: 0
  });

  const themes = Object.keys(elementInfo);

  // Book navigation functions
  const BOOKS_PER_PAGE = 5;
  
  const navigateBooks = (theme, direction) => {
    const themeEntries = groupedEntries[theme] || [];
    const totalPages = Math.ceil(themeEntries.length / BOOKS_PER_PAGE);
    
    setBookPages(prev => ({
      ...prev,
      [theme]: direction === 'prev' 
        ? Math.max(0, prev[theme] - 1)
        : Math.min(totalPages - 1, prev[theme] + 1)
    }));
  };

  const getVisibleBooks = (theme) => {
    const themeEntries = groupedEntries[theme] || [];
    const currentPage = bookPages[theme];
    const startIndex = currentPage * BOOKS_PER_PAGE;
    const endIndex = startIndex + BOOKS_PER_PAGE;
    return themeEntries.slice(startIndex, endIndex);
  };

  const getBookNavigation = (theme) => {
    const themeEntries = groupedEntries[theme] || [];
    const totalPages = Math.ceil(themeEntries.length / BOOKS_PER_PAGE);
    const currentPage = bookPages[theme];
    
    return {
      hasNavigation: themeEntries.length > BOOKS_PER_PAGE,
      canGoPrev: currentPage > 0,
      canGoNext: currentPage < totalPages - 1,
      currentPage: currentPage + 1,
      totalPages,
      totalBooks: themeEntries.length
    };
  };

  // Handle magical book click with sparkling effect
  const [sparklingBook, setSparklingBook] = useState(null);
  
  const handleBookClick = (entryId, e) => {
    e.preventDefault();
    setSparklingBook(entryId);
    
    // Create sparkle effect
    const rect = e.currentTarget.getBoundingClientRect();
    const sparkles = [];
    
    for (let i = 0; i < 12; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'magical-sparkle';
      sparkle.style.left = `${rect.left + rect.width / 2 + (Math.random() - 0.5) * 60}px`;
      sparkle.style.top = `${rect.top + rect.height / 2 + (Math.random() - 0.5) * 60}px`;
      sparkle.style.animationDelay = `${Math.random() * 0.3}s`;
      document.body.appendChild(sparkle);
      sparkles.push(sparkle);
    }
    
    // Navigate after sparkle effect
    setTimeout(() => {
      // Navigate to the diary entry
      navigate(`/diary/${entryId}`);
      
      // Clean up sparkles
      sparkles.forEach(sparkle => {
        if (sparkle.parentNode) {
          sparkle.parentNode.removeChild(sparkle);
        }
      });
      setSparklingBook(null);
    }, 800);
  };

  // Cleanup sparkles on unmount
  useEffect(() => {
    return () => {
      // Clean up any remaining sparkles
      const sparkles = document.querySelectorAll('.magical-sparkle');
      sparkles.forEach(sparkle => {
        if (sparkle.parentNode) {
          sparkle.parentNode.removeChild(sparkle);
        }
      });
    };
  }, []);

  // Filter themes based on active filter
  const getFilteredThemes = () => {
    if (activeTheme === 'all') {
      return themes;
    }
    return [activeTheme];
  };

  // Book Icon Selector Component
  const BookIconSelector = ({ selectedIcon, onIconSelect, theme, show = false }) => {
    const [availableIcons, setAvailableIcons] = useState([]);

    useEffect(() => {
      // Generate list of available book icons (1-22)
      const icons = [];
      for (let i = 1; i <= 22; i++) {
        icons.push(`book (${i}).png`);
      }
      setAvailableIcons(icons);
    }, []);

    if (!show) return null;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="book-icon-selector"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '30px',
          border: '2px solid rgba(255, 215, 0, 0.5)',
          zIndex: 1000,
          maxWidth: '600px',
          maxHeight: '500px',
          overflow: 'auto'
        }}
      >
        <h3 style={{ color: '#FFD700', textAlign: 'center', marginBottom: '20px' }}>
          📚 Choose Your Book Icon
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))',
          gap: '15px',
          maxHeight: '300px',
          overflow: 'auto'
        }}>
          {/* Default theme icon */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onIconSelect('default')}
            style={{
              cursor: 'pointer',
              padding: '10px',
              borderRadius: '10px',
              border: selectedIcon === 'default' ? `2px solid #FFD700` : '2px solid transparent',
              background: selectedIcon === 'default' ? 'rgba(255, 215, 0, 0.1)' : 'transparent'
            }}
          >
            <img
              src={`/books/Default book/${theme} default.png`}
              alt="Default"
              style={{ width: '50px', height: '70px', objectFit: 'contain' }}
            />
            <p style={{ color: '#FFD700', fontSize: '10px', textAlign: 'center', margin: '5px 0 0 0' }}>
              Default
            </p>
          </motion.div>

          {/* Custom book icons */}
          {availableIcons.map((icon, index) => (
            <motion.div
              key={icon}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onIconSelect(icon)}
              style={{
                cursor: 'pointer',
                padding: '10px',
                borderRadius: '10px',
                border: selectedIcon === icon ? `2px solid #FFD700` : '2px solid transparent',
                background: selectedIcon === icon ? 'rgba(255, 215, 0, 0.1)' : 'transparent'
              }}
            >
              <img
                src={`/books/${icon}`}
                alt={`Book ${index + 1}`}
                style={{ width: '50px', height: '70px', objectFit: 'contain' }}
              />
              <p style={{ color: '#FFD700', fontSize: '10px', textAlign: 'center', margin: '5px 0 0 0' }}>
                #{index + 1}
              </p>
            </motion.div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={() => onIconSelect(null)}
            style={{
              background: '#666',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '10px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </motion.div>
    );
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
          <div className="welcome-content">
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
          
          <div className="library-actions">
            <button
              onClick={handleManualRefresh}
              disabled={refreshing || loading}
              className="refresh-btn magical-button"
              title="Refresh library contents"
            >
              {refreshing || loading ? '🔄' : '↻'} 
              {refreshing || loading ? 'Updating...' : 'Refresh'}
            </button>
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
        
        {/* Static Mystical Bookshelf */}
        <motion.section className="static-bookshelf memoir-shelf" variants={itemVariants}>
          <div className="shelf-header">
            <h2 className="shelf-title">
              <img src="/icon/book-stack.png" alt="Book Stack" className="shelf-icon" style={{width: '24px', height: '24px', marginRight: '8px'}} />
              Mystical Element Chronicles
            </h2>
            <Link to="/diary" className="shelf-link">View All →</Link>
          </div>
          
          {/* Static Controls */}
          <div className="static-bookshelf-controls">
            {/* Sorting Controls */}
            <div className={`sorting-controls ${isSorting ? 'sorting-active' : ''}`}>
              <div className="sort-group">
                <label className="sort-label">Sort by:</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => handleSortByChange(e.target.value)}
                  className="sort-select"
                  title="Choose sorting criteria"
                  disabled={isSorting}
                >
                  <option value="date">📅 Created Date</option>
                  <option value="modified">📝 Modified Date</option>
                  <option value="title">🔤 Title (A-Z)</option>
                </select>
              </div>
              
              <button
                onClick={handleSortOrderToggle}
                className="sort-order-btn"
                title={`Currently ${sortOrder === 'asc' ? 'Ascending' : 'Descending'} - Click to toggle`}
                disabled={isSorting}
              >
                {isSorting ? '🔄' : (sortOrder === 'asc' ? '⬆️' : '⬇️')}
                <span className="sort-order-text">
                  {isSorting ? '...' : (sortOrder === 'asc' ? 'ASC' : 'DESC')}
                </span>
              </button>
            </div>
            
            {/* Theme Filter Buttons */}
            <div className="theme-filters">
              <button
                className={`theme-filter ${activeTheme === 'all' ? 'active' : ''}`}
                onClick={() => handleThemeFilter('all')}
                title="Show All Elements"
              >
                🌟 All
              </button>
              {themes.map((themeKey) => (
                <button
                  key={themeKey}
                  className={`theme-filter ${activeTheme === themeKey ? 'active' : ''}`}
                  onClick={() => handleThemeFilter(themeKey)}
                  style={{ 
                    backgroundColor: activeTheme === themeKey ? elementInfo[themeKey].color : 'transparent',
                    borderColor: elementInfo[themeKey].color,
                    boxShadow: activeTheme === themeKey ? `0 0 20px ${elementInfo[themeKey].color}40` : 'none'
                  }}
                  title={`${elementInfo[themeKey].name} Chronicles`}
                >
                  {elementInfo[themeKey].emoji} {elementInfo[themeKey].name}
                </button>
              ))}
            </div>
          </div>

          {/* Static Theme Sections Grid */}
          <div className="static-themes-grid">
            {getFilteredThemes().map((themeKey) => {
              const element = elementInfo[themeKey];
              const elementEntries = groupedEntries[themeKey] || [];
              const hasEntries = elementEntries.length > 0;
              
                              return (
                  <div
                    key={themeKey}
                    className={`static-theme-section ${themeKey}-section`}
                  >
                  <div className="element-header">
                    <div className="element-info">
                      <span className="element-emoji">{element.emoji}</span>
                      <div className="element-details">
                        <h3>{element.name} Chronicles</h3>
                        <p className="element-description">{element.description}</p>
                      </div>
                    </div>
                    <div className="element-count" style={{ color: element.color }}>
                      {elementEntries.length} {elementEntries.length === 1 ? 'entry' : 'entries'}
                    </div>
                  </div>
                  
                  <div className="magical-bookshelf">
                    <div className="bookshelf-wood"></div>
                    
                    {(() => {
                      const visibleBooks = getVisibleBooks(themeKey);
                      const bookNav = getBookNavigation(themeKey);
                      
                      return (
                        <>
                          {/* Navigation Arrows */}
                          {bookNav.hasNavigation && (
                            <>
                              <button
                                onClick={() => navigateBooks(themeKey, 'prev')}
                                className="book-nav-arrow book-nav-prev"
                                disabled={!bookNav.canGoPrev}
                                title="Previous Books"
                              >
                                ◀
                              </button>
                              
                              <button
                                onClick={() => navigateBooks(themeKey, 'next')}
                                className="book-nav-arrow book-nav-next"
                                disabled={!bookNav.canGoNext}
                                title="Next Books"
                              >
                                ▶
                              </button>
                            </>
                          )}

                          {/* Books Display Area */}
                          <div className={`element-books books-count-${Math.min(visibleBooks.length, 7)}`}>
                            {visibleBooks.length > 0 ? (
                              <>
                                {/* Books */}
                                {visibleBooks.map((entry, entryIndex) => (
                                <motion.div
                                  key={entry.id}
                                  className={`memoir-book ${themeKey}-book ${sparklingBook === entry.id ? 'sparkling' : ''}`}
                                  whileHover={{ 
                                    y: -6,
                                    scale: 1.05,
                                    rotateY: 8
                                  }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={(e) => handleBookClick(entry.id, e)}
                                  style={{ 
                                    cursor: 'pointer',
                                    position: 'relative',
                                    transition: 'all 0.3s ease'
                                  }}
                                >
                                  {/* Book Image */}
                                  <img
                                    src={entry.bookIcon && entry.bookIcon !== 'default' 
                                      ? `/books/${entry.bookIcon}` 
                                      : `/books/Default book/${elementInfo[themeKey].name} default.png`}
                                    alt={entry.title}
                                    onError={(e) => {
                                      // Fallback to default if custom icon fails to load
                                      e.target.src = `/books/Default book/${elementInfo[themeKey].name} default.png`;
                                    }}
                                    style={{
                                      width: '50px',
                                      height: '75px',
                                      objectFit: 'contain',
                                      filter: 'brightness(1.1) saturate(1.2)',
                                      transition: 'all 0.3s ease',
                                      borderRadius: '3px',
                                      boxShadow: `0 6px 20px ${elementInfo[themeKey].color}40`
                                    }}
                                  />
                                  
                                  {/* Book Title Overlay */}
                                  <div style={{
                                    position: 'absolute',
                                    bottom: '-18px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: 'rgba(0,0,0,0.8)',
                                    color: elementInfo[themeKey].color,
                                    padding: '3px 6px',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    minWidth: '50px',
                                    maxWidth: '65px',
                                    backdropFilter: 'blur(10px)',
                                    border: `1px solid ${elementInfo[themeKey].color}40`,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                  }}>
                                    {entry.title.length > 8 ? entry.title.substring(0, 8) + '...' : entry.title}
                                  </div>
                                  
                                  {/* Magical Glow Effect */}
                                  <div style={{
                                    position: 'absolute',
                                    top: '-5px',
                                    left: '-5px',
                                    right: '-5px',
                                    bottom: '-5px',
                                    background: `radial-gradient(circle, ${elementInfo[themeKey].color}20 0%, transparent 70%)`,
                                    borderRadius: '8px',
                                    zIndex: -1,
                                    animation: sparklingBook === entry.id ? 'bookSparkle 0.8s ease-in-out' : 'none'
                                  }} />
                                </motion.div>
                                ))}
                              </>
                            ) : (
                              <div className="empty-shelf">
                                <div className="empty-space">
                                  <span className="empty-icon" style={{ fontSize: '3rem', marginBottom: '10px' }}>
                                    {element.emoji}
                                  </span>
                                  <p style={{ 
                                    color: element.color, 
                                    fontWeight: 'bold',
                                    fontSize: '1.1rem',
                                    marginBottom: '15px',
                                    textAlign: 'center'
                                  }}>
                                    No magic happened yet!
                                  </p>
                                  <p style={{ 
                                    color: 'rgba(255,255,255,0.8)', 
                                    fontSize: '0.9rem',
                                    marginBottom: '20px',
                                    textAlign: 'center',
                                    fontStyle: 'italic'
                                  }}>
                                    Show your magic here ✨
                                  </p>
                                  <Link 
                                    to="/diary/new" 
                                    className="create-first-book-btn"
                                    style={{ 
                                      backgroundColor: element.color,
                                      boxShadow: `0 5px 15px ${element.color}40`,
                                      display: 'inline-block',
                                      padding: '10px 20px',
                                      borderRadius: '10px',
                                      textDecoration: 'none',
                                      color: 'white',
                                      fontWeight: 'bold',
                                      fontSize: '0.9rem',
                                      transition: 'all 0.3s ease'
                                    }}
                                  >
                                    🪄 Create First Memoir
                                  </Link>
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              );
            })}
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
            {recentDrawings.length > 0 ? (
              recentDrawings.map((drawing, index) => (
                <motion.div
                  key={drawing.id || index}
                  className="magical-scroll"
                  whileHover={{ y: -10, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to={`/drawing/${drawing.id}`} 
                    className="scroll-link"
                    onClick={() => {
                      console.log('🖱️ Gallery: Clicking on drawing:', {
                        id: drawing.id,
                        title: drawing.title,
                        url: `/drawing/${drawing.id}`,
                        hasCanvasData: !!drawing.canvas_data,
                        hasImageData: !!drawing.image_data
                      });
                    }}
                  >
                    <div className="scroll-wrapper">
                      <div className="scroll-title">{drawing.title || `Artwork ${index + 1}`}</div>
                      <div className="scroll-preview">
                        {drawing.canvas_data || drawing.image_data ? (
                          <img
                            src={drawing.canvas_data || drawing.image_data}
                            alt={drawing.title || `Artwork ${index + 1}`}
                            className="artwork-preview"
                            onError={(e) => {
                              // Fallback to placeholder if image fails to load
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'block';
                            }}
                            style={{
                              width: '80px',
                              height: '60px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              border: '2px solid rgba(255, 215, 0, 0.6)',
                              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                              filter: 'brightness(1.1) saturate(1.2)',
                              transition: 'all 0.3s ease'
                            }}
                          />
                        ) : null}
                        <div
                          className="artwork-placeholder"
                          style={{
                            display: (drawing.canvas_data || drawing.image_data) ? 'none' : 'block',
                            fontSize: '2.5rem',
                            opacity: 0.8,
                            filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5))'
                          }}
                        >
                          🎨
                        </div>
                      </div>
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
            {recentTodos.length > 0 ? (
              recentTodos.map((todo, index) => (
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
        <div className="floating-candle candle-2">🦋</div>
        <div className="floating-sparkle sparkle-1">✨</div>
        <div className="floating-sparkle sparkle-2">⭐</div>
        <div className="floating-sparkle sparkle-3">💫</div>
      </div>
    </motion.div>
  );
};

export default Home; 