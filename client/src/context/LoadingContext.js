import React, { createContext, useContext, useState, useEffect } from 'react';

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Turning back time...");

  const showLoading = (message = "Turning back time...", duration = 2000) => {
    // Prevent multiple simultaneous loading states
    if (isLoading) return;
    
    setLoadingMessage(message);
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, duration);

    return timer;
  };

  // Show loading on initial app load and page refresh
  useEffect(() => {
    const refreshMessages = [
      "Turning back time...",
      "Rewinding the magical clock...",
      "Time-Turner spinning backwards...",
      "Restoring magical moments...",
      "Reversing temporal flow...",
      "Summoning past memories...",
      "Weaving time magic..."
    ];

    const randomMessage = refreshMessages[Math.floor(Math.random() * refreshMessages.length)];
    setLoadingMessage(randomMessage);

    // Single initial load timer
    const initialTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2200); // Slightly reduced time

    return () => clearTimeout(initialTimer);
  }, []); // Empty dependency array to run only once

  // Show loading animation when page visibility changes (tab switching)
  useEffect(() => {
    let visibilityTimer;
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !isLoading) {
        // Add a small delay to avoid conflicts with initial load
        visibilityTimer = setTimeout(() => {
          showLoading("Returning from the shadows...", 800);
        }, 500);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (visibilityTimer) clearTimeout(visibilityTimer);
    };
  }, [showLoading, isLoading]);

  const hideLoading = () => {
    setIsLoading(false);
  };

  const value = {
    isLoading,
    loadingMessage,
    showLoading,
    hideLoading
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}; 