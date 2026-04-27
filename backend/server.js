const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { neon } = require('@neondatabase/serverless');
const path = require('path');
require('dotenv').config();
console.log('CWD:', process.cwd());
console.log('__dirname:', __dirname);
console.log('DATABASE_URL from env:', process.env.DATABASE_URL);

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
const sql = neon(process.env.DATABASE_URL);
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'set' : 'not set');

// Export sql for use in routes
module.exports = { sql };

// Now require routes after pool is created
const authRoutes = require('./routes/auth');
const resultsRoutes = require('./routes/results');
const leaderboardRoutes = require('./routes/leaderboard');
const galleryRoutes = require('./routes/gallery');

// Middleware
app.use(helmet());
app.use(cors({
  origin: true, // Allow all origins for development
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/results', resultsRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/gallery', galleryRoutes);

// Serve static files from the parent directory (frontend) - AFTER API routes
app.use(express.static(path.join(__dirname, '..')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export sql for use in routes
module.exports = { sql };