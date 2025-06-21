const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../database/db');

const router = express.Router();

// Get all drawings
router.get('/', (req, res) => {
  db.all('SELECT * FROM drawings ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get single drawing
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM drawings WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Drawing not found' });
    }
    res.json(row);
  });
});

// Create new drawing
router.post('/', (req, res) => {
  const { title, canvas_data } = req.body;
  
  if (!canvas_data) {
    return res.status(400).json({ error: 'Canvas data is required' });
  }
  
  const id = uuidv4();
  
  const query = `
    INSERT INTO drawings (id, title, canvas_data)
    VALUES (?, ?, ?)
  `;

  db.run(query, [id, title || 'Untitled Drawing', canvas_data], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id, message: 'Drawing saved successfully!' });
  });
});

// Update drawing
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, canvas_data } = req.body;
  
  if (!canvas_data) {
    return res.status(400).json({ error: 'Canvas data is required' });
  }

  const query = `
    UPDATE drawings SET title = ?, canvas_data = ?
    WHERE id = ?
  `;

  db.run(query, [title || 'Untitled Drawing', canvas_data, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Drawing not found' });
    }
    res.json({ message: 'Drawing updated successfully!' });
  });
});

// Delete drawing
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM drawings WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Drawing not found' });
    }
    res.json({ message: 'Drawing deleted successfully!' });
  });
});

module.exports = router; 