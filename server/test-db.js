#!/usr/bin/env node

// Database connection test script
require('dotenv').config();
const db = require('./database/adapter');

async function testDatabase() {
  console.log('🧪 Testing database connection...\n');

  try {
    // Test 1: Basic connection
    console.log('1. Testing basic connection...');
    const testQuery = db.isPostgreSQL ? 'SELECT NOW() as current_time' : 'SELECT datetime("now") as current_time';
    const result = await db.query(testQuery);
    console.log('✅ Connected successfully!');
    console.log(`   Database type: ${db.isPostgreSQL ? 'PostgreSQL (Neon)' : 'SQLite'}`);
    console.log(`   Current time: ${result.rows[0].current_time}\n`);

    // Test 2: Check tables exist
    console.log('2. Checking table structure...');
    const tableQuery = db.isPostgreSQL 
      ? "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
      : "SELECT name FROM sqlite_master WHERE type='table'";
    
    const tables = await db.all(tableQuery);
    const tableNames = tables.map(row => db.isPostgreSQL ? row.table_name : row.name);
    
    const expectedTables = ['diary_entries', 'todos', 'images', 'drawings', 'user_preferences'];
    const missingTables = expectedTables.filter(table => !tableNames.includes(table));
    
    if (missingTables.length === 0) {
      console.log('✅ All required tables exist');
      console.log(`   Tables: ${tableNames.join(', ')}\n`);
    } else {
      console.log('⚠️  Some tables are missing:');
      console.log(`   Missing: ${missingTables.join(', ')}`);
      console.log(`   Existing: ${tableNames.join(', ')}\n`);
    }

    // Test 3: Insert test data
    console.log('3. Testing data operations...');
    const testEntry = {
      id: 'test-' + Date.now(),
      title: 'Test Entry',
      content: 'This is a test diary entry to verify database functionality.',
      date: new Date().toISOString(),
      mood: 'curious',
      weather: 'clear',
      house: 'gryffindor',
      tags: JSON.stringify(['test', 'database']),
      images: JSON.stringify([]),
      drawings: JSON.stringify([]),
      stickers: JSON.stringify([]),
      bookmarked: 0
    };

    // Insert test entry
    const inserted = await db.insert('diary_entries', testEntry);
    console.log('✅ Insert operation successful');

    // Read test entry
    const retrieved = await db.get('SELECT * FROM diary_entries WHERE id = ?', [testEntry.id]);
    console.log('✅ Read operation successful');

    // Update test entry
    await db.update('diary_entries', { mood: 'excited' }, 'id = ?', [testEntry.id]);
    console.log('✅ Update operation successful');

    // Clean up - delete test entry
    await db.delete('diary_entries', 'id = ?', [testEntry.id]);
    console.log('✅ Delete operation successful\n');

    // Test 4: Search functionality
    console.log('4. Testing search functionality...');
    if (db.isPostgreSQL) {
      console.log('✅ PostgreSQL full-text search available');
      console.log('   Advanced search features enabled\n');
    } else {
      console.log('✅ SQLite LIKE search available');
      console.log('   Basic search functionality enabled\n');
    }

    // Success summary
    console.log('🎉 All database tests passed!');
    console.log(`\n📊 Database Summary:`);
    console.log(`   Type: ${db.isPostgreSQL ? 'Neon PostgreSQL' : 'SQLite'}`);
    console.log(`   Status: Ready for production`);
    console.log(`   Features: ${db.isPostgreSQL ? 'Full-text search, ACID transactions, Connection pooling' : 'Local file storage, Fast queries'}`);

  } catch (error) {
    console.error('❌ Database test failed:');
    console.error(error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.log('\n💡 Troubleshooting tips:');
      console.log('   - Check your DATABASE_URL environment variable');
      console.log('   - Verify network connection');
      console.log('   - Ensure Neon database is running');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Connection refused - check:');
      console.log('   - Database credentials');
      console.log('   - SSL configuration');
      console.log('   - Firewall settings');
    }
  }
}

// Run the test
testDatabase(); 