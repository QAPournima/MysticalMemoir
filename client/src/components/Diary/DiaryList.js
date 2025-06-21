import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDiary } from '../../context/DiaryContext';
import { useTheme } from '../../context/ThemeContext';
import LoadingSpinner from '../UI/LoadingSpinner';
import MagicalSearch from '../UI/MagicalSearch';
import MagicalTimestamp, { SimpleTimestamp } from '../UI/MagicalTimestamp';
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
  
  const [searchResults, setSearchResults] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  // Helper function to safely parse JSON
  const safeJsonParse = (jsonString, fallback = []) => {
    try {
      if (!jsonString || jsonString === 'null' || jsonString === 'undefined') {
        return fallback;
      }
      const parsed = JSON.parse(jsonString);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch (error) {
      console.warn('Failed to parse JSON:', jsonString, error);
      return fallback;
    }
  };

  useEffect(() => {
    fetchDiaryEntries();
  }, []);

  useEffect(() => {
    // Initialize search results with all entries
    setSearchResults(diaryEntries);
  }, [diaryEntries]);

  const getMoodEmoji = (moodId) => {
    const mood = MOOD_OPTIONS.find(m => m.id === moodId);
    return mood ? mood.emoji : '😊';
  };

  const getWeatherEmoji = (weatherId) => {
    const weather = WEATHER_OPTIONS.find(w => w.id === weatherId);
    return weather ? weather.emoji : '☀️';
  };

  const handleSearchResults = (results, stats) => {
    setSearchResults(results);
  };

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
    return <LoadingSpinner message="Loading your mystical memories..." />;
  }

  return (
    <div className="diary-list">
      <div className="diary-header">
        <h1 className="magical-title">📖 Your Mystical Memoir</h1>
        <p className="diary-subtitle">
          Capture your thoughts, dreams, and mystical moments
        </p>
        
        <Link to="/diary/new" className="new-entry-btn magical-button">
          ✨ Write New Entry
        </Link>
      </div>

      {/* Enhanced Search */}
      <MagicalSearch
        data={diaryEntries}
        onResults={handleSearchResults}
        placeholder="🔍 Search your mystical memories..."
        searchFields={['title', 'content', 'tags']}
        filters={{
          house: true,
          mood: true,
          weather: true,
          bookmarked: true,
          dateRange: true
        }}
        enableHistory={true}
        enableSorting={true}
        className="diary-search"
      />

      {/* Entries List */}
      <div className="entries-container">
        {error && (
          <div className="error-message magical-card">
            <p>⚠️ {error}</p>
          </div>
        )}
        
        {searchResults.length === 0 ? (
          <div className="empty-state magical-card">
            <div className="empty-icon">📝</div>
            <h3>No entries found</h3>
            <p>
              {diaryEntries.length === 0
                ? "Start your mystical journey by writing your first memoir entry!"
                : "Try adjusting your search terms or filters"}
            </p>
            {diaryEntries.length === 0 && (
              <Link to="/diary/new" className="magical-button">
                ✨ Write Your First Entry
              </Link>
            )}
          </div>
        ) : (
          <div className="entries-grid">
            <AnimatePresence>
              {searchResults.map((entry) => (
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
                      <SimpleTimestamp 
                        date={entry.created_at || entry.date} 
                        format="short"
                        showIcon={true}
                      />
                      <div className="entry-indicators">
                        {entry.mood && (
                          <span className="mood-indicator" title={MOOD_OPTIONS.find(m => m.id === entry.mood)?.name}>
                            {getMoodEmoji(entry.mood)}
                          </span>
                        )}
                        {entry.weather && (
                          <span className="weather-indicator" title={WEATHER_OPTIONS.find(w => w.id === entry.weather)?.name}>
                            {getWeatherEmoji(entry.weather)}
                          </span>
                        )}
                        {entry.house && (
                          <span className={`house-indicator ${entry.house}`} title={entry.house}>
                            {entry.house === 'gryffindor' && '🔥'}
                            {entry.house === 'slytherin' && '🌿'}
                            {entry.house === 'ravenclaw' && '🌙'}
                            {entry.house === 'hufflepuff' && '⭐'}
                            {entry.house === 'ember' && '🔥'}
                            {entry.house === 'nature' && '🌿'}
                            {entry.house === 'moonlight' && '🌙'}
                            {entry.house === 'starlight' && '⭐'}
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
                      {entry.content.replace(/<[^>]*>/g, '').substring(0, 150)}
                      {entry.content.length > 150 && '...'}
                    </p>
                  </Link>
                  
                  {(() => {
                    const tags = safeJsonParse(entry.tags);
                    return tags.length > 0 && (
                      <div className="entry-tags">
                        {tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="tag">#{tag}</span>
                        ))}
                        {tags.length > 3 && (
                          <span className="tag more">+{tags.length - 3} more</span>
                        )}
                      </div>
                    );
                  })()}
                  
                  {(() => {
                    const images = safeJsonParse(entry.images);
                    const drawings = safeJsonParse(entry.drawings);
                    const stickers = safeJsonParse(entry.stickers);
                    const hasAttachments = images.length > 0 || drawings.length > 0 || stickers.length > 0;
                    
                    return hasAttachments && (
                      <div className="entry-attachments">
                        {images.length > 0 && (
                          <span className="attachment-indicator" title="Has images">📸</span>
                        )}
                        {drawings.length > 0 && (
                          <span className="attachment-indicator" title="Has drawings">🎨</span>
                        )}
                        {stickers.length > 0 && (
                          <span className="attachment-indicator" title="Has stickers">✨</span>
                        )}
                      </div>
                    );
                  })()}

                  {/* Timestamps for created/updated */}
                  <div className="entry-timestamps">
                    <MagicalTimestamp
                      createdAt={entry.created_at}
                      updatedAt={entry.updated_at}
                      showCalendar={false}
                      showRelative={true}
                      size="small"
                      className="entry-timestamp"
                    />
                  </div>
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