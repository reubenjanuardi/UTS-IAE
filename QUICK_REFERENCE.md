# 🚀 E-Wallet System - Quick Reference Guide

## ⚡ 30 Second Setup

### Windows
```bash
cd c:\Users\Pongo\Documents\UTS IAE FINAL\e-wallet-project
start-all.bat
# Buka browser: frontend/index.html
```

### Mac/Linux
```bash
cd ~/UTS\ IAE\ FINAL/e-wallet-project
chmod +x start-all.sh
./start-all.sh
# Buka browser: frontend/index.html
```

## 🔑 Quick Credentials
```
Username: admin
Password: admin123
```

## 📍 Service URLs

| Service | URL | Docs |
|---------|-----|------|
| API Gateway | http://localhost:3000 | /health |
| User Service | http://localhost:3001 | /api-docs |
| Wallet Service | http://localhost:3002 | /api-docs |
| Transaction Service | http://localhost:3003 | /api-docs |
| Notification Service | http://localhost:3004 | /api-docs |

## 🎯 Main Features

### Login
- Username: `admin` / Password: `admin123`
- Or register new account

### Dashboard
- View wallet balance
- Transfer to other users
- Top up wallet
- View transaction history
- Check notifications

### Transfer
1. Enter recipient User ID (e.g., 2)
2. Enter amount
3. Click "Send Money"

### Top Up
1. Enter amount
2. Click "Top Up Now"

## 📊 API Quick Reference

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Get Users
```bash
curl -X GET http://localhost:3000/api/user-service/users \
  -H "Authorization: Bearer <token>"
```

### Transfer Money
```bash
curl -X POST http://localhost:3000/api/transaction-service/transactions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "from_user_id":1,
    "to_user_id":2,
    "amount":50000,
    "type":"transfer",
    "description":"Test transfer"
  }'
```

## 🗄️ Database Files

After first run, these files are created:
```
user-service/users.db
wallet-service/wallets.db
transaction-service/transactions.db
notification-service/notifications.db
```

### Reset Databases
Delete `.db` files and restart services.

## ⚙️ Configuration

### API Gateway (.env)
```env
PORT=3000
JWT_SECRET=your-secret-key
USER_SERVICE_URL=http://localhost:3001
WALLET_SERVICE_URL=http://localhost:3002
TRANSACTION_SERVICE_URL=http://localhost:3003
NOTIFICATION_SERVICE_URL=http://localhost:3004
```

### Services (.env)
```env
PORT=<service_port>
DATABASE_URL=sqlite:///service.db
SERVICE_NAME=<service_name>
```

## 🧪 Testing

### Health Check
```bash
curl http://localhost:3000/health
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health
curl http://localhost:3004/health
```

### Import Postman Collection
1. Open Postman
2. Click "Import"
3. Select `docs/Postman_Collection.json`
4. Set `token` variable after login

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port already in use | Change port in .env or kill process |
| Module not found | Run `pip install -r requirements.txt` or `npm install` |
| Cannot login | Check API Gateway is running |
| Balance not updating | Restart wallet-service |
| Database locked | Stop services, delete .db files, restart |

## 📁 Important Files

| File | Purpose |
|------|---------|
| `frontend/index.html` | Login page |
| `frontend/dashboard.html` | Main application |
| `api-gateway/index.js` | API Gateway |
| `*/app.py` | Service applications |
| `*/models.py` | Database models |
| `docs/API_DOCUMENTATION.md` | API reference |
| `docs/SETUP_GUIDE.md` | Detailed setup |
| `README.md` | Project overview |

## 💡 Quick Tips

1. **Check Status**: Visit health endpoints
2. **View Logs**: Check terminal output
3. **Clear Token**: `localStorage.clear()` in browser console
4. **View Database**: SQLite browser or command line
5. **Test Endpoints**: Use Postman collection

## 🔗 Service Flow

### Transfer Example
```
Frontend
   ↓
API Gateway (JWT validation)
   ↓
Transaction Service
   ├→ Wallet Service (validate balance)
   ├→ Wallet Service (deduct amount)
   ├→ Wallet Service (add amount)
   └→ Notification Service (send notifications)
   ↓
Frontend (update dashboard)
```

## 📱 Frontend Pages

### index.html (Login)
- Login form
- Register form
- Demo credentials

### dashboard.html (Main)
- User profile
- Wallet balance
- Statistics cards
- Transfer form
- Top up form
- Transaction history
- Notifications

## 🔐 Authentication

```javascript
// Login and get token
const token = localStorage.getItem('token');

// Use in requests
fetch(url, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Logout
localStorage.removeItem('token');
localStorage.removeItem('user');
```

## 📈 Sample Test Scenario

1. **Login**: admin / admin123
2. **Check Balance**: Should be 1,000,000 IDR
3. **Transfer**: Send 50,000 to user ID 2
4. **Verify Balance**: Should be 950,000 IDR
5. **View History**: Transfer should appear
6. **Check Notifications**: Transfer notification received
7. **Login as User 2**: Should have received 50,000
8. **Top Up**: Add 200,000 to account

## 🎓 Architecture Overview

```
┌─────────────────────────────────────┐
│      Frontend (HTML+JS)              │
└────────────┬────────────────────────┘
             │
             ↓
┌─────────────────────────────────────┐
│    API Gateway (Node.js)             │
│  JWT Auth + Routing                 │
└─┬──────────┬──────────┬──────────┬──┘
  │          │          │          │
  ↓          ↓          ↓          ↓
┌────────┐┌────────┐┌─────────┐┌──────────┐
│User S. ││Wallet ││Trans. S ││Notif. S. │
│:3001   ││:3002  ││:3003    ││:3004     │
└────────┘└────────┘└─────────┘└──────────┘
```

## 🎯 Demo Talking Points

1. **Microservices Architecture**: 4 independent services
2. **API Gateway**: Single entry point with JWT
3. **Service Communication**: Real-time inter-service calls
4. **Database per Service**: Scalable design
5. **Complete Features**: Login, Transfer, Top-up, Notifications
6. **Modern Frontend**: Responsive UI with real-time updates
7. **Full Documentation**: API docs + Postman + Setup guide

## ❓ Common Questions

**Q: Where's the database?**  
A: SQLite files auto-created in service folders

**Q: How do I reset?**  
A: Delete .db files and restart

**Q: Can I change ports?**  
A: Yes, edit .env files in each service

**Q: How to test API?**  
A: Use Postman collection in docs/

**Q: Where's the documentation?**  
A: Check docs/ folder and README.md

## 📞 Support Quick Links

- **Setup Issues**: See `docs/SETUP_GUIDE.md`
- **API Questions**: See `docs/API_DOCUMENTATION.md`
- **Code Reference**: See individual service README.md
- **Architecture**: See `PROJECT_SUMMARY.md`

---

**Everything you need to know in one page! 📄**

**Next Step**: Run `start-all.bat` and open `frontend/index.html` 🚀
