# 🚀 Setup & Installation Guide - E-Wallet System

Panduan lengkap untuk setup dan menjalankan E-Wallet System dengan 4 microservices.

## 📋 Prerequisites

Sebelum memulai, pastikan sudah install:

### 1. Node.js & npm

**Download**: https://nodejs.org/ (LTS version)

**Verifikasi**:
```bash
node --version
npm --version
```

### 2. Python & pip

**Download**: https://www.python.org/ (3.8 atau lebih baru)

**Verifikasi**:
```bash
python --version
pip --version
```

## 🎯 Installation Steps

### Step 1: Clone atau Extract Project

Extract file project ke folder:
```
C:\Users\Pongo\Documents\UTS IAE FINAL\e-wallet-project
```

### Step 2: Setup API Gateway

```bash
# Navigate ke folder
cd api-gateway

# Install dependencies
npm install

# Verify installation
npm list
```

**Output yang diharapkan**: List dari packages yang terinstall

### Step 3: Setup User Service

```bash
# Navigate ke folder
cd ../user-service

# Install dependencies
pip install -r requirements.txt

# Verify installation
pip list | find "Flask"
```

### Step 4: Setup Wallet Service

```bash
# Navigate ke folder
cd ../wallet-service

# Install dependencies
pip install -r requirements.txt
```

### Step 5: Setup Transaction Service

```bash
# Navigate ke folder
cd ../transaction-service

# Install dependencies
pip install -r requirements.txt
```

### Step 6: Setup Notification Service

```bash
# Navigate ke folder
cd ../notification-service

# Install dependencies
pip install -r requirements.txt
```

## 🎬 Running the Application

### Option A: Otomatis (Windows)

```bash
# Di root folder project
start-all.bat
```

Ini akan membuka 5 terminal baru dan menjalankan semua service.

### Option B: Otomatis (Mac/Linux)

```bash
# Di root folder project
chmod +x start-all.sh
./start-all.sh
```

### Option C: Manual (Recommended untuk development)

Buka 5 terminal berbeda dan jalankan:

**Terminal 1 - API Gateway**:
```bash
cd api-gateway
npm run dev
```

Output:
```
🚀 API Gateway running on http://localhost:3000
📚 Login endpoint: POST http://localhost:3000/auth/login
📚 Register endpoint: POST http://localhost:3000/auth/register
🏥 Health check: GET http://localhost:3000/health
```

**Terminal 2 - User Service**:
```bash
cd user-service
python app.py
```

Output:
```
🚀 User Service running on http://localhost:3001
📚 API Docs: http://localhost:3001/api-docs
```

**Terminal 3 - Wallet Service**:
```bash
cd wallet-service
python app.py
```

Output:
```
🚀 Wallet Service running on http://localhost:3002
📚 API Docs: http://localhost:3002/api-docs
```

**Terminal 4 - Transaction Service**:
```bash
cd transaction-service
python app.py
```

Output:
```
🚀 Transaction Service running on http://localhost:3003
📚 API Docs: http://localhost:3003/api-docs
```

**Terminal 5 - Notification Service**:
```bash
cd notification-service
python app.py
```

Output:
```
🚀 Notification Service running on http://localhost:3004
📚 API Docs: http://localhost:3004/api-docs
```

## 🌐 Akses Aplikasi

Setelah semua service running:

### Frontend
- **Login Page**: Open `frontend/index.html` di browser
- **URL**: `file:///C:/Users/Pongo/Documents/UTS%20IAE%20FINAL/e-wallet-project/frontend/index.html`

### API Docs (Swagger)
- **User Service**: http://localhost:3001/api-docs
- **Wallet Service**: http://localhost:3002/api-docs
- **Transaction Service**: http://localhost:3003/api-docs
- **Notification Service**: http://localhost:3004/api-docs

### Health Check
- **API Gateway**: http://localhost:3000/health
- **User Service**: http://localhost:3001/health
- **Wallet Service**: http://localhost:3002/health
- **Transaction Service**: http://localhost:3003/health
- **Notification Service**: http://localhost:3004/health

## 🔑 Default Credentials

```
Username: admin
Password: admin123
```

## ✅ Verification Checklist

Pastikan semua service berjalan dengan benar:

- [ ] API Gateway running di port 3000
- [ ] User Service running di port 3001
- [ ] Wallet Service running di port 3002
- [ ] Transaction Service running di port 3003
- [ ] Notification Service running di port 3004
- [ ] Bisa akses `http://localhost:3000/health` (200 OK)
- [ ] Bisa akses `http://localhost:3001/health` (200 OK)
- [ ] Bisa akses `http://localhost:3002/health` (200 OK)
- [ ] Bisa akses `http://localhost:3003/health` (200 OK)
- [ ] Bisa akses `http://localhost:3004/health` (200 OK)
- [ ] Bisa login di frontend dengan admin/admin123
- [ ] Dashboard menampilkan wallet balance
- [ ] Bisa melihat transactions

## 🧪 First Test

### 1. Login

1. Buka `frontend/index.html`
2. Masukkan username: `admin`
3. Masukkan password: `admin123`
4. Klik "Login"
5. Verifikasi: Redirect ke dashboard

### 2. Check Balance

1. Di dashboard, cek "Wallet Balance"
2. Verifikasi: Menampilkan nilai Rp 1,000,000

### 3. View Transactions

1. Scroll ke section "Transaction History"
2. Verifikasi: Tidak ada transaksi (empty state)

### 4. View Notifications

1. Lihat section "Recent Notifications"
2. Verifikasi: Tidak ada notifikasi (empty state)

## 🔧 Troubleshooting

### Port Already in Use

**Error**: `Address already in use :::3000`

**Solution**:
```bash
# Windows - Find process using port
netstat -ano | findstr :3000

# Kill process
taskkill /PID <PID> /F

# Or change port in .env file
```

### Module Not Found

**Error**: `ModuleNotFoundError: No module named 'flask'`

**Solution**:
```bash
# Ensure pip packages are installed
pip install -r requirements.txt

# Or manually install
pip install Flask Flask-SQLAlchemy Flask-CORS Flask-RESTX
```

### Cannot Connect to API

**Error**: `Connection error. Make sure API Gateway is running.`

**Solution**:
1. Verify API Gateway is running: `npm run dev`
2. Check port 3000: `http://localhost:3000/health`
3. Check browser console (F12) untuk error details
4. Verify CORS configuration

### Database Locked

**Error**: `database is locked`

**Solution**:
1. Stop all services
2. Delete `.db` files
3. Restart services (database akan auto-create)

### JWT Token Invalid

**Error**: `Invalid or expired token`

**Solution**:
1. Logout dan login ulang
2. Clear localStorage: 
   ```javascript
   localStorage.clear()
   ```
3. Refresh halaman

## 📁 Database Files

Setiap service akan membuat file database:

```
user-service/
├── users.db             ← Auto-created saat startup
wallet-service/
├── wallets.db           ← Auto-created saat startup
transaction-service/
├── transactions.db      ← Auto-created saat startup
notification-service/
├── notifications.db     ← Auto-created saat startup
```

### Reset Database

Untuk reset semua data:

```bash
# Windows
del user-service\users.db
del wallet-service\wallets.db
del transaction-service\transactions.db
del notification-service\notifications.db

# Mac/Linux
rm user-service/users.db
rm wallet-service/wallets.db
rm transaction-service/transactions.db
rm notification-service/notifications.db
```

Restart services untuk auto-create database baru dengan sample data.

## 🌍 Environment Variables

### API Gateway (.env)
```env
PORT=3000
JWT_SECRET=your-very-secret-jwt-key-change-this-in-production
NODE_ENV=development
USER_SERVICE_URL=http://localhost:3001
WALLET_SERVICE_URL=http://localhost:3002
TRANSACTION_SERVICE_URL=http://localhost:3003
NOTIFICATION_SERVICE_URL=http://localhost:3004
```

### User Service (.env)
```env
PORT=3001
SECRET_KEY=user-service-secret-key
DATABASE_URL=sqlite:///users.db
SERVICE_NAME=user-service
```

### Wallet Service (.env)
```env
PORT=3002
SECRET_KEY=wallet-service-secret-key
DATABASE_URL=sqlite:///wallets.db
SERVICE_NAME=wallet-service
USER_SERVICE_URL=http://localhost:3001
```

### Transaction Service (.env)
```env
PORT=3003
SECRET_KEY=transaction-service-secret-key
DATABASE_URL=sqlite:///transactions.db
SERVICE_NAME=transaction-service
WALLET_SERVICE_URL=http://localhost:3002
NOTIFICATION_SERVICE_URL=http://localhost:3004
```

### Notification Service (.env)
```env
PORT=3004
SECRET_KEY=notification-service-secret-key
DATABASE_URL=sqlite:///notifications.db
SERVICE_NAME=notification-service
```

## 🛑 Stopping Services

### Automatic (start-all.bat)
- Tutup semua terminal yang terbuka
- Atau tekan Ctrl+C di setiap terminal

### Manual
- Tekan Ctrl+C di setiap terminal tempat service berjalan

## 📊 Monitoring Services

### Check Service Status

```bash
# Test semua health endpoints
curl http://localhost:3000/health
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health
curl http://localhost:3004/health
```

### View Logs

Logs ditampilkan di terminal tempat service berjalan. Lihat output untuk error atau warning messages.

## 🎓 Next Steps

Setelah setup berhasil:

1. **Read API Documentation**: `docs/API_DOCUMENTATION.md`
2. **Test dengan Postman**: Import `docs/Postman_Collection.json`
3. **Explore Features**: 
   - Login & Dashboard
   - Transfer Money
   - Top Up
   - View Transactions
   - Check Notifications
4. **Study Code**: Review masing-masing service untuk understand architecture
5. **Modify & Extend**: Tambahkan features baru sesuai requirement

## 🆘 Support

Jika ada masalah:

1. Check error messages di terminal
2. Check browser console (F12 → Console tab)
3. Check file ini (Troubleshooting section)
4. Review `docs/API_DOCUMENTATION.md`
5. Check individual service README files

## 📚 Documentation Files

- `README.md` - Overview
- `docs/API_DOCUMENTATION.md` - Complete API reference
- `docs/Postman_Collection.json` - Postman collection
- `frontend/README.md` - Frontend documentation
- `api-gateway/README.md` - API Gateway setup
- `user-service/README.md` - User Service setup
- `wallet-service/README.md` - Wallet Service setup
- `transaction-service/README.md` - Transaction Service setup
- `notification-service/README.md` - Notification Service setup

---

**Setup Complete! 🎉**

Happy Coding! 💻
