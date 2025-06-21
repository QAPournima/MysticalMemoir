import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './AuthBackgroundMusic.css';

const AuthBackgroundMusic = ({ isPlaying = true }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3); // Soft volume
  const audioRef = useRef(null);

  useEffect(() => {
    // Check if user has a saved mute preference
    const savedMuteState = localStorage.getItem('auth_music_muted');
    if (savedMuteState !== null) {
      setIsMuted(JSON.parse(savedMuteState));
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && !isMuted) {
      audio.volume = volume;
      audio.loop = true;
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Audio autoplay prevented:', error);
        });
      }
    } else {
      audio.pause();
    }

    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, [isPlaying, isMuted, volume]);

  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    localStorage.setItem('auth_music_muted', JSON.stringify(newMuteState));
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/HP background sound/dark-secrets-at-the-black-castle-163584.mp3"
        preload="auto"
      />
      
      <motion.div
        className="auth-music-controls"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <div className="music-control-panel">
          <button
            onClick={toggleMute}
            className={`mute-btn ${isMuted ? 'muted' : 'unmuted'}`}
            title={isMuted ? 'Unmute background music' : 'Mute background music'}
          >
            {isMuted ? '🔇' : '🎵'}
          </button>
          
          {!isMuted && (
            <motion.div
              className="volume-control"
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ duration: 0.3 }}
            >
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
                title="Adjust volume"
              />
            </motion.div>
          )}
        </div>
        
        <div className="music-info">
          <span className="music-label">🎼 Hogwarts Ambience</span>
        </div>
      </motion.div>
    </>
  );
};

export default AuthBackgroundMusic; 