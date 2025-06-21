import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import './Gallery.css';

const Gallery = () => {
  const [drawings, setDrawings] = useState([]);
  const [filteredDrawings, setFilteredDrawings] = useState([]);
  const [selectedHouse, setSelectedHouse] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedDrawing, setSelectedDrawing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentHouse, sendMagicalNotification } = useTheme();

  // Load drawings from localStorage on component mount
  useEffect(() => {
    const loadDrawings = () => {
      const savedDrawings = JSON.parse(localStorage.getItem('magical_drawings') || '[]');
      setDrawings(savedDrawings);
      setFilteredDrawings(savedDrawings);
    };

    loadDrawings();

    // Listen for storage changes to update gallery when new drawings are added
    const handleStorageChange = () => {
      loadDrawings();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events from drawing canvas
    window.addEventListener('drawingSaved', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('drawingSaved', handleStorageChange);
    };
  }, []);

  // Filter and sort drawings
  useEffect(() => {
    let filtered = [...drawings];

    // Filter by house
    if (selectedHouse !== 'all') {
      filtered = filtered.filter(drawing => 
        drawing.house && drawing.house.toLowerCase() === selectedHouse.toLowerCase()
      );
    }

    // Sort drawings
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredDrawings(filtered);
  }, [drawings, selectedHouse, sortBy]);

  const deleteDrawing = (drawingId) => {
    if (window.confirm('Are you sure you want to delete this artwork? This cannot be undone.')) {
      const updatedDrawings = drawings.filter(drawing => drawing.id !== drawingId);
      setDrawings(updatedDrawings);
      localStorage.setItem('magical_drawings', JSON.stringify(updatedDrawings));
      
      // Dispatch custom event to notify drawing canvas
      window.dispatchEvent(new Event('drawingDeleted'));
      
      sendMagicalNotification('Artwork Deleted!', {
        body: 'The artwork has been removed from your gallery. 🗑️',
        tag: 'gallery-delete'
      });
    }
  };

  const downloadDrawing = (drawing) => {
    const link = document.createElement('a');
    link.download = `${drawing.name}.png`;
    link.href = drawing.dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    sendMagicalNotification('Download Started!', {
      body: `"${drawing.name}" is being downloaded! 📥`,
      tag: 'gallery-download'
    });
  };

  const openModal = (drawing) => {
    setSelectedDrawing(drawing);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedDrawing(null);
    setIsModalOpen(false);
  };

  const exportAllDrawings = () => {
    if (filteredDrawings.length === 0) {
      sendMagicalNotification('No Artwork to Export!', {
        body: 'Create some drawings first to export them. 📦',
        tag: 'export-empty'
      });
      return;
    }

    filteredDrawings.forEach((drawing, index) => {
      setTimeout(() => {
        downloadDrawing(drawing);
      }, index * 200);
    });

    sendMagicalNotification('Bulk Export Started!', {
      body: `Downloading ${filteredDrawings.length} artworks! 📦✨`,
      tag: 'gallery-export-all'
    });
  };

  return (
    <div className="gallery">
      <div className="gallery-header">
        <h1 className="magical-title">🖼️ Magical Gallery</h1>
        <p className="gallery-subtitle">
          Browse through your magical artwork and creative masterpieces
        </p>
        
        <div className="gallery-stats">
          <div className="stat-card">
            <span className="stat-number">{drawings.length}</span>
            <span className="stat-label">Total Artworks</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{new Set(drawings.map(d => d.house).filter(Boolean)).size}</span>
            <span className="stat-label">Houses Represented</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{filteredDrawings.length}</span>
            <span className="stat-label">Showing</span>
          </div>
        </div>
      </div>

      {drawings.length === 0 ? (
        <div className="gallery-container magical-card">
          <div className="empty-gallery">
            <div className="empty-gallery-animation">
              <div className="floating-wand">🪄</div>
              <div className="magical-sparkles">✨</div>
            </div>
            <h3>Your Gallery Awaits!</h3>
            <p>
              Visit the <strong>🎨 Drawing Canvas</strong> to create your first magical artwork.
            </p>
            <p>
              Once you save your drawings, they'll appear here in all their glory!
            </p>
            <div className="gallery-features">
              <div className="feature-item">🎨 Digital artwork</div>
              <div className="feature-item">🏰 House filtering</div>
              <div className="feature-item">📥 Easy downloads</div>
              <div className="feature-item">🔍 Full-screen viewing</div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Gallery Controls */}
          <div className="gallery-controls magical-card">
            <div className="filter-section">
              <label>🏰 Filter by House:</label>
              <select 
                value={selectedHouse} 
                onChange={(e) => setSelectedHouse(e.target.value)}
                className="house-filter"
              >
                <option value="all">All Houses</option>
                <option value="gryffindor">🔥 Ember</option>
                <option value="hufflepuff">⭐ Starlight</option>
                <option value="ravenclaw">🌙 Moonlight</option>
                <option value="slytherin">🌿 Nature</option>
                <option value="ember">🔥 Ember</option>
                <option value="starlight">⭐ Starlight</option>
                <option value="moonlight">🌙 Moonlight</option>
                <option value="nature">🌿 Nature</option>
              </select>
            </div>

            <div className="sort-section">
              <label>📊 Sort by:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-filter"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>

            <div className="gallery-actions">
              <button 
                className="action-btn export-all"
                onClick={exportAllDrawings}
                disabled={filteredDrawings.length === 0}
              >
                📦 Export All ({filteredDrawings.length})
              </button>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="gallery-grid">
            <AnimatePresence>
              {filteredDrawings.map((drawing, index) => (
                <motion.div
                  key={drawing.id}
                  className="artwork-card magical-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  layout
                >
                  <div className="artwork-thumbnail" onClick={() => openModal(drawing)}>
                    <img 
                      src={drawing.dataURL} 
                      alt={drawing.name}
                    />
                    <div className="artwork-overlay">
                      <button className="overlay-btn view">🔍 View</button>
                    </div>
                  </div>
                  
                  <div className="artwork-info">
                    <h3 className="artwork-title" title={drawing.name}>
                      {drawing.name}
                    </h3>
                    
                    <div className="artwork-meta">
                      {drawing.house && (
                        <span className={`house-badge house-${drawing.house.toLowerCase()}`}>
                          {drawing.house}
                        </span>
                      )}
                      <span className="creation-date">
                        {new Date(drawing.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="artwork-actions">
                      <button 
                        className="action-btn download"
                        onClick={() => downloadDrawing(drawing)}
                        title="Download Artwork"
                      >
                        📥
                      </button>
                      <button 
                        className="action-btn delete"
                        onClick={() => deleteDrawing(drawing.id)}
                        title="Delete Artwork"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredDrawings.length === 0 && (
            <div className="no-results magical-card">
              <h3>No artwork found</h3>
              <p>Try adjusting your filters or create new artwork in the Drawing Canvas!</p>
            </div>
          )}
        </>
      )}

      {/* Full-Screen Modal */}
      <AnimatePresence>
        {isModalOpen && selectedDrawing && (
          <motion.div 
            className="artwork-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div 
              className="artwork-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>{selectedDrawing.name}</h3>
                <button className="close-modal" onClick={closeModal}>✕</button>
              </div>
              
              <div className="modal-content">
                <img 
                  src={selectedDrawing.dataURL} 
                  alt={selectedDrawing.name}
                  className="modal-image"
                />
              </div>
              
              <div className="modal-footer">
                <div className="modal-info">
                  {selectedDrawing.house && (
                    <span className={`house-badge house-${selectedDrawing.house.toLowerCase()}`}>
                      {selectedDrawing.house}
                    </span>
                  )}
                  <span className="creation-date">
                    Created: {new Date(selectedDrawing.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="modal-actions">
                  <button 
                    className="modal-btn download"
                    onClick={() => downloadDrawing(selectedDrawing)}
                  >
                    📥 Download
                  </button>
                  <button 
                    className="modal-btn delete"
                    onClick={() => {
                      deleteDrawing(selectedDrawing.id);
                      closeModal();
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery; 