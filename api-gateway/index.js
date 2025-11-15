require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = process.env.API_GATEWAY_PORT || 3000;
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';
const WALLET_SERVICE_URL = process.env.WALLET_SERVICE_URL || 'http://localhost:3002';
const TRANSACTION_SERVICE_URL = process.env.TRANSACTION_SERVICE_URL || 'http://localhost:3003';
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3004';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '1h';

app.use(cors());
// app.use(express.json());

// JWT Token Verification Middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer TOKEN"

  if (token == null) {
    return res.status(401).json({ success: false, message: 'Access denied. Token missing.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
    }
    // Pass user info to downstream services
    req.headers['x-user-id'] = user.userId;
    req.headers['x-user-email'] = user.email;
    next();
  });
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'api-gateway' });
});

// Service health checks
app.get('/health/services', async (req, res) => {
  const services = {
    'api-gateway': 'http://localhost:3000',
    'user-service': 'http://localhost:3001',
    'wallet-service': 'http://localhost:3002',
    'transaction-service': 'http://localhost:3003',
    'notification-service': 'http://localhost:3004'
  };

  const statuses = {};
  for (const [service, url] of Object.entries(services)) {
    try {
      const response = await fetch(`${url}/health`, { timeout: 2000 });
      statuses[service] = response.ok ? 'UP' : 'DOWN';
    } catch (error) {
      statuses[service] = 'DOWN';
    }
  }

  res.json({ status: 'OK', services: statuses });
});

// Proxy configuration with timeouts
const proxyOptions = {
  timeout: 10000,
  proxyTimeout: 10000
};

// User Service - NO TOKEN REQUIRED (registration and login are public)
app.use(
  '/api/user-service',
  createProxyMiddleware({
    target: USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/api/user-service': ''
    },
    timeout: 10000,
    proxyTimeout: 10000,
    onError: (err, req, res) => {
      console.error('User Service proxy error:', err.message);
      res.status(503).json({ success: false, message: 'User Service unavailable' });
    },
    onProxyRes: (proxyRes, req, res) => {
      proxyRes.headers['X-Proxy-By'] = 'api-gateway';
    }
  })
);

// Wallet Service - TOKEN REQUIRED
app.use(
  '/api/wallet-service',
  verifyToken,
  createProxyMiddleware({
    target: WALLET_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/api/wallet-service': ''
    },
    timeout: 10000,
    proxyTimeout: 10000,
    onError: (err, req, res) => {
      console.error('Wallet Service proxy error:', err.message);
      res.status(503).json({ success: false, message: 'Wallet Service unavailable' });
    }
  })
);

// Transaction Service - TOKEN REQUIRED
app.use(
  '/api/transaction-service',
  verifyToken,
  createProxyMiddleware({
    target: TRANSACTION_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/api/transaction-service': ''
    },
    timeout: 15000,
    proxyTimeout: 15000,
    onError: (err, req, res) => {
      console.error('Transaction Service proxy error:', err.message);
      res.status(503).json({ success: false, message: 'Transaction Service unavailable' });
    }
  })
);

// Notification Service - TOKEN REQUIRED
app.use(
  '/api/notification-service',
  verifyToken,
  createProxyMiddleware({
    target: NOTIFICATION_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/api/notification-service': ''
    },
    timeout: 10000,
    proxyTimeout: 10000,
    onError: (err, req, res) => {
      console.error('Notification Service proxy error:', err.message);
      res.status(503).json({ success: false, message: 'Notification Service unavailable' });
    }
  })
);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ API Gateway running on http://localhost:${PORT}`);
  console.log(`✓ JWT authentication enabled for wallet, transaction, and notification services`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✓ Service URLs loaded from environment variables`);
});
