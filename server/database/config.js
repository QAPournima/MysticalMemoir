// Database configuration selector
const isDevelopment = process.env.NODE_ENV !== 'production';
const useNeon = process.env.DATABASE_URL && !isDevelopment;

let db;

if (useNeon) {
  // Use Neon PostgreSQL for production
  console.log('🌊 Using Neon PostgreSQL database');
  const neonDB = require('./neon-db');
  neonDB.initNeonDB().catch(console.error);
  db = neonDB;
} else {
  // Use SQLite for development
  console.log('🏠 Using SQLite database for development');
  db = require('./db');
}

module.exports = db; 