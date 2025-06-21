import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import './MagicalTimestamp.css';

const MagicalTimestamp = ({ 
  createdAt,
  updatedAt,
  showCalendar = false,
  showRelative = true,
  showFull = false,
  size = 'medium',
  className = '',
  onDateSelect = null
}) => {
  const { currentHouse, getHouseInfo } = useTheme();
  const [showCalendarView, setShowCalendarView] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  
  const houseInfo = getHouseInfo(currentHouse);

  // Format date in various ways
  const formatDate = (date, format = 'relative') => {
    if (!date) return 'Unknown';
    
    const dateObj = new Date(date);
    const now = new Date();
    const diffInSeconds = Math.floor((now - dateObj) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    switch (format) {
      case 'relative':
        if (diffInSeconds < 60) return 'just now';
        if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
        if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
        if (diffInDays < 7) return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} week${Math.floor(diffInDays / 7) !== 1 ? 's' : ''} ago`;
        if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} month${Math.floor(diffInDays / 30) !== 1 ? 's' : ''} ago`;
        return `${Math.floor(diffInDays / 365)} year${Math.floor(diffInDays / 365) !== 1 ? 's' : ''} ago`;
      
      case 'short':
        return dateObj.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: dateObj.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
      
      case 'full':
        return dateObj.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      
      case 'time':
        return dateObj.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        });
      
      default:
        return dateObj.toLocaleDateString();
    }
  };

  // Get magical time indicators
  const getMagicalTimeIndicator = (date) => {
    if (!date) return '🕐';
    
    const dateObj = new Date(date);
    const hour = dateObj.getHours();
    
    if (hour >= 22 || hour < 6) return '🌙'; // Night/Evening
    if (hour >= 6 && hour < 12) return '🌅'; // Morning
    if (hour >= 12 && hour < 17) return '☀️'; // Afternoon
    if (hour >= 17 && hour < 22) return '🌆'; // Evening
    
    return '🕐';
  };

  // Generate calendar for a given month
  const generateCalendar = (date) => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const startOfWeek = new Date(startOfMonth);
    startOfWeek.setDate(startOfMonth.getDate() - startOfMonth.getDay());
    
    const days = [];
    const current = new Date(startOfWeek);
    
    while (current <= endOfMonth || current.getDay() !== 0) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
      
      if (days.length >= 42) break; // Maximum 6 weeks
    }
    
    return days;
  };

  // Handle calendar navigation
  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  // Check if date has entries (this would be customized based on your data)
  const hasEntries = (date) => {
    // This is a placeholder - you'd implement actual logic to check if there are entries on this date
    return Math.random() > 0.8; // Random for demo purposes
  };

  const calendarDays = showCalendarView ? generateCalendar(currentDate) : [];

  return (
    <div className={`magical-timestamp ${currentHouse}-theme ${size} ${className}`}>
      <div className="timestamp-content">
        {/* Main timestamp display */}
        <div className="timestamp-main">
          <div className="created-info">
            <span className="time-icon">{getMagicalTimeIndicator(createdAt)}</span>
            <div className="time-details">
              <span className="time-label">Created</span>
              <span className="time-value">
                {showRelative ? formatDate(createdAt, 'relative') : formatDate(createdAt, 'short')}
              </span>
              {showFull && (
                <span className="time-full">{formatDate(createdAt, 'full')}</span>
              )}
            </div>
          </div>

          {updatedAt && updatedAt !== createdAt && (
            <div className="updated-info">
              <span className="time-icon">✏️</span>
              <div className="time-details">
                <span className="time-label">Updated</span>
                <span className="time-value">
                  {showRelative ? formatDate(updatedAt, 'relative') : formatDate(updatedAt, 'short')}
                </span>
                {showFull && (
                  <span className="time-full">{formatDate(updatedAt, 'full')}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Calendar toggle */}
        {showCalendar && (
          <button
            onClick={() => setShowCalendarView(!showCalendarView)}
            className="calendar-toggle magical-button"
            title="Toggle Calendar View"
          >
            📅 {showCalendarView ? 'Hide' : 'Show'} Calendar
          </button>
        )}
      </div>

      {/* Calendar View */}
      <AnimatePresence>
        {showCalendarView && (
          <motion.div
            className="calendar-view"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="calendar-header">
              <button
                onClick={() => navigateMonth(-1)}
                className="nav-btn magical-button"
              >
                ◀
              </button>
              
              <h3 className="calendar-title">
                {currentDate.toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </h3>
              
              <button
                onClick={() => navigateMonth(1)}
                className="nav-btn magical-button"
              >
                ▶
              </button>
            </div>

            <div className="calendar-grid">
              <div className="weekday-header">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="weekday">
                    {day}
                  </div>
                ))}
              </div>

              <div className="days-grid">
                {calendarDays.map((day, index) => {
                  const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                  const isToday = day.toDateString() === new Date().toDateString();
                  const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();
                  const hasData = hasEntries(day);
                  const isCreatedDate = createdAt && day.toDateString() === new Date(createdAt).toDateString();
                  const isUpdatedDate = updatedAt && day.toDateString() === new Date(updatedAt).toDateString();

                  return (
                    <motion.button
                      key={index}
                      onClick={() => handleDateSelect(day)}
                      className={`
                        calendar-day 
                        ${isCurrentMonth ? 'current-month' : 'other-month'}
                        ${isToday ? 'today' : ''}
                        ${isSelected ? 'selected' : ''}
                        ${hasData ? 'has-entries' : ''}
                        ${isCreatedDate ? 'created-date' : ''}
                        ${isUpdatedDate ? 'updated-date' : ''}
                      `}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="day-number">{day.getDate()}</span>
                      {hasData && <span className="entry-indicator">•</span>}
                      {isCreatedDate && <span className="created-indicator">📝</span>}
                      {isUpdatedDate && !isCreatedDate && <span className="updated-indicator">✏️</span>}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="calendar-legend">
              <div className="legend-item">
                <span className="legend-dot today"></span>
                <span>Today</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot has-entries"></span>
                <span>Has Entries</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot created-date"></span>
                <span>Created</span>
              </div>
              {updatedAt && updatedAt !== createdAt && (
                <div className="legend-item">
                  <span className="legend-dot updated-date"></span>
                  <span>Updated</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Export a simpler version for inline use
export const SimpleTimestamp = ({ date, showIcon = true, format = 'relative' }) => {
  const formatDate = (date, format) => {
    if (!date) return 'Unknown';
    
    const dateObj = new Date(date);
    const now = new Date();
    const diffInSeconds = Math.floor((now - dateObj) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    switch (format) {
      case 'relative':
        if (diffInSeconds < 60) return 'just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInDays < 7) return `${diffInDays}d ago`;
        return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      case 'short':
        return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      default:
        return dateObj.toLocaleDateString();
    }
  };

  const getMagicalTimeIndicator = (date) => {
    if (!date) return '🕐';
    
    const dateObj = new Date(date);
    const hour = dateObj.getHours();
    
    if (hour >= 22 || hour < 6) return '🌙';
    if (hour >= 6 && hour < 12) return '🌅';
    if (hour >= 12 && hour < 17) return '☀️';
    if (hour >= 17 && hour < 22) return '🌆';
    
    return '🕐';
  };

  return (
    <span className="simple-timestamp">
      {showIcon && <span className="simple-time-icon">{getMagicalTimeIndicator(date)}</span>}
      <span className="simple-time-text">{formatDate(date, format)}</span>
    </span>
  );
};

export default MagicalTimestamp; 