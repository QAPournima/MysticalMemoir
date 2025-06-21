import React, { useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import './VideoBackground.css';

const VideoBackground = () => {
  const videoRef = useRef(null);
  const { currentVideoBackground } = useTheme();

  useEffect(() => {
    if (videoRef.current && currentVideoBackground) {
      // Reset video to start when changing videos
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(error => {
        console.log('Video autoplay prevented:', error);
        // Fallback: try to enable muted autoplay
        videoRef.current.muted = true;
        videoRef.current.play();
      });
    }
  }, [currentVideoBackground]);

  if (!currentVideoBackground) {
    return null;
  }

  return (
    <div className="video-background-container">
      <video
        ref={videoRef}
        className="background-video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src={currentVideoBackground} type="video/mp4" />
        <p>Your browser does not support video backgrounds.</p>
      </video>
      <div className="video-overlay" />
    </div>
  );
};

export default VideoBackground; 