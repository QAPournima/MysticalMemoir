import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import './MusicPlayer.css';

const MUSIC_TRACKS = [
  {
    id: 'magic-tree',
    name: 'The Magic Tree',
    file: 'the-magic-tree.mp3',
    mood: 'peaceful',
    icon: '🌳',
    description: 'Peaceful magical forest sounds'
  },
  {
    id: 'magic-air',
    name: 'Magic in the Air',
    file: 'magic-in-the-air.mp3',
    mood: 'mystical',
    icon: '✨',
    description: 'Mystical ambient magic'
  },
  {
    id: 'magic-healing',
    name: 'Magic Healing Cosmic Sleep',
    file: 'magic-healing-cosmic-sleep.mp3',
    mood: 'calming',
    icon: '🌙',
    description: 'Cosmic healing and mystical sleep'
  },
  {
    id: 'magic-christmas',
    name: 'Magic Christmas',
    file: 'magic-christmas_medium.mp3',
    mood: 'festive',
    icon: '🎄',
    description: 'Magical Christmas atmosphere'
  },
  {
    id: 'magic-jingle-bells',
    name: 'Magic Jingle Bell Christmas',
    file: 'magic-jingle-bell-christmas-magic.mp3',
    mood: 'cheerful',
    icon: '🔔',
    description: 'Cheerful magical Christmas bells'
  },
  {
    id: 'magic-xmas-jingle',
    name: 'Magic Xmas Jingle',
    file: 'magic-xmas-jingle.mp3',
    mood: 'festive',
    icon: '🎅',
    description: 'Festive Christmas magic'
  },
  {
    id: 'magic',
    name: 'Pure Magic',
    file: 'magic.mp3',
    mood: 'magical',
    icon: '🪄',
    description: 'Pure magical essence'
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
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [isRepeatOn, setIsRepeatOn] = useState(false);
  const [playlist, setPlaylist] = useState([...MUSIC_TRACKS]);
  const [isPlaylistMode, setIsPlaylistMode] = useState(false);
  
  const backgroundAudioRef = useRef(null);
  const previewAudioRef = useRef(null);

  useEffect(() => {
    // Load saved preferences
    const savedTrack = localStorage.getItem('background_music');
    const savedVolume = localStorage.getItem('music_volume');
    const savedMuted = localStorage.getItem('music_muted');
    const savedShuffle = localStorage.getItem('music_shuffle');
    const savedRepeat = localStorage.getItem('music_repeat');
    const savedPlaylistMode = localStorage.getItem('music_playlist_mode');
    
    if (savedTrack) {
      const track = MUSIC_TRACKS.find(t => t.id === savedTrack);
      if (track) {
        setBackgroundTrack(track);
        setCurrentTrack(track);
        setCurrentTrackIndex(MUSIC_TRACKS.findIndex(t => t.id === savedTrack));
      }
    }
    
    if (savedVolume) {
      setVolume(parseFloat(savedVolume));
    }
    
    if (savedMuted) {
      setIsMuted(savedMuted === 'true');
    }
    
    if (savedShuffle) {
      setIsShuffleOn(savedShuffle === 'true');
    }
    
    if (savedRepeat) {
      setIsRepeatOn(savedRepeat === 'true');
    }
    
    if (savedPlaylistMode) {
      setIsPlaylistMode(savedPlaylistMode === 'true');
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
      
      // Handle playlist progression when track ends
      audio.addEventListener('ended', () => {
        if (isPlaylistMode) {
          if (isRepeatOn) {
            // Replay current track
            audio.currentTime = 0;
            audio.play();
          } else {
            // Play next track in playlist
            playNextTrack();
          }
        } else {
          // Single track mode - loop if repeat is on
          if (isRepeatOn) {
            audio.currentTime = 0;
            audio.play();
          } else {
            setIsPlaying(false);
          }
        }
      });
      
      // Set loop only if not in playlist mode and repeat is on
      audio.loop = !isPlaylistMode && isRepeatOn;
      
      backgroundAudioRef.current = audio;
      
      await audio.play();
      setIsPlaying(true);
      console.log('🎵 Background music playing:', track.name);
      
    } catch (error) {
      console.log('🎵 Autoplay prevented for background music. User interaction needed.');
      console.log('🎵 Track ready:', track.name);
      setCurrentTrack(track);
      setBackgroundTrack(track);
      
      // Show a subtle notification that music is ready but needs user interaction
      if (window.dispatchEvent) {
        const event = new CustomEvent('magicalNotification', {
          detail: {
            title: '🎵 Music Ready',
            body: `${track.name} is ready to play. Click anywhere to start the music!`,
            duration: 4000
          }
        });
        window.dispatchEvent(event);
      }
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

  // Playlist Functions
  const shufflePlaylist = () => {
    const shuffled = [...playlist];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setPlaylist(shuffled);
    setCurrentTrackIndex(0);
  };

  const resetPlaylist = () => {
    setPlaylist([...MUSIC_TRACKS]);
    const currentTrackInOriginal = MUSIC_TRACKS.findIndex(track => track.id === currentTrack?.id);
    setCurrentTrackIndex(currentTrackInOriginal >= 0 ? currentTrackInOriginal : 0);
  };

  const playNextTrack = () => {
    if (!isPlaylistMode) return;
    
    let nextIndex;
    if (isShuffleOn) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else {
      nextIndex = (currentTrackIndex + 1) % playlist.length;
    }
    
    setCurrentTrackIndex(nextIndex);
    playBackgroundMusic(playlist[nextIndex]);
  };

  const playPreviousTrack = () => {
    if (!isPlaylistMode) return;
    
    let prevIndex;
    if (isShuffleOn) {
      prevIndex = Math.floor(Math.random() * playlist.length);
    } else {
      prevIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : playlist.length - 1;
    }
    
    setCurrentTrackIndex(prevIndex);
    playBackgroundMusic(playlist[prevIndex]);
  };

  const toggleShuffle = () => {
    const newShuffle = !isShuffleOn;
    setIsShuffleOn(newShuffle);
    
    if (newShuffle) {
      shufflePlaylist();
    } else {
      resetPlaylist();
    }
    
    localStorage.setItem('music_shuffle', newShuffle.toString());
  };

  const toggleRepeat = () => {
    const newRepeat = !isRepeatOn;
    setIsRepeatOn(newRepeat);
    localStorage.setItem('music_repeat', newRepeat.toString());
  };

  const togglePlaylistMode = () => {
    const newPlaylistMode = !isPlaylistMode;
    setIsPlaylistMode(newPlaylistMode);
    localStorage.setItem('music_playlist_mode', newPlaylistMode.toString());
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
            {/* Playlist Mode Toggle */}
            <button
              className={`control-btn playlist ${isPlaylistMode ? 'active' : ''}`}
              onClick={togglePlaylistMode}
              title={isPlaylistMode ? 'Disable Playlist Mode' : 'Enable Playlist Mode'}
            >
              📋
            </button>
            
            {/* Previous Track */}
            {isPlaylistMode && (
              <button
                className="control-btn previous"
                onClick={playPreviousTrack}
                title="Previous Track"
              >
                ⏮️
              </button>
            )}
            
            <button
              className={`control-btn ${isPlaying ? 'pause' : 'play'}`}
              onClick={isPlaying ? pauseBackgroundMusic : resumeBackgroundMusic}
              title={isPlaying ? 'Pause Music' : 'Play Music'}
            >
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            
            {/* Next Track */}
            {isPlaylistMode && (
              <button
                className="control-btn next"
                onClick={playNextTrack}
                title="Next Track"
              >
                ⏭️
              </button>
            )}
            
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
            
            {/* Shuffle */}
            {isPlaylistMode && (
              <button
                className={`control-btn shuffle ${isShuffleOn ? 'active' : ''}`}
                onClick={toggleShuffle}
                title={isShuffleOn ? 'Disable Shuffle' : 'Enable Shuffle'}
              >
                🔀
              </button>
            )}
            
            {/* Repeat */}
            <button
              className={`control-btn repeat ${isRepeatOn ? 'active' : ''}`}
              onClick={toggleRepeat}
              title={isRepeatOn ? 'Disable Repeat' : 'Enable Repeat'}
            >
              🔁
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
            
            {/* Playlist Display */}
            {isPlaylistMode && (
              <div className="playlist-section">
                <div className="playlist-header">
                  <h4>📋 Current Playlist</h4>
                  <div className="playlist-info">
                    <span>{playlist.length} tracks</span>
                    {isShuffleOn && <span>🔀 Shuffled</span>}
                    {isRepeatOn && <span>🔁 Repeat</span>}
                  </div>
                </div>
                <div className="playlist-tracks">
                  {playlist.map((track, index) => (
                    <div
                      key={`${track.id}-${index}`}
                      className={`playlist-track ${index === currentTrackIndex ? 'current' : ''}`}
                    >
                      <span className="track-number">{index + 1}</span>
                      <span className="track-icon">{track.icon}</span>
                      <span className="track-name">{track.name}</span>
                      {index === currentTrackIndex && (
                        <span className="current-indicator">🎵</span>
                      )}
                    </div>
                  ))}
                </div>
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