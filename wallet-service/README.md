# Wallet Service - E-Wallet System

Wallet Service untuk mengelola dompet digital pengguna dalam sistem E-Wallet.

## Setup

```bash
pip install -r requirements.txt
```

## Configuration

Buat file `.env` dengan konfigurasi:

```env
PORT=3002
SECRET_KEY=wallet-service-secret-key
DATABASE_URL=sqlite:///wallets.db
SERVICE_NAME=wallet-service
USER_SERVICE_URL=http://localhost:3001
```

## Menjalankan

```bash
python app.py
```

## API Endpoints

### Wallets

- `GET /wallets` - Get all wallets
- `GET /wallets/{id}` - Get wallet by ID
- `POST /wallets` - Create new wallet
- `PUT /wallets/{id}` - Update wallet
- `GET /wallets/user/{user_id}` - Get wallet by user ID

### Internal Endpoints

- `GET /internal/wallets/user/{user_id}/balance` - Get wallet balance
- `PUT /internal/wallets/user/{user_id}/balance` - Update wallet balance
