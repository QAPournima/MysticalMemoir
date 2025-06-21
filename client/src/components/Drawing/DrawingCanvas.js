import React from 'react';
import './DrawingCanvas.css';

const DrawingCanvas = () => {
  return (
    <div className="drawing-canvas">
      <div className="drawing-header">
        <h1 className="magical-title">🎨 Magical Drawing Canvas</h1>
        <p className="drawing-subtitle">
          Create magical artwork and illustrations for your diary
        </p>
      </div>
      
      <div className="canvas-container magical-card">
        <div className="coming-soon">
          <div className="coming-soon-icon">🪄</div>
          <h3>Drawing Canvas Coming Soon!</h3>
          <p>
            We're working on a magical drawing canvas where you can:
          </p>
          <ul>
            <li>🎨 Draw with magical brushes</li>
            <li>🌈 Use house-themed colors</li>
            <li>✨ Add magical effects</li>
            <li>📝 Integrate with diary entries</li>
            <li>💾 Save your artwork</li>
          </ul>
          <p>
            Check back soon for this enchanting feature!
          </p>
        </div>
      </div>
    </div>
  );
};

export default DrawingCanvas; 