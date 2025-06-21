const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'diary.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
const initDB = () => {
  // Diary entries table
  db.run(`
    CREATE TABLE IF NOT EXISTS diary_entries (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      date TEXT NOT NULL,
      mood TEXT,
      weather TEXT,
      house TEXT,
      tags TEXT,
      images TEXT,
      drawings TEXT,
      stickers TEXT,
      bookmarked INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Todo lists table
  db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      items TEXT NOT NULL,
      house TEXT,
      priority TEXT DEFAULT 'medium',
      completed INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Images table
  db.run(`
    CREATE TABLE IF NOT EXISTS images (
      id TEXT PRIMARY KEY,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      size INTEGER,
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Drawings table
  db.run(`
    CREATE TABLE IF NOT EXISTS drawings (
      id TEXT PRIMARY KEY,
      title TEXT,
      canvas_data TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // User preferences table
  db.run(`
    CREATE TABLE IF NOT EXISTS user_preferences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      theme TEXT DEFAULT 'gryffindor',
      font_size TEXT DEFAULT 'medium',
      notifications INTEGER DEFAULT 1,
      auto_save INTEGER DEFAULT 1
    )
  `);

  console.log('🏰 Database initialized successfully!');
};

// Initialize the database
initDB();

module.exports = db; 