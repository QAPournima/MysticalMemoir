import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useLoading } from '../../context/LoadingContext';

const PageTransition = ({ children }) => {
  const location = useLocation();
  const { showLoading } = useLoading();
  const prevLocationRef = useRef(location.pathname);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    // Skip on initial load to avoid double animation
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      prevLocationRef.current = location.pathname;
      return;
    }

    // Only show loading if the route actually changed
    if (prevLocationRef.current !== location.pathname) {
      const messages = [
        "Turning back time...",
        "Entering the magical realm...",
        "Casting navigation spells...",
        "Summoning the next page...",
        "Time-Turner spinning...",
        "Weaving magic...",
        "Accessing mystical archives...",
        "Traveling through time..."
      ];
      
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      showLoading(randomMessage, 1200);
      prevLocationRef.current = location.pathname;
    }
  }, [location.pathname, showLoading]);

  return <>{children}</>;
};

export default PageTransition; 