import React from 'react';
import './Gallery.css';

const Gallery = () => {
  return (
    <div className="gallery">
      <div className="gallery-header">
        <h1 className="magical-title">🖼️ Magical Gallery</h1>
        <p className="gallery-subtitle">
          Browse through your magical memories, images, and artwork
        </p>
      </div>
      
      <div className="gallery-container magical-card">
        <div className="coming-soon">
          <div className="coming-soon-icon">🎭</div>
          <h3>Gallery Coming Soon!</h3>
          <p>
            Your magical gallery will showcase:
          </p>
          <ul>
            <li>📸 All your uploaded images</li>
            <li>🎨 Saved drawings and artwork</li>
            <li>🔖 Bookmarked diary entries</li>
            <li>✨ Sticker collections</li>
            <li>🏰 House-themed filters</li>
            <li>📤 Easy sharing options</li>
          </ul>
          <p>
            Soon you'll be able to relive all your magical moments in one beautiful place!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Gallery; 