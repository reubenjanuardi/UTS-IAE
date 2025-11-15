# E-Wallet Postman Collection - Complete Testing Guide

This directory contains the Postman collection and environment configuration for testing the E-Wallet microservices system with JWT authentication, bcrypt password hashing, and API Gateway routing.

---

## ✅ Collection Status: CORRECTED & SYNCHRONIZED

All endpoints now correctly use the **API Gateway routing pattern**: `/api/service-name/endpoint`

**Endpoint Pattern Reference:**
- User Service: `/api/user-service/users*`
- Wallet Service: `/api/wallet-service/wallets*`
- Transaction Service: `/api/transaction-service/transactions*`
- Notification Service: `/api/notification-service/notifications*`

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Postman Setup](#postman-setup)
3. [Quick Start Testing](#quick-start-testing)
4. [Complete 11-Step Workflow](#complete-11-step-workflow)
5. [API Endpoints Reference](#api-endpoints-reference)
6. [Error Testing Guide](#error-testing-guide)
7. [Troubleshooting](#troubleshooting)
8. [Security Features](#security-features)

---

## System Overview

### Architecture

The E-Wallet system uses a microservices architecture with an API Gateway:

```
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway (3000)                      │
│  - JWT Token Verification                                   │
│  - Request Routing to Services                              │
└──────────┬──────────────┬──────────────┬────────────────────┘
           │              │              │
    ┌──────▼────┐  ┌──────▼─────┐  ┌────▼──────────┐
    │User       │  │Wallet      │  │Transaction    │
    │Service    │  │Service     │  │Service        │
    │(3001)     │  │(3002)      │  │(3003)         │
    └───────────┘  └────────────┘  └───────────────┘
           ▲              ▲              ▲
           │              │              │
    ┌──────┴────────┬─────┴──────┬──────┴────────┐
    │               │            │               │
┌───▼──┐      ┌─────▼──┐  ┌──────▼──┐    ┌──────▼──┐
│users │      │wallets │  │trans.   │    │notifi.  │
│.db   │      │.db     │  │.db      │    │.db      │
└──────┘      └────────┘  └─────────┘    └─────────┘
```

### Microservices

- **API Gateway** (Port 3000): Routes requests, verifies JWT tokens
- **User Service** (Port 3001): Registration, login, user management
- **Wallet Service** (Port 3002): Wallet operations, balance management
- **Transaction Service** (Port 3003): P2P transfers, transaction history
- **Notification Service** (Port 3004): Transaction notifications

### Authentication & Security

- **JWT Tokens**: 1-hour expiry with HS256 algorithm
- **Password Hashing**: bcrypt with 10 salt rounds
- **Protected Endpoints**: Require `Authorization: Bearer {{jwt_token}}` header
- **User Identification**: x-user-id header extracted from JWT
- **Environment Variables**: All secrets loaded from `.env.local`

---

## Postman Setup

### Step 1: Import Collection and Environment

1. Open Postman
2. Click **Import** (top-left corner)
3. Select and import:
   - `ewallet_collection.json`
   - `environment.json`

### Step 2: Select Environment

1. Click environment dropdown (top-right)
2. Select **E-Wallet Environment**

### Step 3: Verify Variables

Check these key variables are populated:

| Variable | Value | Auto-populated |
|----------|-------|-----------------|
| `api_gateway_url` | http://localhost:3000 | No |
| `test_user_email` | alice@example.com | No |
| `test_user_password` | SecurePass123! | No |
| `second_user_email` | bob@example.com | No |
| `second_user_password` | SecurePass456! | No |
| `topup_amount` | 1000.00 | No |
| `transfer_amount` | 250.50 | No |
| `jwt_token` | (empty initially) | **Yes** - After Alice login |
| `jwt_token_user2` | (empty initially) | **Yes** - After Bob login |
| `user_id` | (empty initially) | **Yes** - After Alice login |
| `user_id_2` | (empty initially) | **Yes** - After Bob login |

---

## Quick Start Testing

Run these requests in order to verify the system is working:

1. **Register Alice**: `Authentication > Register New User (Alice)`
2. **Register Bob**: `Authentication > Register New User (Bob)`
3. **Login Alice**: `Authentication > Login (Alice)` ← Auto-saves token
4. **Login Bob**: `Authentication > Login (Bob)` ← Auto-saves token
5. **Check Alice Wallet**: `Wallet Operations > Get Wallet (Alice)`
6. **Top-up Alice**: `Wallet Operations > Top-up Wallet (Alice)`
7. **Top-up Bob**: `Wallet Operations > Top-up Wallet (Bob)`
8. **Send Money**: `Transactions > Send Money (Alice to Bob)`
9. **Check Transactions**: `Transactions > Get User Transactions (Alice)`

---

## Complete 11-Step Workflow

### Phase 1: User Registration (Steps 1-2)

#### Step 1: Register Alice

**Endpoint**: `POST /api/user-service/users`

Request body:
```json
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "password": "SecurePass123!"
}
```

Expected response (201 Created):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "message": "User registered successfully"
  }
}
```

#### Step 2: Register Bob

**Endpoint**: `POST /api/user-service/users`

Request body:
```json
{
  "name": "Bob Smith",
  "email": "bob@example.com",
  "password": "SecurePass456!"
}
```

Expected response (201 Created):
```json
{
  "success": true,
  "data": {
    "id": 2,
    "message": "User registered successfully"
  }
}
```

### Phase 2: Authentication & JWT (Steps 3-4)

#### Step 3: Login as Alice

**Endpoint**: `POST /api/user-service/users/login`

Request body:
```json
{
  "email": "alice@example.com",
  "password": "SecurePass123!"
}
```

Expected response (200 OK):
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": 1,
    "name": "Alice Johnson",
    "email": "alice@example.com"
  }
}
```

**Postman Action**: 
- Token saved to `{{jwt_token}}`
- User ID saved to `{{user_id}}`

#### Step 4: Login as Bob

**Endpoint**: `POST /api/user-service/users/login`

Request body:
```json
{
  "email": "bob@example.com",
  "password": "SecurePass456!"
}
```

Expected response (200 OK):
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": 2,
    "name": "Bob Smith",
    "email": "bob@example.com"
  }
}
```

**Postman Action**:
- Token saved to `{{jwt_token_user2}}`
- User ID saved to `{{user_id_2}}`

### Phase 3: Check Wallets (Steps 5-6)

#### Step 5: Check Alice's Wallet

**Endpoint**: `GET /api/wallet-service/wallets`

Headers:
- `Authorization: Bearer {{jwt_token}}`
- `x-user-id: {{user_id}}`

Expected response (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "balance": 0.00,
    "createdAt": "2025-11-15T10:00:00Z"
  }
}
```

#### Step 6: Check Bob's Wallet

**Endpoint**: `GET /api/wallet-service/wallets`

Headers:
- `Authorization: Bearer {{jwt_token_user2}}`
- `x-user-id: {{user_id_2}}`

Expected response (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 2,
    "userId": 2,
    "balance": 0.00,
    "createdAt": "2025-11-15T10:00:00Z"
  }
}
```

### Phase 4: Top-up Operations (Steps 7-8)

#### Step 7: Alice Top-up 1000.00

**Endpoint**: `POST /api/wallet-service/wallets/topup`

Headers:
- `Authorization: Bearer {{jwt_token}}`
- `x-user-id: {{user_id}}`

Request body:
```json
{
  "amount": 1000.00
}
```

Expected response (200 OK):
```json
{
  "success": true,
  "message": "Top-up successful",
  "data": {
    "id": 1,
    "userId": 1,
    "balance": 1000.00,
    "updatedAt": "2025-11-15T10:05:00Z"
  }
}
```

#### Step 8: Bob Top-up 500.00

**Endpoint**: `POST /api/wallet-service/wallets/topup`

Headers:
- `Authorization: Bearer {{jwt_token_user2}}`
- `x-user-id: {{user_id_2}}`

Request body:
```json
{
  "amount": 500.00
}
```

Expected response (200 OK):
```json
{
  "success": true,
  "message": "Top-up successful",
  "data": {
    "id": 2,
    "userId": 2,
    "balance": 500.00,
    "updatedAt": "2025-11-15T10:05:00Z"
  }
}
```

### Phase 5: Peer-to-Peer Transaction (Step 9)

#### Step 9: Alice Sends 250.50 to Bob

**Endpoint**: `POST /api/transaction-service/transactions/send`

Headers:
- `Authorization: Bearer {{jwt_token}}`
- `x-user-id: {{user_id}}`

Request body:
```json
{
  "recipient_id": 2,
  "amount": 250.50
}
```

Expected response (200 OK):
```json
{
  "success": true,
  "message": "Money sent successfully",
  "data": {
    "id": 1
  }
}
```

**What happens internally**:
1. Alice's balance decreases: 1000.00 → 749.50
2. Bob's balance increases: 500.00 → 750.50
3. Transaction record created
4. Both users receive notifications

### Phase 6: Verification (Steps 10-11)

#### Step 10: Alice Check Transaction History

**Endpoint**: `GET /api/transaction-service/transactions/user`

Headers:
- `Authorization: Bearer {{jwt_token}}`
- `x-user-id: {{user_id}}`

Expected response (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "type": "send",
      "amount": 250.50,
      "recipientId": 2,
      "status": "completed",
      "createdAt": "2025-11-15T10:10:00Z"
    }
  ]
}
```

#### Step 11: Verify Final Balances

**Alice's Balance** (GET `/api/wallet-service/wallets`):
```json
{
  "success": true,
  "data": {
    "userId": 1,
    "balance": 749.50
  }
}
```

**Bob's Balance** (GET `/api/wallet-service/wallets`):
```json
{
  "success": true,
  "data": {
    "userId": 2,
    "balance": 750.50
  }
}
```

---

## API Endpoints Reference

### User Service (via `/api/user-service`)

| Method | Endpoint | Auth | Body | Description |
|--------|----------|------|------|-------------|
| POST | `/users` | No | `{name, email, password}` | Register new user |
| POST | `/users/login` | No | `{email, password}` | Login and get JWT |
| GET | `/users` | No | - | List all users |
| GET | `/users/:id` | No | - | Get user by ID |
| GET | `/health` | No | - | Service health check |

**Full URLs via Gateway:**
- `POST http://localhost:3000/api/user-service/users`
- `POST http://localhost:3000/api/user-service/users/login`

### Wallet Service (via `/api/wallet-service`)

| Method | Endpoint | Auth | Body | Description |
|--------|----------|------|------|-------------|
| GET | `/wallets` | Yes | - | Get user's wallet |
| POST | `/wallets/topup` | Yes | `{amount}` | Add funds to wallet |
| POST | `/wallets/withdraw` | Yes | `{amount}` | Withdraw funds |
| GET | `/health` | No | - | Service health check |

**Full URLs via Gateway:**
- `GET http://localhost:3000/api/wallet-service/wallets`
- `POST http://localhost:3000/api/wallet-service/wallets/topup`
- `POST http://localhost:3000/api/wallet-service/wallets/withdraw`

### Transaction Service (via `/api/transaction-service`)

| Method | Endpoint | Auth | Body | Description |
|--------|----------|------|------|-------------|
| POST | `/transactions/send` | Yes | `{recipient_id, amount}` | Send money to user |
| GET | `/transactions/user` | Yes | - | Get user's transactions |
| GET | `/transactions` | No | - | Get all transactions |
| GET | `/transactions/:id` | No | - | Get specific transaction |
| GET | `/health` | No | - | Service health check |

**Full URLs via Gateway:**
- `POST http://localhost:3000/api/transaction-service/transactions/send`
- `GET http://localhost:3000/api/transaction-service/transactions/user`

### Notification Service (via `/api/notification-service`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/notifications` | Yes | Get user's notifications |
| GET | `/notifications/all` | No | Get all notifications |
| GET | `/health` | No | Service health check |

**Full URLs via Gateway:**
- `GET http://localhost:3000/api/notification-service/notifications`

### Gateway Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | No | Check gateway status |
| GET | `/health/services` | No | Check all services health |

---

## Error Testing Guide

### Test 1: Invalid Credentials

**Endpoint**: `POST /api/user-service/users/login`

Request:
```json
{
  "email": "alice@example.com",
  "password": "WrongPassword123!"
}
```

Expected response (401 Unauthorized):
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### Test 2: Missing JWT Header

**Endpoint**: `GET /api/wallet-service/wallets` (without Authorization header)

Expected response (401):
```json
{
  "success": false,
  "message": "Access denied. Token missing."
}
```

### Test 3: Insufficient Balance

**Endpoint**: `POST /api/transaction-service/transactions/send`

Request:
```json
{
  "recipient_id": 2,
  "amount": 5000.00
}
```

Expected response (400 Bad Request):
```json
{
  "success": false,
  "message": "Insufficient balance"
}
```

### Test 4: Send to Yourself

**Endpoint**: `POST /api/transaction-service/transactions/send`

Request:
```json
{
  "recipient_id": 1,
  "amount": 100.00
}
```

Expected response (400 Bad Request):
```json
{
  "success": false,
  "message": "Cannot send to yourself"
}
```

### Test 5: Duplicate Registration

**Endpoint**: `POST /api/user-service/users`

Request:
```json
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "password": "SecurePass123!"
}
```

Expected response (400 Bad Request):
```json
{
  "success": false,
  "message": "Email already exists"
}
```

### Test 6: Missing Required Fields

**Endpoint**: `POST /api/user-service/users`

Request (missing name):
```json
{
  "email": "test@example.com",
  "password": "SecurePass123!"
}
```

Expected response (400 Bad Request):
```json
{
  "success": false,
  "message": "Missing required fields"
}
```

### Test 7: Invalid Amount (Zero)

**Endpoint**: `POST /api/wallet-service/wallets/topup`

Request:
```json
{
  "amount": 0
}
```

Expected response (400 Bad Request):
```json
{
  "success": false,
  "message": "Invalid amount"
}
```

---

## Troubleshooting

### Issue: "Access denied. Token missing."

**Cause**: Missing `Authorization` header on protected endpoint

**Solution**: 
1. Ensure you're logged in (run Login request first)
2. Check that `jwt_token` or `jwt_token_user2` has been populated
3. Add `Authorization: Bearer {{jwt_token}}` header to request

### Issue: "Invalid or expired token."

**Cause**: Token expired (after 1 hour) or invalid

**Solution**: 
1. Login again to get fresh token
2. Verify `JWT_SECRET` in `.env.local` matches across all services

### Issue: "User ID not found in token"

**Cause**: Missing `x-user-id` header on protected endpoint

**Solution**:
1. Add both headers:
   - `Authorization: Bearer {{jwt_token}}`
   - `x-user-id: {{user_id}}`

### Issue: "Insufficient balance"

**Cause**: Trying to send/withdraw more than available

**Solution**:
1. Complete top-up operations first
2. Check current balance: `GET /api/wallet-service/wallets`
3. Ensure transfer amount ≤ available balance

### Issue: "Cannot send to yourself"

**Cause**: Sender and recipient IDs are the same

**Solution**: Use different user IDs for sender and recipient

### Issue: "Email already exists"

**Cause**: Attempting to register duplicate email

**Solution**: Use different email addresses

### Issue: Endpoints return 404

**Cause**: Wrong endpoint path (missing `/api/service-name/` prefix)

**Solution**: All endpoints must use pattern: `/api/service-name/endpoint-path`

**Examples:**
- ✅ `/api/user-service/users` 
- ✅ `/api/wallet-service/wallets/topup`
- ✅ `/api/transaction-service/transactions/send`
- ❌ `/users` (missing prefix)
- ❌ `/user-service/users` (missing `/api/`)

### Issue: Service unavailable (503)

**Cause**: One or more backend services not running

**Solution**:
1. Check service status: `GET /health/services`
2. Start services: `npm run dev` in each service directory
3. Verify all services running on correct ports

### Issue: Database Locked error

**Cause**: SQLite database locked from previous crash

**Solution**:
1. Stop all services
2. Delete `.db-shm` and `.db-wal` files in each service db folder
3. Restart services

---

## Security Features

✅ **Password Security**
- Bcrypt hashing with 10 salt rounds
- Passwords never stored or transmitted in plaintext
- Minimum 8 characters required

✅ **JWT Authentication**
- 1-hour token expiry (HS256 algorithm)
- Tokens verified at API Gateway
- User context passed to services via `x-user-id` header

✅ **Authorization**
- Public endpoints: Registration, login, health checks
- Protected endpoints: All wallet, transaction, notification operations
- Token verification middleware in gateway

✅ **Environment Variables**
- All secrets (JWT_SECRET, database paths, URLs) from `.env.local`
- Never hardcoded in source code
- Different values for development/production

✅ **Database Security**
- SQLite3 with WAL (Write-Ahead Logging) mode
- 5-second busy timeout for concurrent access
- Automatic transaction handling

✅ **Network Security**
- CORS configured for service-to-service communication
- API Gateway as single entry point
- Request validation on all endpoints

---

## Quick Reference

### Variable Shortcuts

Copy these into your environment for quick testing:

| Variable | Value |
|----------|-------|
| `{{api_gateway_url}}` | http://localhost:3000 |
| `{{test_user_email}}` | alice@example.com |
| `{{test_user_password}}` | SecurePass123! |
| `{{second_user_email}}` | bob@example.com |
| `{{second_user_password}}` | SecurePass456! |
| `{{topup_amount}}` | 1000.00 |
| `{{transfer_amount}}` | 250.50 |

### Header Templates

**Public Endpoints** (No auth needed):
```
Content-Type: application/json
```

**Protected Endpoints** (Auth required):
```
Content-Type: application/json
Authorization: Bearer {{jwt_token}}
x-user-id: {{user_id}}
```

---

## Next Steps

1. ✅ Import collection and environment into Postman
2. ✅ Run Quick Start Testing to verify system
3. ✅ Complete the 11-step workflow
4. ✅ Test error scenarios
5. Monitor service logs for any issues
6. Deploy to staging/production
7. Update production environment variables

---

**Last Updated**: 2025-11-15  
**Collection Version**: Final (Corrected)  
**Status**: ✅ Ready for Production Testing  
**Format**: Postman Collection v2.1 + Environment Configuration
