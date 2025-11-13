const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Service URLs
const services = {
  userService: process.env.USER_SERVICE_URL || 'http://localhost:3001',
  walletService: process.env.WALLET_SERVICE_URL || 'http://localhost:3002',
  transactionService: process.env.TRANSACTION_SERVICE_URL || 'http://localhost:3003',
  notificationService: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3004'
};

// Dummy user database (in production, use real database)
const users = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@ewallet.com',
    password: '$2a$10$YQi23oTwOhQz8D7YpWJRb.Cl.K.rBaxpXJ5.PN4xN8EYEKLc1K31m', // admin123
    role: 'admin'
  },
  {
    id: 2,
    username: 'user1',
    email: 'user1@ewallet.com',
    password: '$2a$10$YQi23oTwOhQz8D7YpWJRb.Cl.K.rBaxpXJ5.PN4xN8EYEKLc1K31m', // admin123
    role: 'user'
  }
];

// JWT Authentication Middleware
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ 
      error: 'Access denied. No token provided.' 
    });
  }

  const token = authHeader.split(' ')[1]; // Bearer TOKEN

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    console.log(`✓ JWT verified for user: ${decoded.username}`);
    next();
  } catch (error) {
    console.error(`✗ JWT verification failed: ${error.message}`);
    return res.status(403).json({ 
      error: 'Invalid or expired token.' 
    });
  }
};

// Login endpoint
app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ 
      error: 'Username and password are required' 
    });
  }

  // Find user
  const user = users.find(u => u.username === username);
  
  if (!user) {
    return res.status(401).json({ 
      error: 'Invalid credentials' 
    });
  }

  // Verify password
  const validPassword = await bcrypt.compare(password, user.password);
  
  if (!validPassword) {
    return res.status(401).json({ 
      error: 'Invalid credentials' 
    });
  }

  // Generate JWT token
  const token = jwt.sign(
    { 
      id: user.id, 
      username: user.username,
      email: user.email,
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    success: true,
    token: token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  });
});

// Register endpoint
app.post('/auth/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ 
      error: 'Username, email and password are required' 
    });
  }

  // Check if user already exists
  const existingUser = users.find(u => u.username === username || u.email === email);
  
  if (existingUser) {
    return res.status(400).json({ 
      error: 'Username or email already exists' 
    });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = {
    id: Math.max(...users.map(u => u.id), 0) + 1,
    username,
    email,
    password: hashedPassword,
    role: 'user'
  };

  users.push(newUser);

  // Generate token
  const token = jwt.sign(
    { 
      id: newUser.id, 
      username: newUser.username,
      email: newUser.email,
      role: newUser.role 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.status(201).json({
    success: true,
    token: token,
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role
    }
  });
});

// Verify token endpoint
app.get('/auth/verify', authenticateJWT, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// Refresh token endpoint
app.post('/auth/refresh', authenticateJWT, (req, res) => {
  const newToken = jwt.sign(
    { 
      id: req.user.id, 
      username: req.user.username,
      email: req.user.email,
      role: req.user.role 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    success: true,
    token: newToken
  });
});

// Proxy middleware with JWT forwarding
const createAuthProxy = (service, serviceName) => {
  return createProxyMiddleware({
    target: services[service],
    changeOrigin: true,
    pathRewrite: (path, req) => {
      // Remove the /api/serviceName prefix and return just the namespace path
      const prefix = `/api/${serviceName}`;
      if (path.startsWith(prefix)) {
        return path.slice(prefix.length) || '/';
      }
      return path;
    },
    logLevel: 'debug',
    onProxyReq: (proxyReq, req, res) => {
      // Forward JWT token to backend services
      if (req.user) {
        proxyReq.setHeader('X-User-Id', req.user.id);
        proxyReq.setHeader('X-User-Role', req.user.role);
        proxyReq.setHeader('X-User-Username', req.user.username);
        proxyReq.setHeader('X-User-Email', req.user.email);
      }
    },
    onProxyRes: (proxyRes, req, res) => {
      // Log proxy response for debugging
      console.log(`✓ Proxy response: ${proxyRes.statusCode} from ${services[service]}`);
    },
    onError: (err, req, res) => {
      console.error('✗ Proxy error:', err.message);
      res.status(503).json({
        error: 'Service unavailable',
        message: err.message
      });
    }
  });
};

// Protected routes (require authentication)
console.log('📝 Registering protected routes...');
app.use('/api/user-service', authenticateJWT, createAuthProxy('userService', 'user-service'));
console.log('  ✓ /api/user-service → ' + services.userService);
app.use('/api/wallet-service', authenticateJWT, createAuthProxy('walletService', 'wallet-service'));
console.log('  ✓ /api/wallet-service → ' + services.walletService);
app.use('/api/transaction-service', authenticateJWT, createAuthProxy('transactionService', 'transaction-service'));
console.log('  ✓ /api/transaction-service → ' + services.transactionService);
app.use('/api/notification-service', authenticateJWT, createAuthProxy('notificationService', 'notification-service'));
console.log('  ✓ /api/notification-service → ' + services.notificationService);

// Public routes (no authentication required)
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    gateway: 'E-Wallet API Gateway',
    services: Object.keys(services).map(key => ({
      name: key,
      url: services[key]
    }))
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// 404 handler - catch all unmatched routes
app.use((req, res) => {
  console.error(`✗ 404: ${req.method} ${req.path}`);
  res.status(404).json({
    error: 'Not found',
    path: req.path,
    method: req.method,
    message: 'The requested endpoint does not exist'
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 API Gateway running on http://localhost:${PORT}`);
  console.log(`📚 Login endpoint: POST http://localhost:${PORT}/auth/login`);
  console.log(`📚 Register endpoint: POST http://localhost:${PORT}/auth/register`);
  console.log(`🏥 Health check: GET http://localhost:${PORT}/health\n`);
  console.log('Connected Services:');
  Object.entries(services).forEach(([key, url]) => {
    console.log(`  - ${key}: ${url}`);
  });
  console.log('\n');
});
