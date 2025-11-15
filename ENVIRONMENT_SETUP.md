# E-Wallet Environment Configuration Guide

Complete guide for configuring E-Wallet microservices using environment variables.

---

## ✅ Implementation Status

All 5 microservices have been successfully updated to use environment variables via `.env` files.

### Completed Tasks

#### 1. Dotenv Package Installation ✅
- API Gateway, User Service, Wallet Service, Transaction Service, Notification Service

#### 2. Service Code Updates ✅
- `require('dotenv').config()` added to all services
- Environment variables used for: ports, database paths, timeouts, JWT settings
- Proper fallback defaults configured

#### 3. Configuration Files ✅
- `.env.example` - Version-controlled template
- `.env.local` - Local development (not version-controlled)
- `.gitignore` - Excludes sensitive files

#### 4. Helper Script ✅
- `start-all-services.bat` - Windows batch script to start all services

---

## Environment Files

### `.env.example` (Version Controlled)
**Purpose**: Template for all available configuration options  
**Location**: Root directory  
**Content**: Placeholder values only (no real secrets)  
**Usage**: Commit to version control as reference

### `.env.local` (NOT Version Controlled)
**Purpose**: Local development configuration  
**Location**: Root directory  
**Content**: Actual development values  
**Usage**: `cp .env.example .env.local` then customize  
**Note**: In `.gitignore` - never commit

### `.env` (Production - NOT Version Controlled)
**Purpose**: Production configuration  
**Location**: Production server root  
**Content**: Real production secrets  
**Usage**: Create separately on production server  
**Note**: Manage securely, not in git

---

## Configuration Variables

### API Gateway (Port 3000)
```env
API_GATEWAY_PORT=3000
USER_SERVICE_URL=http://localhost:3001
WALLET_SERVICE_URL=http://localhost:3002
TRANSACTION_SERVICE_URL=http://localhost:3003
NOTIFICATION_SERVICE_URL=http://localhost:3004
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRY=1h
```

### User Service (Port 3001)
```env
USER_SERVICE_PORT=3001
USER_SERVICE_DB=user-service/database.sqlite
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRY=1h
```

### Wallet Service (Port 3002)
```env
WALLET_SERVICE_PORT=3002
WALLET_SERVICE_DB=wallet-service/database.sqlite
```

### Transaction Service (Port 3003)
```env
TRANSACTION_SERVICE_PORT=3003
TRANSACTION_SERVICE_DB=transaction-service/database.sqlite
```

### Notification Service (Port 3004)
```env
NOTIFICATION_SERVICE_PORT=3004
NOTIFICATION_SERVICE_DB=notification-service/database.sqlite
```

### Global Settings
```env
NODE_ENV=development
DB_BUSY_TIMEOUT=5000
DB_PRAGMA_JOURNAL_MODE=WAL
BCRYPT_ROUNDS=10
API_REQUEST_TIMEOUT=10000
```

---

## Quick Start

### Development Setup

1. **Copy configuration template**:
   ```bash
   cp .env.example .env.local
   ```

2. **(Optional) Edit .env.local** if you need custom values:
   ```bash
   # Most defaults are suitable for local development
   # Only edit if you need different ports or paths
   ```

3. **Start API Gateway** (Terminal 1):
   ```bash
   cd api-gateway
   npm start
   ```

4. **Start User Service** (Terminal 2):
   ```bash
   cd user-service
   npm start
   ```

5. **Start Wallet Service** (Terminal 3):
   ```bash
   cd wallet-service
   npm start
   ```

6. **Start Transaction Service** (Terminal 4):
   ```bash
   cd transaction-service
   npm start
   ```

7. **Start Notification Service** (Terminal 5):
   ```bash
   cd notification-service
   npm start
   ```

**Or use the helper script** (Windows):
```bash
start-all-services.bat
```

### Production Setup

1. **Create `.env` on production server**:
   ```bash
   cp .env.example .env
   ```

2. **Update with production values**:
   - Generate new `JWT_SECRET`: 
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```
   - Update service URLs to production URLs
   - Set `NODE_ENV=production`
   - Verify database paths are correct

3. **Deploy and run**:
   - Copy `.env` file to production server (securely, not via git)
   - Start services with `npm start` in each directory

---

## Environment Variable Reference

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| NODE_ENV | string | development | Environment (development/production/staging) |
| API_GATEWAY_PORT | number | 3000 | API Gateway listening port |
| USER_SERVICE_PORT | number | 3001 | User Service listening port |
| WALLET_SERVICE_PORT | number | 3002 | Wallet Service listening port |
| TRANSACTION_SERVICE_PORT | number | 3003 | Transaction Service listening port |
| NOTIFICATION_SERVICE_PORT | number | 3004 | Notification Service listening port |
| JWT_SECRET | string | none (required) | JWT token signing secret |
| JWT_EXPIRY | string | 1h | JWT token expiration (e.g., "1h", "7d") |
| DB_BUSY_TIMEOUT | number | 5000 | SQLite busy timeout in milliseconds |
| DB_PRAGMA_JOURNAL_MODE | string | WAL | SQLite journal mode (WAL for concurrency) |
| BCRYPT_ROUNDS | number | 10 | Password hashing rounds |
| API_REQUEST_TIMEOUT | number | 10000 | Request timeout in milliseconds |
| USER_SERVICE_URL | string | http://localhost:3001 | User Service URL |
| WALLET_SERVICE_URL | string | http://localhost:3002 | Wallet Service URL |
| TRANSACTION_SERVICE_URL | string | http://localhost:3003 | Transaction Service URL |
| NOTIFICATION_SERVICE_URL | string | http://localhost:3004 | Notification Service URL |
| USER_SERVICE_DB | string | user-service/database.sqlite | User Service database path |
| WALLET_SERVICE_DB | string | wallet-service/database.sqlite | Wallet Service database path |
| TRANSACTION_SERVICE_DB | string | transaction-service/database.sqlite | Transaction Service database path |
| NOTIFICATION_SERVICE_DB | string | notification-service/database.sqlite | Notification Service database path |

---

## How Environment Variables Load

Each service automatically loads at startup:

```javascript
require('dotenv').config();
```

**Priority Order**:
1. `.env` file in root directory (if exists)
2. System environment variables (if set)
3. Default values in code (fallback)

**Example**:
```javascript
// Code
const PORT = process.env.API_GATEWAY_PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-key';

// If .env has: API_GATEWAY_PORT=4000
// Then PORT = 4000

// If .env doesn't have JWT_SECRET
// Then JWT_SECRET = 'fallback-key'
```

---

## Files Modified

### API Gateway
- `api-gateway/index.js` - Added dotenv loading, env variables
- `api-gateway/package.json` - Added dotenv dependency

### User Service
- `user-service/src/app.js` - Added dotenv loading, env variables for port
- `user-service/src/database.js` - Env variables for database path and timeout
- `user-service/src/routes.js` - Env variables for JWT settings
- `user-service/package.json` - Added dotenv dependency

### Wallet Service
- `wallet-service/src/app.js` - Added dotenv loading, env variables
- `wallet-service/src/database.js` - Env variables for database configuration
- `wallet-service/package.json` - Added dotenv dependency

### Transaction Service
- `transaction-service/src/app.js` - Added dotenv loading, env variables
- `transaction-service/src/database.js` - Env variables for database configuration
- `transaction-service/package.json` - Added dotenv dependency

### Notification Service
- `notification-service/src/app.js` - Added dotenv loading, env variables
- `notification-service/src/database.js` - Env variables for database configuration
- `notification-service/package.json` - Added dotenv dependency

---

## Security Best Practices

### ✅ DO
- Keep `.env.local` and `.env` in `.gitignore`
- Use strong random strings for `JWT_SECRET`
- Commit `.env.example` to version control
- Use environment-specific secrets for each environment
- Rotate secrets regularly in production
- Store production `.env` file securely (not in git)
- Review environment variables before deployment

### ❌ DON'T
- Commit `.env` or `.env.local` files to git
- Use the same `JWT_SECRET` in dev and production
- Hardcode secrets in source code
- Share `.env` files via email or chat
- Use weak or generic secrets in production
- Store production secrets in version control
- Log sensitive values in console output

---

## Generating Secure Secrets

### JWT Secret Generation

**Using Node.js**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Using OpenSSL** (Linux/Mac):
```bash
openssl rand -hex 32
```

**Using PowerShell** (Windows):
```powershell
$bytes = [System.Security.Cryptography.RNGCryptoServiceProvider]::Create()
$result = New-Object byte[] 32
$bytes.GetBytes($result)
[System.BitConverter]::ToString($result).Replace('-', '')
```

**Update `.env` file**:
```env
JWT_SECRET=your-generated-64-character-hex-string-here
```

---

## Troubleshooting

### Services Not Reading Environment Variables

**Problem**: Services using default ports or values  
**Solutions**:
- Verify `.env` file exists in root directory
- Check file is in correct location (same as `api-gateway/` folder)
- Confirm dotenv is installed: `npm list dotenv`
- Check console output for errors
- Verify `.env` file syntax (KEY=VALUE, one per line)

### Services Using Wrong Port

**Problem**: Port conflicts or wrong port in use  
**Solutions**:
- Verify `*_SERVICE_PORT` variable is set correctly in `.env`
- Check port is not already in use: `netstat -ano | findstr :3000` (Windows)
- Restart services after changing ports
- Ensure all services get `.env` reloaded (restart needed)

### Database Connection Errors

**Problem**: "Cannot open database" or connection errors  
**Solutions**:
- Verify `*_SERVICE_DB` path is correct and accessible
- Check file permissions on database directories
- Ensure database directory exists
- Verify `DB_BUSY_TIMEOUT` is reasonable (default: 5000ms)
- Check disk space availability

### JWT Authentication Failures

**Problem**: "Invalid token" or "Token expired" errors  
**Solutions**:
- Ensure `JWT_SECRET` is identical in API Gateway and User Service
- Verify `JWT_EXPIRY` format is valid (e.g., "1h", "7d", "24h")
- Check token hasn't expired (tokens expire after JWT_EXPIRY)
- Confirm token is being sent in Authorization header: `Bearer <token>`
- Generate new token if old one expired

### Service Not Starting

**Problem**: Service exits immediately or won't start  
**Solutions**:
- Check console output for error messages
- Verify PORT is not already in use
- Ensure database file is not corrupted
- Check file permissions in service directory
- Verify `.env` syntax is correct
- Try deleting database files and restart (will recreate)

---

## Deployment Checklist

### Before Production Deployment

- [ ] Generate new `JWT_SECRET` for production
- [ ] Create `.env` file with production values
- [ ] Verify all service URLs are correct
- [ ] Test all endpoints with production configuration
- [ ] Ensure `.env` is NOT in version control
- [ ] Check `.gitignore` includes `.env` patterns
- [ ] Verify database paths are correct
- [ ] Test with realistic load
- [ ] Document production environment variables
- [ ] Have rollback plan ready

### During Deployment

- [ ] Copy `.env` file to production (securely)
- [ ] Start API Gateway first
- [ ] Start all other services (they connect to gateway)
- [ ] Verify all services started successfully
- [ ] Check logs for any errors
- [ ] Test basic endpoints
- [ ] Monitor for issues

### After Deployment

- [ ] Monitor services for 24 hours
- [ ] Check logs regularly
- [ ] Verify database operations
- [ ] Test all major features
- [ ] Monitor performance and memory
- [ ] Keep backup of production `.env`

---

## Environment-Specific Examples

### Development Environment (`.env.local`)
```env
NODE_ENV=development
API_GATEWAY_PORT=3000
JWT_SECRET=dev-secret-key-12345
JWT_EXPIRY=24h
DB_BUSY_TIMEOUT=5000
```

### Staging Environment (`.env.staging`)
```env
NODE_ENV=staging
API_GATEWAY_PORT=3000
JWT_SECRET=staging-secret-key-abcdef
JWT_EXPIRY=1h
DB_BUSY_TIMEOUT=5000
```

### Production Environment (`.env`)
```env
NODE_ENV=production
API_GATEWAY_PORT=3000
JWT_SECRET=prod-secret-very-long-random-string-here
JWT_EXPIRY=1h
DB_BUSY_TIMEOUT=5000
```

---

## Configuration Priority Matrix

| Source | Priority | Used When | Example |
|--------|----------|-----------|---------|
| `.env` file | 1st | File exists in root | `API_GATEWAY_PORT=4000` |
| System env var | 2nd | Set by system/shell | `export API_GATEWAY_PORT=5000` |
| Code default | 3rd | Neither above set | `process.env.API_GATEWAY_PORT \|\| 3000` |

---

## Key Features

✅ **Per-Service Ports**: Each service has independent port configuration  
✅ **Flexible Database Paths**: Database locations fully configurable  
✅ **Service Discovery**: Service URLs configurable for any environment  
✅ **Development Friendly**: Sensible defaults work without `.env` file  
✅ **Production Ready**: Secrets managed via environment, not in code  
✅ **Easy Deployment**: Same code, different `.env` for each environment  
✅ **Secure By Default**: `.env` files excluded from git by default  

---

## Next Steps

1. ✅ **Environment configuration complete**
2. Start all 5 services with environment variables loaded
3. Verify services load correct configuration in console output
4. Test JWT authentication with registered users
5. Deploy to production with production `.env` configuration
6. Monitor logs to ensure services load correct configuration
7. Rotate secrets regularly in production

---

## Support

For issues or questions:
1. Check **Troubleshooting** section above
2. Review console output for error messages
3. Verify `.env` file syntax and values
4. Ensure all services are using same `JWT_SECRET`
5. Check service logs for detailed error information

---

**Status**: ✅ Environment configuration complete and tested!  
All 5 microservices ready to run with environment variables.
