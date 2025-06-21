const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../database/db');

const router = express.Router();

// Get all diary entries
router.get('/', (req, res) => {
  const { bookmarked, house, date } = req.query;
  let query = 'SELECT * FROM diary_entries';
  let params = [];
  let conditions = [];

  if (bookmarked) {
    conditions.push('bookmarked = ?');
    params.push(1);
  }

  if (house) {
    conditions.push('house = ?');
    params.push(house);
  }

  if (date) {
    conditions.push('date = ?');
    params.push(date);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY created_at DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get single diary entry
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM diary_entries WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Diary entry not found' });
    }
    res.json(row);
  });
});

// Create new diary entry
router.post('/', (req, res) => {
  const {
    title,
    content,
    date,
    mood,
    weather,
    house,
    tags,
    images,
    drawings,
    stickers
  } = req.body;

  const id = uuidv4();
  
  const query = `
    INSERT INTO diary_entries (
      id, title, content, date, mood, weather, house, tags, images, drawings, stickers
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    id, title, content, date, mood, weather, house,
    JSON.stringify(tags || []),
    JSON.stringify(images || []),
    JSON.stringify(drawings || []),
    JSON.stringify(stickers || [])
  ];

  db.run(query, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id, message: 'Diary entry created successfully!' });
  });
});

// Update diary entry
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const {
    title,
    content,
    date,
    mood,
    weather,
    house,
    tags,
    images,
    drawings,
    stickers,
    bookmarked
  } = req.body;

  const query = `
    UPDATE diary_entries SET
      title = ?, content = ?, date = ?, mood = ?, weather = ?, house = ?,
      tags = ?, images = ?, drawings = ?, stickers = ?, bookmarked = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  const params = [
    title, content, date, mood, weather, house,
    JSON.stringify(tags || []),
    JSON.stringify(images || []),
    JSON.stringify(drawings || []),
    JSON.stringify(stickers || []),
    bookmarked ? 1 : 0,
    id
  ];

  db.run(query, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Diary entry not found' });
    }
    res.json({ message: 'Diary entry updated successfully!' });
  });
});

// Delete diary entry
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM diary_entries WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Diary entry not found' });
    }
    res.json({ message: 'Diary entry deleted successfully!' });
  });
});

// Toggle bookmark
router.patch('/:id/bookmark', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT bookmarked FROM diary_entries WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Diary entry not found' });
    }
    
    const newBookmarked = row.bookmarked ? 0 : 1;
    
    db.run('UPDATE diary_entries SET bookmarked = ? WHERE id = ?', [newBookmarked, id], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ bookmarked: newBookmarked === 1 });
    });
  });
});

module.exports = router; 