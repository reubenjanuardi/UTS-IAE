# Transaction Service

Handles all transaction operations including transfers, top-ups, and withdrawals.

## Endpoints

- `GET /health` - Health check
- `GET /transactions` - Get all transactions
- `GET /transactions/:id` - Get transaction by ID
- `GET /transactions/user/:userId` - Get user transactions
- `POST /transactions/send` - Send money between users
- `POST /transactions/topup` - Top-up wallet
- `POST /transactions/withdraw` - Withdraw from wallet

## Database

SQLite with `transactions` table containing:
- id (INTEGER PRIMARY KEY)
- user_id (INTEGER)
- type (TEXT: send, topup, withdraw)
- amount (REAL)
- recipient_id (INTEGER)
- status (TEXT: completed, pending)
- created_at (DATETIME)

## Integrations

- Calls user-service to verify users
- Calls wallet-service to update balances
- Calls notification-service to send notifications

## Port

Runs on port 3003
