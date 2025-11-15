# Wallet Service

Manages wallet balances and top-up/withdraw operations.

## Endpoints

- `GET /health` - Health check
- `GET /wallets/:userId` - Get wallet by user ID
- `POST /wallets/topup` - Top-up wallet
- `POST /wallets/withdraw` - Withdraw from wallet
- `PUT /internal/wallets/:userId/balance` - Internal endpoint for updating balance

## Database

SQLite with `wallets` table containing:
- id (INTEGER PRIMARY KEY)
- user_id (INTEGER UNIQUE)
- balance (REAL)
- updated_at (DATETIME)

## Integrations

- Validates user existence via user-service
- Called by transaction-service for balance updates

## Port

Runs on port 3002
