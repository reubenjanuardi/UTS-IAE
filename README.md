# E-Wallet System - Dokumentasi Lengkap

Sistem E-Wallet yang terintegrasi dengan 4 microservices yang berkomunikasi melalui API Gateway.

## 📋 Arsitektur Sistem

```
Frontend (HTML+JS) 
    ↓
API Gateway (Node.js)
    ↓
┌─────────────────────────────────────────┐
│  Service Layer                          │
├─────────────────────────────────────────┤
│ User Service  │ Wallet Service          │
│ Transaction   │ Notification Service    │
│ (Flask)       │ (Flask)                 │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│  Data Layer (SQLite)                    │
├─────────────────────────────────────────┤
│ users.db  │ wallets.db  │ transactions.db │
│ notifications.db                         │
└─────────────────────────────────────────┘
```

## 🚀 Quick Start

### ✅ Automatic Setup (Recommended)

Simply run:

**Windows**:
```bash
start-all.bat
```

**Mac/Linux**:
```bash
chmod +x start-all.sh
./start-all.sh
```

✨ **What happens automatically**:
- ✅ Databases created (if not exist)
- ✅ Dependencies installed
- ✅ All 5 services started
- ✅ Sample data loaded
- ✅ Ready to use in 30 seconds!

### Manual Setup (If Needed)

#### 1. Setup API Gateway

```bash
cd api-gateway
npm install
npm run dev
```

Service akan berjalan di `http://localhost:3000`

#### 2. Setup User Service

Buka terminal baru:

```bash
cd user-service
pip install -r requirements.txt
python app.py
```

Service akan berjalan di `http://localhost:3001`

### 3. Setup Wallet Service

Buka terminal baru:

```bash
cd wallet-service
pip install -r requirements.txt
python app.py
```

Service akan berjalan di `http://localhost:3002`

### 4. Setup Transaction Service

Buka terminal baru:

```bash
cd transaction-service
pip install -r requirements.txt
python app.py
```

Service akan berjalan di `http://localhost:3003`

### 5. Setup Notification Service

Buka terminal baru:

```bash
cd notification-service
pip install -r requirements.txt
python app.py
```

Service akan berjalan di `http://localhost:3004`

### 6. Buka Frontend

Buka `frontend/index.html` di browser

## 📝 Default Credentials

**Username**: `admin`  
**Password**: `admin123`

Atau bisa register akun baru melalui halaman registration.

## 🔗 API Endpoints

### Authentication (API Gateway)

```
POST /auth/login
POST /auth/register
GET /auth/verify
POST /auth/refresh
```

### User Service (Port 3001)

```
GET /users                           - Dapatkan semua user
POST /users                          - Buat user baru
GET /users/{id}                      - Dapatkan user by ID
PUT /users/{id}                      - Update user
DELETE /users/{id}                   - Hapus user
GET /internal/users/{user_id}        - Internal endpoint
GET /internal/users/{user_id}/validate - Validate user
```

### Wallet Service (Port 3002)

```
GET /wallets                                  - Dapatkan semua wallet
POST /wallets                                 - Buat wallet baru
GET /wallets/{id}                            - Dapatkan wallet by ID
PUT /wallets/{id}                            - Update wallet
GET /wallets/user/{user_id}                  - Dapatkan wallet by user ID
GET /internal/wallets/user/{user_id}/balance - Get balance
PUT /internal/wallets/user/{user_id}/balance - Update balance
```

### Transaction Service (Port 3003)

```
GET /transactions                       - Dapatkan semua transaksi
POST /transactions                      - Buat transaksi baru
GET /transactions/{id}                  - Dapatkan transaksi by ID
GET /transactions/user/{user_id}        - Dapatkan transaksi user
```

### Notification Service (Port 3004)

```
GET /notifications                            - Dapatkan semua notifikasi
POST /notifications                           - Buat notifikasi baru
GET /notifications/{id}                       - Dapatkan notifikasi by ID
DELETE /notifications/{id}                    - Hapus notifikasi
GET /notifications/user/{user_id}             - Dapatkan notifikasi user
GET /notifications/user/{user_id}/unread      - Dapatkan notifikasi unread
POST /internal/notifications                  - Internal create
PUT /internal/notifications/{id}/read         - Mark as read
```

## 🧪 Testing dengan Postman

### 1. Login

**Method**: POST  
**URL**: `http://localhost:3000/auth/login`

**Body**:
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@ewallet.com",
    "role": "admin"
  }
}
```

### 2. Get Wallets (dengan token)

**Method**: GET  
**URL**: `http://localhost:3000/api/wallet-service/wallets`

**Headers**:
```
Authorization: Bearer <token>
```

### 3. Create Transaction

**Method**: POST  
**URL**: `http://localhost:3000/api/transaction-service/transactions`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body**:
```json
{
  "from_user_id": 1,
  "to_user_id": 2,
  "amount": 100000,
  "type": "transfer",
  "description": "Transfer ke teman"
}
```

## 📊 Alur Transaksi

1. **Frontend** mengirim request transfer ke API Gateway
2. **API Gateway** memverifikasi JWT token
3. **Transaction Service** menerima request dan:
   - Validasi sender wallet balance
   - Deduct amount dari sender wallet
   - Add amount ke receiver wallet
   - Buat transaction record
4. **Notification Service** mengirim notifikasi ke sender dan receiver
5. **Frontend** menampilkan hasil transaksi

## 🗄️ Database Schema

### users.db (User Service)
```sql
id (primary key)
username (unique)
email (unique)
password (hashed)
full_name
phone
address
status
created_at
updated_at
```

### wallets.db (Wallet Service)
```sql
id (primary key)
user_id (foreign key)
balance
currency
status
created_at
updated_at
```

### transactions.db (Transaction Service)
```sql
id (primary key)
from_user_id
to_user_id
amount
type (transfer/topup/withdrawal)
description
status
reference_id
created_at
updated_at
```

### notifications.db (Notification Service)
```sql
id (primary key)
user_id
title
message
type
is_read
created_at
```

## 🛡️ Keamanan

- **JWT Authentication** untuk semua protected endpoints
- **Password hashing** menggunakan bcryptjs
- **Token expiration** 24 jam
- **CORS** enabled untuk development

## 📱 Frontend Features

- ✅ Login dan Register
- ✅ Dashboard dengan wallet balance
- ✅ Transfer antar user
- ✅ Top up wallet
- ✅ Transaction history
- ✅ Real-time notifications
- ✅ Responsive design

## 🐛 Troubleshooting

### Port sudah digunakan
Ubah port di file `.env` di masing-masing service

### Service tidak terhubung
- Pastikan semua service sudah running
- Check CORS di API Gateway
- Lihat console error di browser

### Database error
- Delete file `.db` untuk reset database
- Database akan automatically recreate

## 📚 Struktur Folder

```
e-wallet-project/
├── api-gateway/
│   ├── index.js
│   ├── package.json
│   ├── .env
│   └── README.md
├── user-service/
│   ├── app.py
│   ├── models.py
│   ├── config.py
│   ├── requirements.txt
│   ├── .env
│   └── README.md
├── wallet-service/
│   ├── app.py
│   ├── models.py
│   ├── config.py
│   ├── requirements.txt
│   ├── .env
│   └── README.md
├── transaction-service/
│   ├── app.py
│   ├── models.py
│   ├── config.py
│   ├── requirements.txt
│   ├── .env
│   └── README.md
├── notification-service/
│   ├── app.py
│   ├── models.py
│   ├── config.py
│   ├── requirements.txt
│   ├── .env
│   └── README.md
├── frontend/
│   ├── index.html (login page)
│   ├── dashboard.html (main dashboard)
│   └── README.md
└── README.md (this file)
```

## 🎓 Pembelajaran

Sistem ini mengimplementasikan konsep:

1. **Microservices Architecture** - Multiple independent services
2. **API Gateway Pattern** - Single entry point untuk semua requests
3. **Service-to-Service Communication** - Inter-service HTTP calls
4. **JWT Authentication** - Stateless auth mechanism
5. **Database per Service** - Each service has own database
6. **Event Notification** - Real-time notifications antar services
7. **Transaction Management** - Coordinated transactions across services

## 📝 Catatan

- Semua database menggunakan SQLite
- JWT token berlaku 24 jam
- Untuk production, gunakan HTTPS
- Implement proper error handling dan logging
- Add rate limiting untuk security

---

Dibuat untuk UTS IAE - E-Wallet System dengan 4 Microservices
