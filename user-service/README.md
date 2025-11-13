# User Service - E-Wallet System

User Service untuk mengelola data pengguna dalam sistem E-Wallet.

## Setup

```bash
pip install -r requirements.txt
```

## Configuration

Buat file `.env` dengan konfigurasi:

```env
PORT=3001
SECRET_KEY=user-service-secret-key
DATABASE_URL=sqlite:///users.db
SERVICE_NAME=user-service
```

## Menjalankan

```bash
python app.py
```

## API Endpoints

### Users

- `GET /users` - Get all users
- `GET /users/{id}` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user

### Internal Endpoints

- `GET /internal/users/{user_id}` - Get user info (for other services)
- `GET /internal/users/{user_id}/validate` - Validate user exists
