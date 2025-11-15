require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./database');
const routes = require('./routes');

const app = express();
const PORT = process.env.NOTIFICATION_SERVICE_PORT || 3004;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.use(cors());
// Body parser with error handling
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Notification Service is running', port: PORT });
});

// Handle aborted requests gracefully
app.use((req, res, next) => {
  req.on('aborted', () => {
    console.warn('Request aborted:', req.method, req.path);
  });
  next();
});

app.use('/', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware (must be last)
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }
  if (err.code === 'ECONNABORTED' || err.message === 'request aborted') {
    return res.status(499).json({ error: 'Client disconnected' });
  }
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

const start = async () => {
  try {
    await initializeDatabase();
    console.log('Database initialized');
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`✓ Notification Service running on http://localhost:${PORT}`);
      console.log(`✓ Environment: ${NODE_ENV}`);
      console.log(`✓ Health: GET http://localhost:${PORT}/health`);
    });
    
    server.on('error', (err) => {
      console.error('Server error:', err);
    });
  } catch (error) {
    console.error('Failed to start service:', error);
    process.exit(1);
  }
};

start();
