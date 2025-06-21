import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import './MagicalSearch.css';

const MagicalSearch = ({ 
  data = [], 
  onResults, 
  placeholder = "Search your magical entries...",
  searchFields = ['title', 'content'],
  filters = {},
  enableHistory = true,
  enableSorting = true,
  className = ""
}) => {
  const { currentHouse, getHouseInfo, MOOD_OPTIONS, WEATHER_OPTIONS } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [sortOrder, setSortOrder] = useState('desc');
  const [activeFilters, setActiveFilters] = useState({});
  const [searchStats, setSearchStats] = useState({ total: 0, found: 0 });

  const searchInputRef = useRef(null);
  const historyRef = useRef(null);
  const houseInfo = getHouseInfo(currentHouse);

  // Load search history from localStorage
  useEffect(() => {
    if (enableHistory) {
      const history = localStorage.getItem('magical_search_history');
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    }
  }, [enableHistory]);

  // Save search history to localStorage
  const saveSearchHistory = (term) => {
    if (!enableHistory || !term.trim()) return;
    
    const updatedHistory = [term, ...searchHistory.filter(h => h !== term)].slice(0, 10);
    setSearchHistory(updatedHistory);
    localStorage.setItem('magical_search_history', JSON.stringify(updatedHistory));
  };

  // Advanced search function with multiple criteria
  const performSearch = (term, filters = activeFilters) => {
    if (!term.trim() && Object.keys(filters).length === 0) {
      const stats = { total: data.length, found: data.length };
      setSearchStats(stats);
      onResults(data, stats);
      return;
    }

    const results = data.filter(item => {
      // Text search across specified fields
      const textMatch = term.trim() === '' || searchFields.some(field => {
        const fieldValue = getNestedValue(item, field);
        if (typeof fieldValue === 'string') {
          return fieldValue.toLowerCase().includes(term.toLowerCase());
        }
        return false;
      });

      // Apply filters
      const filterMatch = Object.entries(filters).every(([key, value]) => {
        if (!value || value === 'all') return true;
        
        const itemValue = getNestedValue(item, key);
        if (Array.isArray(value)) {
          return value.includes(itemValue);
        }
        return itemValue === value;
      });

      return textMatch && filterMatch;
    });

    // Sort results
    const sortedResults = sortResults(results, sortBy, sortOrder, term);
    
    const stats = { total: data.length, found: sortedResults.length };
    setSearchStats(stats);
    onResults(sortedResults, stats);
  };

  // Helper function to get nested object values
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  // Sorting function with relevance scoring
  const sortResults = (results, sortType, order, searchTerm) => {
    const sorted = [...results].sort((a, b) => {
      let comparison = 0;

      switch (sortType) {
        case 'relevance':
          // Calculate relevance score based on search term
          const scoreA = calculateRelevanceScore(a, searchTerm);
          const scoreB = calculateRelevanceScore(b, searchTerm);
          comparison = scoreB - scoreA;
          break;
        
        case 'date':
          const dateA = new Date(a.date || a.created_at || 0);
          const dateB = new Date(b.date || b.created_at || 0);
          comparison = dateB - dateA;
          break;
        
        case 'title':
          comparison = (a.title || '').localeCompare(b.title || '');
          break;
        
        case 'house':
          comparison = (a.house || '').localeCompare(b.house || '');
          break;
        
        default:
          comparison = 0;
      }

      return order === 'desc' ? comparison : -comparison;
    });

    return sorted;
  };

  // Calculate relevance score for search results
  const calculateRelevanceScore = (item, term) => {
    if (!term.trim()) return 0;
    
    let score = 0;
    const termLower = term.toLowerCase();

    searchFields.forEach(field => {
      const fieldValue = getNestedValue(item, field);
      if (typeof fieldValue === 'string') {
        const value = fieldValue.toLowerCase();
        
        // Exact match in title gets highest score
        if (field === 'title' && value === termLower) score += 100;
        // Title contains term gets high score
        else if (field === 'title' && value.includes(termLower)) score += 50;
        // Content contains term gets medium score
        else if (value.includes(termLower)) score += 10;
        
        // Bonus for term at beginning of field
        if (value.startsWith(termLower)) score += 20;
        
        // Count occurrences
        const occurrences = (value.match(new RegExp(termLower, 'g')) || []).length;
        score += occurrences * 5;
      }
    });

    return score;
  };

  // Handle search input changes
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    performSearch(term);
  };

  // Handle filter changes
  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...activeFilters, [filterKey]: value };
    setActiveFilters(newFilters);
    performSearch(searchTerm, newFilters);
  };

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      saveSearchHistory(searchTerm.trim());
      setShowHistory(false);
    }
    performSearch(searchTerm);
  };

  // Handle history item click
  const handleHistoryClick = (term) => {
    setSearchTerm(term);
    setShowHistory(false);
    performSearch(term);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    setActiveFilters({});
    setSearchStats({ total: data.length, found: data.length });
    onResults(data, { total: data.length, found: data.length });
  };

  // Clear search history
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('magical_search_history');
  };

  // Handle clicks outside to close history
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (historyRef.current && !historyRef.current.contains(event.target)) {
        setShowHistory(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`magical-search ${currentHouse}-theme ${className}`}>
      <form onSubmit={handleSearchSubmit} className="search-form">
        <div className="search-input-container">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setShowHistory(searchHistory.length > 0)}
              placeholder={placeholder}
              className="search-input magical-input"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                className="clear-search-btn"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Search History Dropdown */}
          {showHistory && searchHistory.length > 0 && (
            <motion.div
              ref={historyRef}
              className="search-history"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="history-header">
                <span>Recent Searches</span>
                <button onClick={clearHistory} className="clear-history-btn">
                  Clear All
                </button>
              </div>
              {searchHistory.map((term, index) => (
                <button
                  key={index}
                  onClick={() => handleHistoryClick(term)}
                  className="history-item"
                >
                  <span className="history-icon">🕒</span>
                  {term}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        <div className="search-actions">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`advanced-search-btn magical-button ${showAdvanced ? 'active' : ''}`}
          >
            🔧 Advanced
          </button>
          
          <button type="submit" className="search-btn magical-button">
            Search
          </button>
        </div>
      </form>

      {/* Search Stats */}
      <div className="search-stats">
        <span className="search-results-count">
          {searchStats.found} of {searchStats.total} entries
          {searchTerm && ` found for "${searchTerm}"`}
        </span>
        
        {enableSorting && (
          <div className="sort-controls">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select magical-input"
            >
              <option value="relevance">Relevance</option>
              <option value="date">Date</option>
              <option value="title">Title</option>
              <option value="house">House</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="sort-order-btn magical-button"
              title={`Sort ${sortOrder === 'desc' ? 'Ascending' : 'Descending'}`}
            >
              {sortOrder === 'desc' ? '↓' : '↑'}
            </button>
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            className="advanced-filters"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h4>🔮 Advanced Filters</h4>
            
            <div className="filter-grid">
              {filters.house && (
                <div className="filter-group">
                  <label>House</label>
                  <select
                    value={activeFilters.house || 'all'}
                    onChange={(e) => handleFilterChange('house', e.target.value)}
                    className="filter-select magical-input"
                  >
                    <option value="all">All Houses</option>
                    <option value="gryffindor">🔥 Ember</option>
                    <option value="hufflepuff">⭐ Starlight</option>
                    <option value="ravenclaw">🌙 Moonlight</option>
                    <option value="slytherin">🌿 Nature</option>
                    <option value="ember">🔥 Ember</option>
                    <option value="starlight">⭐ Starlight</option>
                    <option value="moonlight">🌙 Moonlight</option>
                    <option value="nature">🌿 Nature</option>
                  </select>
                </div>
              )}

              {filters.mood && (
                <div className="filter-group">
                  <label>Mood</label>
                  <select
                    value={activeFilters.mood || 'all'}
                    onChange={(e) => handleFilterChange('mood', e.target.value)}
                    className="filter-select magical-input"
                  >
                    <option value="all">All Moods</option>
                    {MOOD_OPTIONS.map(mood => (
                      <option key={mood.id} value={mood.id}>
                        {mood.emoji} {mood.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {filters.weather && (
                <div className="filter-group">
                  <label>Weather</label>
                  <select
                    value={activeFilters.weather || 'all'}
                    onChange={(e) => handleFilterChange('weather', e.target.value)}
                    className="filter-select magical-input"
                  >
                    <option value="all">All Weather</option>
                    {WEATHER_OPTIONS.map(weather => (
                      <option key={weather.id} value={weather.id}>
                        {weather.emoji} {weather.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {filters.bookmarked && (
                <div className="filter-group">
                  <label>Bookmarked</label>
                  <select
                    value={activeFilters.bookmarked || 'all'}
                    onChange={(e) => handleFilterChange('bookmarked', e.target.value)}
                    className="filter-select magical-input"
                  >
                    <option value="all">All Entries</option>
                    <option value="1">🔖 Bookmarked Only</option>
                    <option value="0">📄 Not Bookmarked</option>
                  </select>
                </div>
              )}

              {filters.dateRange && (
                <div className="filter-group">
                  <label>Date Range</label>
                  <select
                    value={activeFilters.dateRange || 'all'}
                    onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                    className="filter-select magical-input"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </select>
                </div>
              )}
            </div>

            <div className="filter-actions">
              <button
                onClick={clearSearch}
                className="clear-filters-btn magical-button"
              >
                Clear All Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MagicalSearch; 