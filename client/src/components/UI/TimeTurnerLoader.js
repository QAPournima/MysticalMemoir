import React from 'react';
import './TimeTurnerLoader.css';

const TimeTurnerLoader = ({ isVisible = true, message = "Turning back time..." }) => {
  if (!isVisible) return null;

  return (
    <div className="time-turner-overlay">
      <div className="time-turner-container">
        <div className="time-turner">
          <div className="outer-ring">
            <div className="inner-ring">
              <div className="hourglass">
                <div className="hourglass-top"></div>
                <div className="hourglass-middle"></div>
                <div className="hourglass-bottom"></div>
                <div className="sand-particles">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className={`sand-particle particle-${i}`}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="time-turner-chain"></div>
        </div>
        
        <div className="loading-text">
          <h2 className="loading-message">{message}</h2>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div className="magical-sparkles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className={`sparkle sparkle-${i}`}>✨</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeTurnerLoader; 