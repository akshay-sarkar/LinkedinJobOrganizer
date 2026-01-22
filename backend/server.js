import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize, testConnection } from './config/database.js';
import jobRoutes from './routes/jobRoutes.js';
import Job from './models/Job.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5500;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/jobs', jobRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'LinkedIn Job Organizer API is running',
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'LinkedIn Job Organizer API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      jobs: '/api/jobs',
      fetchJobs: 'POST /api/jobs/fetch',
      stats: '/api/jobs/stats',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Sync database models (creates tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log('✅ Database models synced');

    // Start Express server
    app.listen(PORT, () => {
      console.log('\n🚀 Server is running!');
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📧 Gmail: ${process.env.GMAIL_USER || 'Not configured'}`);
      console.log('\n📚 API Endpoints:');
      console.log(`   GET    /api/jobs         - Get all jobs`);
      console.log(`   GET    /api/jobs/:id     - Get single job`);
      console.log(`   GET    /api/jobs/stats   - Get statistics`);
      console.log(`   POST   /api/jobs/fetch   - Fetch new jobs from email`);
      console.log(`   PUT    /api/jobs/:id     - Update job`);
      console.log(`   DELETE /api/jobs/:id     - Delete job`);
      console.log('\n');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n⏹️  Shutting down gracefully...');
  await sequelize.close();
  console.log('✅ Database connection closed');
  process.exit(0);
});

export default app;
