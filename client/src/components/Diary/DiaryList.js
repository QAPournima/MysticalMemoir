import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDiary } from '../../context/DiaryContext';
import { useTheme } from '../../context/ThemeContext';
import LoadingSpinner from '../UI/LoadingSpinner';
import './DiaryList.css';

const DiaryList = () => {
  const { 
    diaryEntries, 
    loading, 
    error, 
    fetchDiaryEntries, 
    deleteDiaryEntry, 
    toggleBookmark 
  } = useDiary();
  
  const { MOOD_OPTIONS, WEATHER_OPTIONS } = useTheme();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterHouse, setFilterHouse] = useState('all');
  const [filterMood, setFilterMood] = useState('all');
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  useEffect(() => {
    fetchDiaryEntries();
  }, []);

  const getMoodEmoji = (moodId) => {
    const mood = MOOD_OPTIONS.find(m => m.id === moodId);
    return mood ? mood.emoji : '😊';
  };

  const getWeatherEmoji = (weatherId) => {
    const weather = WEATHER_OPTIONS.find(w => w.id === weatherId);
    return weather ? weather.emoji : '☀️';
  };

  const filteredEntries = diaryEntries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesHouse = filterHouse === 'all' || entry.house === filterHouse;
    const matchesMood = filterMood === 'all' || entry.mood === filterMood;
    const matchesBookmark = !showBookmarked || entry.bookmarked;
    
    return matchesSearch && matchesHouse && matchesMood && matchesBookmark;
  });

  const sortedEntries = [...filteredEntries].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date) - new Date(a.date);
      case 'title':
        return a.title.localeCompare(b.title);
      case 'mood':
        return (a.mood || '').localeCompare(b.mood || '');
      default:
        return 0;
    }
  });

  const handleDelete = async (id) => {
    try {
      await deleteDiaryEntry(id);
      setShowDeleteModal(null);
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const handleBookmark = async (id) => {
    try {
      await toggleBookmark(id);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading && diaryEntries.length === 0) {
    return <LoadingSpinner message="Loading your magical memories..." />;
  }

  return (
    <div className="diary-list">
      <div className="diary-header">
        <h1 className="magical-title">📖 Your Magical Diary</h1>
        <p className="diary-subtitle">
          Capture your thoughts, dreams, and magical moments
        </p>
        
        <Link to="/diary/new" className="new-entry-btn magical-button">
          ✨ Write New Entry
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="diary-filters magical-card">
        <div className="filter-row">
          <div className="search-container">
            <input
              type="text"
              placeholder="🔍 Search your memories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input magical-input"
            />
          </div>
          
          <div className="filter-controls">
            <select
              value={filterHouse}
              onChange={(e) => setFilterHouse(e.target.value)}
              className="filter-select magical-input"
            >
              <option value="all">All Houses</option>
              <option value="gryffindor">🦁 Gryffindor</option>
              <option value="slytherin">🐍 Slytherin</option>
              <option value="ravenclaw">🦅 Ravenclaw</option>
              <option value="hufflepuff">🦡 Hufflepuff</option>
            </select>
            
            <select
              value={filterMood}
              onChange={(e) => setFilterMood(e.target.value)}
              className="filter-select magical-input"
            >
              <option value="all">All Moods</option>
              {MOOD_OPTIONS.map(mood => (
                <option key={mood.id} value={mood.id}>
                  {mood.emoji} {mood.name}
                </option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select magical-input"
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="mood">Sort by Mood</option>
            </select>
          </div>
        </div>
        
        <div className="filter-toggles">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={showBookmarked}
              onChange={(e) => setShowBookmarked(e.target.checked)}
            />
            <span className="toggle-text">🔖 Show only bookmarked</span>
          </label>
        </div>
      </div>

      {/* Entries List */}
      <div className="entries-container">
        {error && (
          <div className="error-message magical-card">
            <p>⚠️ {error}</p>
          </div>
        )}
        
        {sortedEntries.length === 0 ? (
          <div className="empty-state magical-card">
            <div className="empty-icon">📝</div>
            <h3>No entries found</h3>
            <p>
              {searchTerm || filterHouse !== 'all' || filterMood !== 'all' || showBookmarked
                ? "Try adjusting your filters or search terms"
                : "Start your magical journey by writing your first diary entry!"}
            </p>
            {!searchTerm && filterHouse === 'all' && filterMood === 'all' && !showBookmarked && (
              <Link to="/diary/new" className="magical-button">
                ✨ Write Your First Entry
              </Link>
            )}
          </div>
        ) : (
          <div className="entries-grid">
            <AnimatePresence>
              {sortedEntries.map((entry) => (
                <motion.div
                  key={entry.id}
                  className="diary-entry-card magical-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="entry-header">
                    <div className="entry-meta">
                      <span className="entry-date">{formatDate(entry.date)}</span>
                      <div className="entry-indicators">
                        {entry.mood && (
                          <span className="mood-indicator">
                            {getMoodEmoji(entry.mood)}
                          </span>
                        )}
                        {entry.weather && (
                          <span className="weather-indicator">
                            {getWeatherEmoji(entry.weather)}
                          </span>
                        )}
                        {entry.house && (
                          <span className={`house-indicator ${entry.house}`}>
                            {entry.house === 'gryffindor' && '🦁'}
                            {entry.house === 'slytherin' && '🐍'}
                            {entry.house === 'ravenclaw' && '🦅'}
                            {entry.house === 'hufflepuff' && '🦡'}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="entry-actions">
                      <button
                        onClick={() => handleBookmark(entry.id)}
                        className={`bookmark-btn ${entry.bookmarked ? 'bookmarked' : ''}`}
                        title={entry.bookmarked ? 'Remove bookmark' : 'Add bookmark'}
                      >
                        {entry.bookmarked ? '🔖' : '📑'}
                      </button>
                      
                      <button
                        onClick={() => setShowDeleteModal(entry.id)}
                        className="delete-btn"
                        title="Delete entry"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  
                  <Link to={`/diary/${entry.id}`} className="entry-link">
                    <h3 className="entry-title">{entry.title}</h3>
                    <p className="entry-preview">
                      {entry.content.substring(0, 150)}
                      {entry.content.length > 150 && '...'}
                    </p>
                  </Link>
                  
                  {entry.tags && JSON.parse(entry.tags).length > 0 && (
                    <div className="entry-tags">
                      {JSON.parse(entry.tags).slice(0, 3).map((tag, index) => (
                        <span key={index} className="tag">#{tag}</span>
                      ))}
                    </div>
                  )}
                  
                  {(entry.images || entry.drawings || entry.stickers) && (
                    <div className="entry-attachments">
                      {entry.images && JSON.parse(entry.images).length > 0 && (
                        <span className="attachment-indicator">📸</span>
                      )}
                      {entry.drawings && JSON.parse(entry.drawings).length > 0 && (
                        <span className="attachment-indicator">🎨</span>
                      )}
                      {entry.stickers && JSON.parse(entry.stickers).length > 0 && (
                        <span className="attachment-indicator">✨</span>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <motion.div
            className="delete-modal magical-card"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <h3>Delete Entry?</h3>
            <p>This magical memory will be lost forever. Are you sure?</p>
            <div className="modal-actions">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="cancel-btn magical-button"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteModal)}
                className="confirm-delete-btn magical-button"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DiaryList; 