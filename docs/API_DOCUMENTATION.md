# 📚 E-Wallet API Documentation

## Service Integration Map

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (HTML+JS)                │
│              index.html, dashboard.html             │
└────────────────────┬────────────────────────────────┘
                     │
                     ↓
         ┌───────────────────────────┐
         │   API Gateway (Node.js)   │
         │   Port: 3000              │
         │   - JWT Authentication    │
         │   - Request Routing       │
         └────────┬────────┬────────┬────────┬────────┘
                  │        │        │        │
        ┌─────────┘        │        │        └─────────┐
        │                  │        │                  │
        ↓                  ↓        ↓                  ↓
    ┌─────────────┐  ┌──────────┐ ┌──────────────┐  ┌────────────────┐
    │User Service │  │ Wallet   │ │Transaction   │  │Notification    │
    │Port: 3001   │  │Service   │ │Service       │  │Service         │
    │Flask + SQLite│  │Port: 3002│ │Port: 3003    │  │Port: 3004      │
    │             │  │Flask +   │ │Flask + SQLite│  │Flask + SQLite  │
    └─────────────┘  │SQLite    │ └──────────────┘  └────────────────┘
                     └──────────┘
```

## Service Communication Flow

### Transfer Scenario

```
1. Frontend → API Gateway (POST /api/transaction-service/transactions)
                    ↓
2. Transaction Service → Wallet Service (GET balance)
                    ↓
3. Wallet Service → responds with balance
                    ↓
4. Transaction Service → Wallet Service (PUT balance - deduct)
                    ↓
5. Wallet Service → responds updated balance
                    ↓
6. Transaction Service → Wallet Service (PUT balance - add to receiver)
                    ↓
7. Wallet Service → responds updated balance
                    ↓
8. Transaction Service → Notification Service (POST notification)
                    ↓
9. Notification Service → creates notification
                    ↓
10. Response back to Frontend
```

## API Endpoints Reference

### 🔐 Authentication (Port 3000)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/login` | Login user | ❌ |
| POST | `/auth/register` | Register new user | ❌ |
| GET | `/auth/verify` | Verify token | ✅ |
| POST | `/auth/refresh` | Refresh token | ✅ |

**Response Format**:
```json
{
  "success": true,
  "token": "jwt_token",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@ewallet.com",
    "role": "admin"
  }
}
```

### 👤 User Service (Port 3001)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/users` | Get all users | ✅ |
| GET | `/users/{id}` | Get user by ID | ✅ |
| POST | `/users` | Create user | ✅ |
| PUT | `/users/{id}` | Update user | ✅ |
| DELETE | `/users/{id}` | Delete user | ✅ |

**Example Request**:
```bash
curl -X GET http://localhost:3001/users \
  -H "Authorization: Bearer <token>"
```

**Example Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "username": "admin",
      "email": "admin@ewallet.com",
      "full_name": "Administrator",
      "phone": "081234567890",
      "address": "Jl. Main St 123",
      "status": "active",
      "created_at": "2024-01-01T10:00:00"
    }
  ]
}
```

### 💳 Wallet Service (Port 3002)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/wallets` | Get all wallets | ✅ |
| GET | `/wallets/{id}` | Get wallet by ID | ✅ |
| POST | `/wallets` | Create wallet | ✅ |
| PUT | `/wallets/{id}` | Update wallet | ✅ |
| GET | `/wallets/user/{user_id}` | Get wallet by user ID | ✅ |

**Create Wallet Request**:
```json
{
  "user_id": 1,
  "balance": 1000000,
  "currency": "IDR"
}
```

**Wallet Response**:
```json
{
  "id": 1,
  "user_id": 1,
  "balance": 1000000,
  "currency": "IDR",
  "status": "active",
  "created_at": "2024-01-01T10:00:00"
}
```

### 💸 Transaction Service (Port 3003)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/transactions` | Get all transactions | ✅ |
| GET | `/transactions/{id}` | Get transaction by ID | ✅ |
| POST | `/transactions` | Create transaction | ✅ |
| GET | `/transactions/user/{user_id}` | Get user transactions | ✅ |

**Create Transaction Request**:
```json
{
  "from_user_id": 1,
  "to_user_id": 2,
  "amount": 50000,
  "type": "transfer",
  "description": "Transfer to friend"
}
```

**Transaction Types**:
- `transfer` - Transfer antar user
- `topup` - Top up wallet
- `withdrawal` - Withdraw dari wallet

**Transaction Response**:
```json
{
  "id": 1,
  "from_user_id": 1,
  "to_user_id": 2,
  "amount": 50000,
  "type": "transfer",
  "description": "Transfer to friend",
  "status": "completed",
  "reference_id": "uuid",
  "created_at": "2024-01-01T10:00:00"
}
```

### 🔔 Notification Service (Port 3004)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/notifications` | Get all notifications | ✅ |
| GET | `/notifications/{id}` | Get notification by ID | ✅ |
| POST | `/notifications` | Create notification | ✅ |
| DELETE | `/notifications/{id}` | Delete notification | ✅ |
| GET | `/notifications/user/{user_id}` | Get user notifications | ✅ |
| GET | `/notifications/user/{user_id}/unread` | Get unread notifications | ✅ |

**Create Notification Request**:
```json
{
  "user_id": 1,
  "title": "Transfer Received",
  "message": "You received Rp 50,000 from John",
  "type": "transaction"
}
```

**Notification Response**:
```json
{
  "id": 1,
  "user_id": 1,
  "title": "Transfer Received",
  "message": "You received Rp 50,000 from John",
  "type": "transaction",
  "is_read": false,
  "created_at": "2024-01-01T10:00:00"
}
```

## Error Responses

### Common Error Codes

**400 - Bad Request**:
```json
{
  "success": false,
  "error": "Invalid request parameters"
}
```

**401 - Unauthorized**:
```json
{
  "error": "Access denied. No token provided."
}
```

**403 - Forbidden**:
```json
{
  "error": "Invalid or expired token."
}
```

**404 - Not Found**:
```json
{
  "success": false,
  "error": "Resource not found"
}
```

**500 - Internal Server Error**:
```json
{
  "error": "Internal server error",
  "message": "Error message"
}
```

## Rate Limiting & Best Practices

1. **Token Management**:
   - Token berlaku 24 jam
   - Store token di localStorage
   - Clear token saat logout

2. **Error Handling**:
   - Check response status
   - Handle connection errors
   - Provide user feedback

3. **Data Validation**:
   - Validasi input sebelum send
   - Handle large numbers safely
   - Validate email format

## Testing Checklist

- [ ] API Gateway starts correctly
- [ ] All services start without errors
- [ ] Authentication works (login/register)
- [ ] Can view user list
- [ ] Can view wallets
- [ ] Can create transaction
- [ ] Can view transactions
- [ ] Notifications received
- [ ] Frontend dashboard displays correctly
- [ ] Transfer between users works
- [ ] Top up works
- [ ] Balance updates correctly

## Deployment Notes

For production deployment:

1. Use HTTPS instead of HTTP
2. Set strong JWT_SECRET
3. Implement rate limiting
4. Add proper logging
5. Use environment variables
6. Add database backups
7. Set up monitoring
8. Configure CORS properly
9. Add request validation
10. Implement API versioning

## Support & Debugging

### Check Service Status

```bash
# Test API Gateway
curl http://localhost:3000/health

# Test User Service
curl http://localhost:3001/health

# Test Wallet Service
curl http://localhost:3002/health

# Test Transaction Service
curl http://localhost:3003/health

# Test Notification Service
curl http://localhost:3004/health
```

### View Logs

Check terminal output where each service is running for error messages.

### Reset Database

Delete `.db` files in each service folder to reset databases:
- `user-service/users.db`
- `wallet-service/wallets.db`
- `transaction-service/transactions.db`
- `notification-service/notifications.db`

---

**Last Updated**: 2024  
**API Version**: 1.0.0  
**Framework**: Node.js + Flask  
**Database**: SQLite
