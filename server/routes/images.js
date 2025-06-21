const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const db = require('../database/db');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Upload single image
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  const id = uuidv4();
  const { filename, originalname, size } = req.file;

  const query = `
    INSERT INTO images (id, filename, original_name, size)
    VALUES (?, ?, ?, ?)
  `;

  db.run(query, [id, filename, originalname, size], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    res.json({
      id,
      filename,
      originalName: originalname,
      size,
      url: `/uploads/${filename}`,
      message: 'Image uploaded successfully!'
    });
  });
});

// Upload multiple images
router.post('/upload-multiple', upload.array('images', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No image files provided' });
  }

  const uploads = [];
  let completed = 0;

  req.files.forEach(file => {
    const id = uuidv4();
    const { filename, originalname, size } = file;

    const query = `
      INSERT INTO images (id, filename, original_name, size)
      VALUES (?, ?, ?, ?)
    `;

    db.run(query, [id, filename, originalname, size], function(err) {
      if (err) {
        console.error('Error saving image:', err);
      } else {
        uploads.push({
          id,
          filename,
          originalName: originalname,
          size,
          url: `/uploads/${filename}`
        });
      }
      
      completed++;
      if (completed === req.files.length) {
        res.json({
          uploads,
          message: `${uploads.length} images uploaded successfully!`
        });
      }
    });
  });
});

// Get all images
router.get('/', (req, res) => {
  db.all('SELECT * FROM images ORDER BY uploaded_at DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    const images = rows.map(row => ({
      ...row,
      url: `/uploads/${row.filename}`
    }));
    
    res.json(images);
  });
});

// Get single image
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM images WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    res.json({
      ...row,
      url: `/uploads/${row.filename}`
    });
  });
});

// Delete image
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT filename FROM images WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    // Delete from database
    db.run('DELETE FROM images WHERE id = ?', [id], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      // Try to delete file from filesystem
      const fs = require('fs');
      const filePath = path.join(__dirname, '../uploads', row.filename);
      
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        }
      });
      
      res.json({ message: 'Image deleted successfully!' });
    });
  });
});

module.exports = router; 