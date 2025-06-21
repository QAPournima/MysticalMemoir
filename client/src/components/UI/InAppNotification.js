import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './InAppNotification.css';

const InAppNotification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    console.log('📱 InAppNotification component mounted');
    
    // Listen for custom notification events
    const handleCustomNotification = (event) => {
      console.log('📱 InAppNotification received event:', event.detail);
      const { title, body, duration = 4000 } = event.detail;
      const id = Date.now() + Math.random();
      
      const notification = {
        id,
        title,
        body,
        timestamp: new Date()
      };

      console.log('📱 Adding notification to state:', notification);
      setNotifications(prev => [...prev, notification]);

      // Auto-remove after duration
      setTimeout(() => {
        console.log('📱 Auto-removing notification:', id);
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, duration);
    };

    window.addEventListener('magicalNotification', handleCustomNotification);
    console.log('📱 Event listener added for magicalNotification');

    return () => {
      window.removeEventListener('magicalNotification', handleCustomNotification);
      console.log('📱 Event listener removed');
    };
  }, []);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="in-app-notifications">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            className="magical-notification"
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="notification-content">
              <div className="notification-icon">🦉</div>
              <div className="notification-text">
                <h4 className="notification-title">{notification.title}</h4>
                <p className="notification-body">{notification.body}</p>
              </div>
              <button 
                className="notification-close"
                onClick={() => removeNotification(notification.id)}
              >
                ✕
              </button>
            </div>
            <div className="notification-progress"></div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default InAppNotification; 