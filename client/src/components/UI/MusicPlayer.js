import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import './MusicPlayer.css';

const MUSIC_TRACKS = [
  {
    id: 'dark-secrets',
    name: 'Dark Secrets at the Black Castle',
    file: 'dark-secrets-at-the-black-castle-163584.mp3',
    mood: 'mysterious',
    icon: '🏰',
    description: 'Mysterious and enchanting castle ambience'
  },
  {
    id: 'ways-wizard',
    name: 'Ways of the Wizard',
    file: 'ways-of-the-wizard-197105.mp3',
    mood: 'magical',
    icon: '🧙‍♂️',
    description: 'Mystical wizard melodies and spells'
  },
  {
    id: 'magic-tree',
    name: 'The Magic Tree',
    file: 'the-magic-tree-150606.mp3',
    mood: 'peaceful',
    icon: '🌳',
    description: 'Peaceful magical forest sounds'
  },
  {
    id: 'hogwarts-express',
    name: 'Hogwarts Express',
    file: 'hogwarts-express-inspired-by-harry-potter-305578.mp3',
    mood: 'adventurous',
    icon: '🚂',
    description: 'Epic journey to Hogwarts adventure'
  },
  {
    id: 'school-magic',
    name: 'School of Magic',
    file: 'school-of-magic-inspired-by-harry-potter-289617.mp3',
    mood: 'academic',
    icon: '📚',
    description: 'Scholarly magical atmosphere'
  }
];

const MusicPlayer = () => {
  const { currentHouse, getHouseInfo } = useTheme();
  const houseInfo = getHouseInfo(currentHouse);
  
  const [isOpen, setIsOpen] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [backgroundTrack, setBackgroundTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [previewTrack, setPreviewTrack] = useState(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  
  const backgroundAudioRef = useRef(null);
  const previewAudioRef = useRef(null);

  useEffect(() => {
    // Load saved preferences
    const savedTrack = localStorage.getItem('background_music');
    const savedVolume = localStorage.getItem('music_volume');
    const savedMuted = localStorage.getItem('music_muted');
    
    if (savedTrack) {
      const track = MUSIC_TRACKS.find(t => t.id === savedTrack);
      if (track) {
        setBackgroundTrack(track);
        setCurrentTrack(track);
      }
    }
    
    if (savedVolume) {
      setVolume(parseFloat(savedVolume));
    }
    
    if (savedMuted) {
      setIsMuted(savedMuted === 'true');
    }
  }, []);

  useEffect(() => {
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.volume = isMuted ? 0 : volume;
      backgroundAudioRef.current.loop = true;
    }
  }, [volume, isMuted]);

  const playBackgroundMusic = async (track) => {
    try {
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
      }
      
      setCurrentTrack(track);
      setBackgroundTrack(track);
      localStorage.setItem('background_music', track.id);
      
      // Create new audio element
      const audio = new Audio(`/HP background sound/${track.file}`);
      audio.volume = isMuted ? 0 : volume;
      audio.loop = true;
      
      backgroundAudioRef.current = audio;
      
      await audio.play();
      setIsPlaying(true);
      
    } catch (error) {
      console.error('Error playing background music:', error);
    }
  };

  const pauseBackgroundMusic = () => {
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resumeBackgroundMusic = async () => {
    if (backgroundAudioRef.current) {
      try {
        await backgroundAudioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Error resuming music:', error);
      }
    }
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    localStorage.setItem('music_muted', newMuted.toString());
    
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.volume = newMuted ? 0 : volume;
    }
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    localStorage.setItem('music_volume', newVolume.toString());
    
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.volume = isMuted ? 0 : newVolume;
    }
  };

  const previewTrackMusic = async (track) => {
    try {
      // Stop any existing preview
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
      
      if (previewTrack && previewTrack.id === track.id && isPreviewPlaying) {
        // Stop preview if same track
        setIsPreviewPlaying(false);
        setPreviewTrack(null);
        return;
      }
      
      setPreviewTrack(track);
      
      const audio = new Audio(`/HP background sound/${track.file}`);
      audio.volume = 0.5;
      previewAudioRef.current = audio;
      
      audio.addEventListener('ended', () => {
        setIsPreviewPlaying(false);
        setPreviewTrack(null);
      });
      
      await audio.play();
      setIsPreviewPlaying(true);
      
      // Auto stop preview after 15 seconds
      setTimeout(() => {
        if (previewAudioRef.current) {
          previewAudioRef.current.pause();
          setIsPreviewPlaying(false);
          setPreviewTrack(null);
        }
      }, 15000);
      
    } catch (error) {
      console.error('Error previewing track:', error);
    }
  };

  const stopPreview = () => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
    }
    setIsPreviewPlaying(false);
    setPreviewTrack(null);
  };

  return (
    <div className="music-player">
      {/* Main Music Button */}
      <motion.button
        className={`music-player-button ${currentHouse}-theme ${isPlaying ? 'playing' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          background: `linear-gradient(135deg, ${houseInfo.colors.primary}, ${houseInfo.colors.secondary})`,
          borderColor: houseInfo.colors.accent
        }}
      >
        <span className="music-icon">
          {currentTrack ? currentTrack.icon : '🎵'}
        </span>
        {isPlaying && (
          <motion.div
            className="sound-waves"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            ♪♫♪
          </motion.div>
        )}
      </motion.button>

      {/* Current Song Display and Controls */}
      {currentTrack && (
        <motion.div 
          className="current-song-display"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          style={{
            background: `linear-gradient(135deg, ${houseInfo.colors.primary}dd, ${houseInfo.colors.secondary}dd)`,
            borderColor: houseInfo.colors.accent
          }}
        >
          <div className="song-info">
            <div className="song-title">
              <span className="song-icon">{currentTrack.icon}</span>
              <span className="song-name">{currentTrack.name}</span>
            </div>
            <div className="playback-status">
              {isPlaying ? (
                <span className="status-playing">🎵 Now Playing</span>
              ) : (
                <span className="status-paused">⏸️ Paused</span>
              )}
            </div>
          </div>
          
          <div className="music-controls">
            <button
              className={`control-btn ${isPlaying ? 'pause' : 'play'}`}
              onClick={isPlaying ? pauseBackgroundMusic : resumeBackgroundMusic}
              title={isPlaying ? 'Pause Music' : 'Play Music'}
            >
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            
            <button
              className="control-btn stop"
              onClick={() => {
                pauseBackgroundMusic();
                setCurrentTrack(null);
                setBackgroundTrack(null);
                localStorage.removeItem('background_music');
              }}
              title="Stop Music"
            >
              ⏹️
            </button>
            
            <button
              className={`control-btn mute ${isMuted ? 'muted' : ''}`}
              onClick={toggleMute}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
            
            <div className="volume-control">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="volume-slider"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Music Selection Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="music-dropdown"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            style={{
              background: `linear-gradient(135deg, ${houseInfo.colors.primary}ee, ${houseInfo.colors.secondary}ee)`,
              borderColor: houseInfo.colors.accent
            }}
          >
            <div className="dropdown-header">
              <h3>🎼 Magical Soundtracks</h3>
              <p>Choose your mystical ambience</p>
            </div>
            
            <div className="track-list">
              {MUSIC_TRACKS.map((track) => (
                <motion.div
                  key={track.id}
                  className={`track-item ${currentTrack?.id === track.id ? 'active' : ''}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="track-info">
                    <span className="track-icon">{track.icon}</span>
                    <div className="track-details">
                      <h4>{track.name}</h4>
                      <p>{track.description}</p>
                    </div>
                  </div>
                  
                  <div className="track-actions">
                    <button
                      className="preview-btn"
                      onClick={() => previewTrackMusic(track)}
                      title="Preview Track"
                    >
                      {previewTrack?.id === track.id && isPreviewPlaying ? '⏹️' : '🔍'}
                    </button>
                    
                    <button
                      className="select-btn"
                      onClick={() => {
                        playBackgroundMusic(track);
                        setIsOpen(false);
                      }}
                      title="Set as Background Music"
                    >
                      {currentTrack?.id === track.id ? '✅' : '📖'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {previewTrack && (
              <div className="preview-indicator">
                <span>🎧 Previewing: {previewTrack.name}</span>
                <button onClick={stopPreview} className="stop-preview">⏹️</button>
              </div>
            )}
            
            <button
              className="dropdown-close-x"
              onClick={() => setIsOpen(false)}
              title="Close"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MusicPlayer; 