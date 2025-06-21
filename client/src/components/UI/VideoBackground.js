import React, { useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import './VideoBackground.css';

const VideoBackground = () => {
  const videoRef = useRef(null);
  const { currentVideoBackground } = useTheme();

  useEffect(() => {
    console.log('🎬 VideoBackground - currentVideoBackground:', currentVideoBackground);
    if (videoRef.current && currentVideoBackground) {
      console.log('🎬 VideoBackground - Setting up video:', currentVideoBackground);
      // Reset video to start when changing videos
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(error => {
        console.log('🎬 Video autoplay prevented:', error);
        // Fallback: try to enable muted autoplay
        videoRef.current.muted = true;
        videoRef.current.play().catch(err => {
          console.error('🎬 Video play failed completely:', err);
        });
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
        onLoadStart={() => console.log('🎬 Video load started')}
        onLoadedData={() => console.log('🎬 Video data loaded')}
        onCanPlay={() => console.log('🎬 Video can play')}
        onPlay={() => console.log('🎬 Video started playing')}
        onError={(e) => console.error('🎬 Video error:', e)}
      >
        <source src={currentVideoBackground} type="video/mp4" />
        <p>Your browser does not support video backgrounds.</p>
      </video>
      <div className="video-overlay" />
    </div>
  );
};

export default VideoBackground; 