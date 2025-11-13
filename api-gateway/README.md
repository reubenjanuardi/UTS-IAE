# API Gateway - E-Wallet System

API Gateway untuk sistem E-Wallet yang menghubungkan semua layanan backend.

## Setup

```bash
npm install
```

## Configuration

Buat file `.env` dengan konfigurasi:

```env
PORT=3000
JWT_SECRET=your-very-secret-jwt-key-change-this-in-production
USER_SERVICE_URL=http://localhost:3001
WALLET_SERVICE_URL=http://localhost:3002
TRANSACTION_SERVICE_URL=http://localhost:3003
NOTIFICATION_SERVICE_URL=http://localhost:3004
```

## Menjalankan

```bash
# Development
npm run dev

# Production
npm start
```

## Default Credentials

- **Username**: admin
- **Password**: admin123

## API Endpoints

### Authentication

- `POST /auth/login` - Login user
- `POST /auth/register` - Register user baru
- `GET /auth/verify` - Verify token
- `POST /auth/refresh` - Refresh token

### Services

- `GET /api/user-service/users` - Get all users
- `GET /api/wallet-service/wallets` - Get all wallets
- `GET /api/transaction-service/transactions` - Get all transactions
- `GET /api/notification-service/notifications` - Get all notifications
