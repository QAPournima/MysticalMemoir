const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const diaryRoutes = require('./routes/diary');
const todoRoutes = require('./routes/todo');
const imageRoutes = require('./routes/images');
const drawingRoutes = require('./routes/drawings');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files
app.use('/uploads', express.static(uploadsDir));
app.use(express.static(path.join(__dirname, '../client/build')));

// Routes
app.use('/api/diary', diaryRoutes);
app.use('/api/todo', todoRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/drawings', drawingRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Mystical memoir server is running!' });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something mystical went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🪄 Mystical memoir server is running on port ${PORT}`);
});

module.exports = app; 