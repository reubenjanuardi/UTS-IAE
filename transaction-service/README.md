# Transaction Service - E-Wallet System

Transaction Service untuk mengelola transaksi dalam sistem E-Wallet.

## Setup

```bash
pip install -r requirements.txt
```

## Configuration

Buat file `.env` dengan konfigurasi:

```env
PORT=3003
SECRET_KEY=transaction-service-secret-key
DATABASE_URL=sqlite:///transactions.db
SERVICE_NAME=transaction-service
WALLET_SERVICE_URL=http://localhost:3002
NOTIFICATION_SERVICE_URL=http://localhost:3004
```

## Menjalankan

```bash
python app.py
```

## API Endpoints

### Transactions

- `GET /transactions` - Get all transactions
- `GET /transactions/{id}` - Get transaction by ID
- `POST /transactions` - Create new transaction
- `GET /transactions/user/{user_id}` - Get transactions for user
