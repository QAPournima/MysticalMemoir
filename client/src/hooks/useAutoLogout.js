import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const useAutoLogout = (logoutCallback, inactivityTimeout = 60 * 60 * 1000) => {
  const { sendMagicalNotification } = useTheme();
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const timeoutRef = useRef(null);
  const warningTimeoutRef = useRef(null);
  const countdownRef = useRef(null);

  const EVENTS = [
    'mousedown',
    'mousemove', 
    'keypress',
    'scroll',
    'touchstart',
    'click'
  ];

  const resetTimer = () => {
    // Clear existing timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    
    setShowWarning(false);
    setTimeLeft(0);

    // Set warning timer (5 minutes before logout)
    warningTimeoutRef.current = setTimeout(() => {
      setShowWarning(true);
      setTimeLeft(5 * 60); // 5 minutes in seconds
      
      // Send notification
      sendMagicalNotification('Inactivity Warning', {
        body: 'You will be logged out in 5 minutes due to inactivity. Move your wand to stay active! 🪄',
        tag: 'inactivity-warning'
      });

      // Start countdown
      countdownRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(countdownRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    }, inactivityTimeout - 5 * 60 * 1000); // 55 minutes

    // Set logout timer (full timeout)
    timeoutRef.current = setTimeout(() => {
      sendMagicalNotification('Auto Logout', {
        body: 'You have been automatically logged out due to inactivity. Your magical session has ended. 🔒',
        tag: 'auto-logout'
      });
      logoutCallback();
    }, inactivityTimeout);
  };

  const handleActivity = () => {
    resetTimer();
  };

  const extendSession = () => {
    resetTimer();
    sendMagicalNotification('Session Extended', {
      body: 'Your magical session has been extended! Continue your journey. ✨',
      tag: 'session-extended'
    });
  };

  useEffect(() => {
    // Add event listeners
    EVENTS.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Initialize timer
    resetTimer();

    // Cleanup
    return () => {
      EVENTS.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return {
    showWarning,
    timeLeft,
    extendSession,
    formatTime: () => formatTime(timeLeft)
  };
};

export default useAutoLogout; 