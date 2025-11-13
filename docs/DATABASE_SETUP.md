# 🗄️ Database Setup Guide

## Overview
The E-Wallet system uses SQLite databases, one for each microservice. These databases are automatically created when each service starts for the first time.

## 📁 Database Files Location

Each service has its own SQLite database file:

```
e-wallet-project/
├── user-service/users.db
├── wallet-service/wallets.db
├── transaction-service/transactions.db
└── notification-service/notifications.db
```

## 🔧 Automatic Database Creation

### Option 1: Auto-Create on Startup (Recommended)
The `start-all.bat` (Windows) and `start-all.sh` (Mac/Linux) scripts automatically create databases if they don't exist.

Simply run:
- **Windows**: `start-all.bat`
- **Mac/Linux**: `./start-all.sh`

### Option 2: Manual Database Creation

#### Windows
```bash
create-databases.bat
```

#### Mac/Linux
```bash
chmod +x create-databases.sh
./create-databases.sh
```

#### Manual Python
You can manually create each database:

```bash
cd user-service
python -c "from config import Config; from models import db; from app import app, create_tables; app.app_context().push(); create_tables()"
cd ..
```

## 📊 Database Schema

### users.db (User Service)
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL,
    full_name VARCHAR(150),
    phone VARCHAR(20),
    address VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### wallets.db (Wallet Service)
```sql
CREATE TABLE wallets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    balance FLOAT DEFAULT 0.0,
    currency VARCHAR(10) DEFAULT 'IDR',
    status VARCHAR(20) DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### transactions.db (Transaction Service)
```sql
CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_user_id INTEGER NOT NULL,
    to_user_id INTEGER,
    amount FLOAT NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'completed',
    reference_id VARCHAR(100) UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### notifications.db (Notification Service)
```sql
CREATE TABLE notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🌱 Sample Data

When databases are created, the following sample data is automatically added:

### Sample Users
| ID | Username | Email | Password | Balance (IDR) |
|----|---------|---------|---------|----|
| 1 | admin | admin@example.com | admin123 | 1,000,000 |
| 2 | john_doe | john@example.com | password123 | 500,000 |
| 3 | jane_smith | jane@example.com | password123 | 750,000 |

### Default Login Credentials
```
Username: admin
Password: admin123
```

## 🔄 Database Initialization Process

1. **Config Initialization**
   - `config.py` sets database URI with absolute path
   - Path example: `sqlite:///C:/Users/Pongo/.../user-service/users.db`

2. **Database Creation**
   - `create_tables()` function called on startup
   - SQLAlchemy creates all tables based on models
   - Sample data inserted if database is empty

3. **Service Connection**
   - Each service connects to its database
   - Health check endpoint confirms connection

## ⚠️ Troubleshooting

### Database Not Created
**Problem**: Database file (.db) doesn't appear in service folder

**Solution**:
1. Check Python is installed: `python --version`
2. Install requirements: `pip install -r requirements.txt`
3. Verify paths in `config.py`
4. Run service manually: `python app.py`
5. Check terminal output for errors

### Permission Denied
**Problem**: "Permission denied" error when creating database

**Solution**:
1. Check folder write permissions
2. Run terminal as Administrator (Windows)
3. Change folder ownership (Linux/Mac): `chmod -R 755 service-folder`

### Database Locked
**Problem**: "Database is locked" error

**Solution**:
1. Stop all services: Ctrl+C in all terminals
2. Wait 5 seconds
3. Restart services: `start-all.bat` or `./start-all.sh`

### Corrupted Database
**Problem**: Service crashes with database error

**Solution**:
1. Stop all services
2. Delete all `.db` files in each service folder
3. Restart services - new databases will be created automatically
4. Sample data will be re-initialized

## 🔍 Verifying Database Creation

### Check Files Exist
**Windows**:
```bash
dir user-service\*.db
dir wallet-service\*.db
dir transaction-service\*.db
dir notification-service\*.db
```

**Mac/Linux**:
```bash
ls user-service/*.db
ls wallet-service/*.db
ls transaction-service/*.db
ls notification-service/*.db
```

### Check Database Content
Use SQLite browser or command:

```bash
sqlite3 user-service/users.db
> .tables
> .schema users
> SELECT * FROM users;
```

### Check via API
Once services are running:

```bash
# User Service
curl http://localhost:3001/users

# Wallet Service
curl http://localhost:3002/wallets

# Transaction Service
curl http://localhost:3003/transactions

# Notification Service
curl http://localhost:3004/notifications
```

## 📝 Database Configuration

### Environment Variables (.env)
Database paths are configured in each service's `.env`:

```
# user-service/.env
DATABASE_URL=sqlite:///users.db
```

### Manual Configuration
Edit `config.py` to change database path:

```python
# Absolute path
SQLALCHEMY_DATABASE_URI = 'sqlite:////home/user/my-db/users.db'

# Relative path
SQLALCHEMY_DATABASE_URI = 'sqlite:///users.db'
```

## 🚀 Quick Start

### First Time Setup
```bash
# Windows
start-all.bat

# Mac/Linux
chmod +x start-all.sh
./start-all.sh
```

**What happens**:
1. Databases are created automatically
2. Sample data is inserted
3. All services start
4. System is ready to use

### After Restart
```bash
# Simply run the same command
# Databases persist - no re-initialization needed
start-all.bat
```

## 📦 Backup Database

### Windows
```bash
REM Backup to desktop
copy user-service\users.db %USERPROFILE%\Desktop\users_backup.db
```

### Mac/Linux
```bash
# Backup to current directory
cp user-service/users.db ./users_backup.db
```

## 🔐 Database Security Notes

- Sample passwords are hashed with bcrypt
- Passwords never stored in plain text
- SQLite files contain sensitive data - protect with permissions
- In production, use PostgreSQL or MySQL instead

## 📚 Related Documentation

- [README.md](../README.md) - Main project documentation
- [SETUP_GUIDE.md](../docs/SETUP_GUIDE.md) - Detailed setup instructions
- [API_DOCUMENTATION.md](../docs/API_DOCUMENTATION.md) - API reference

## ✅ Checklist

- [ ] All .db files exist in service folders
- [ ] Services start without database errors
- [ ] Sample data loads correctly
- [ ] Login works with admin/admin123
- [ ] Dashboard displays wallet balance
- [ ] Can perform transactions

---

**Last Updated**: 2024  
**Status**: ✅ Complete
