import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message = "Loading magical content..." }) => {
  return (
    <div className="loading-spinner-container">
      <div className="magical-loading">
        <div className="mystical-crest">
          <div className="crest-section gryffindor">🔥</div>
          <div className="crest-section slytherin">🌿</div>
          <div className="crest-section ravenclaw">🌙</div>
          <div className="crest-section hufflepuff">⭐</div>
        </div>
        <div className="spinning-wand">🪄</div>
        <div className="magical-sparkles">
          <span className="sparkle">✨</span>
          <span className="sparkle">⭐</span>
          <span className="sparkle">✨</span>
          <span className="sparkle">⭐</span>
        </div>
      </div>
      <p className="loading-message">{message}</p>
      <div className="loading-bar">
        <div className="loading-progress"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner; 