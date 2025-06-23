const { Pool } = require('pg');

// Neon PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize database tables for PostgreSQL
const initNeonDB = async () => {
  try {
    const client = await pool.connect();
    
    // Diary entries table
    await client.query(`
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Todo lists table
    await client.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        items TEXT NOT NULL,
        house TEXT,
        priority TEXT DEFAULT 'medium',
        completed INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Images table
    await client.query(`
      CREATE TABLE IF NOT EXISTS images (
        id TEXT PRIMARY KEY,
        filename TEXT NOT NULL,
        original_name TEXT NOT NULL,
        size INTEGER,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Drawings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS drawings (
        id TEXT PRIMARY KEY,
        title TEXT,
        canvas_data TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // User preferences table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_preferences (
        id SERIAL PRIMARY KEY,
        theme TEXT DEFAULT 'gryffindor',
        font_size TEXT DEFAULT 'medium',
        notifications INTEGER DEFAULT 1,
        auto_save INTEGER DEFAULT 1
      )
    `);

    // Create full-text search index for diary entries
    await client.query(`
      CREATE INDEX IF NOT EXISTS diary_search_idx 
      ON diary_entries USING gin(to_tsvector('english', title || ' ' || content))
    `);

    client.release();
    console.log('🌊 Neon PostgreSQL database initialized successfully!');
  } catch (error) {
    console.error('Error initializing Neon database:', error);
    throw error;
  }
};

// Database query wrapper for consistency with SQLite
const query = (text, params) => {
  return pool.query(text, params);
};

// Get a client for transactions
const getClient = () => {
  return pool.connect();
};

module.exports = {
  pool,
  query,
  getClient,
  initNeonDB
}; 