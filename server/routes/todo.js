const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../database/db');

const router = express.Router();

// Get all todo lists
router.get('/', (req, res) => {
  const { house, completed } = req.query;
  let query = 'SELECT * FROM todos';
  let params = [];
  let conditions = [];

  if (house) {
    conditions.push('house = ?');
    params.push(house);
  }

  if (completed !== undefined) {
    conditions.push('completed = ?');
    params.push(completed === 'true' ? 1 : 0);
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

// Get single todo list
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM todos WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Todo list not found' });
    }
    res.json(row);
  });
});

// Create new todo list
router.post('/', (req, res) => {
  const { title, items, house, priority } = req.body;
  const id = uuidv4();
  
  const query = `
    INSERT INTO todos (id, title, items, house, priority)
    VALUES (?, ?, ?, ?, ?)
  `;

  const params = [
    id,
    title,
    JSON.stringify(items || []),
    house,
    priority || 'medium'
  ];

  db.run(query, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id, message: 'Todo list created successfully!' });
  });
});

// Update todo list
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, items, house, priority, completed } = req.body;

  const query = `
    UPDATE todos SET
      title = ?, items = ?, house = ?, priority = ?, completed = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  const params = [
    title,
    JSON.stringify(items || []),
    house,
    priority || 'medium',
    completed ? 1 : 0,
    id
  ];

  db.run(query, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Todo list not found' });
    }
    res.json({ message: 'Todo list updated successfully!' });
  });
});

// Delete todo list
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM todos WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Todo list not found' });
    }
    res.json({ message: 'Todo list deleted successfully!' });
  });
});

// Toggle todo completion
router.patch('/:id/complete', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT completed FROM todos WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Todo list not found' });
    }
    
    const newCompleted = row.completed ? 0 : 1;
    
    db.run('UPDATE todos SET completed = ? WHERE id = ?', [newCompleted, id], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ completed: newCompleted === 1 });
    });
  });
});

module.exports = router; 