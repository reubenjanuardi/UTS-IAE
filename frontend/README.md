# Frontend - E-Wallet System

Frontend untuk E-Wallet System menggunakan HTML + JavaScript sederhana (Vanilla JS).

## 📁 File Structure

```
frontend/
├── index.html       - Login & Register page
├── dashboard.html   - Main dashboard
└── README.md        - Documentation
```

## 🎨 Features

### Login Page (index.html)

- **Login Tab**: Login dengan username & password
- **Register Tab**: Register akun baru
- **Credentials Storage**: Token dan user info disimpan di localStorage
- **Demo Account**: 
  - Username: `admin`
  - Password: `admin123`

### Dashboard (dashboard.html)

- **User Profile**: Menampilkan info user
- **Wallet Balance**: Saldo wallet real-time
- **Statistics**: 
  - Total transactions
  - Unread notifications
- **Transfer Money**: 
  - Transfer ke user lain
  - Top up wallet
- **Transaction History**: Riwayat transaksi
- **Notifications**: Notifikasi real-time

## 🚀 Cara Menggunakan

### 1. Buka Login Page

Buka file `index.html` di browser:
```
frontend/index.html
```

### 2. Login atau Register

**Login dengan demo account**:
- Username: `admin`
- Password: `admin123`

**Atau register akun baru**:
- Isi form registration
- Klik "Register"

### 3. Akses Dashboard

Setelah login, akan redirect ke `dashboard.html`

### 4. Gunakan Features

- **Lihat Balance**: Di kartu "Wallet Balance"
- **Transfer**: Isi user ID penerima dan jumlah
- **Top Up**: Isi jumlah top up
- **Lihat History**: Scroll di section "Transaction History"
- **Lihat Notifikasi**: Di sidebar "Recent Notifications"

## 🔧 Technical Details

### API Configuration

```javascript
const API_GATEWAY = 'http://localhost:3000';
```

Edit di kedua file jika API Gateway berjalan di port berbeda.

### Authentication Flow

```
1. User Login
   ↓
2. POST /auth/login ke API Gateway
   ↓
3. Terima JWT token
   ↓
4. Store token di localStorage
   ↓
5. Redirect ke dashboard.html
   ↓
6. Setiap request, include token di Authorization header
```

### Token Management

```javascript
// Store token
localStorage.setItem('token', data.token);
localStorage.setItem('user', JSON.stringify(data.user));

// Use token in requests
headers: {
  'Authorization': `Bearer ${localStorage.getItem('token')}`
}

// Clear on logout
localStorage.removeItem('token');
localStorage.removeItem('user');
```

### Real-time Updates

Dashboard auto-refresh setiap 10 detik:

```javascript
setInterval(() => {
  loadWalletBalance();
  loadTransactions();
  loadNotifications();
}, 10000);
```

## 📱 Responsive Design

- Desktop: Optimal view dengan grid layout
- Tablet: Adjusted spacing
- Mobile: Single column layout

## 🎨 UI/UX Features

- **Modern Design**: Gradient colors, smooth transitions
- **User Feedback**: Success/error messages
- **Loading States**: Visual feedback saat processing
- **Dark/Light**: Readable on all backgrounds
- **Icons**: Emojis untuk visual interest

## 🐛 Troubleshooting

### Token Not Found

```
Error: window.location.href is not defined
```

**Solution**: Make sure `index.html` is opened first, not `dashboard.html`

### API Gateway Connection Error

```
Connection error. Make sure API Gateway is running.
```

**Solution**: 
- Start API Gateway: `npm run dev` di folder `api-gateway`
- Check port 3000 is not used

### Balance Not Updating

- Check if wallet service is running
- Verify user has wallet created
- Check browser console for errors (F12)

### Transfer Failed

Common reasons:
- Recipient user ID tidak ada
- Saldo tidak cukup
- Network error

Check console (F12) untuk detail error.

## 🔒 Security Notes

### For Development
- Token stored in localStorage (acceptable for development)
- No HTTPS (acceptable for localhost development)

### For Production
- Use secure cookies with httpOnly flag
- Implement HTTPS
- Add CSRF protection
- Validate input more strictly
- Sanitize user input
- Implement rate limiting on frontend

## 📊 API Calls Flow

### Login Flow
```
User Input → Validation → POST /auth/login 
  → Get Token → Store Token → Redirect
```

### Transfer Flow
```
User Input → Validation → POST /transactions 
  → API Gateway → Transaction Service → Wallet Service 
  → Notification Service → Response → Update Dashboard
```

### Load Dashboard Flow
```
Page Load → Check Token → Load User Info → Load Balance 
  → Load Transactions → Load Notifications → Auto-refresh
```

## 🎓 Learning Points

1. **Fetch API**: Async HTTP requests
2. **LocalStorage**: Client-side data persistence
3. **JWT**: Token-based authentication
4. **DOM Manipulation**: Dynamic UI updates
5. **Event Handling**: User interactions
6. **Error Handling**: Graceful failure handling
7. **Responsive Design**: CSS Grid & Flexbox
8. **UX Best Practices**: Feedback & validation

## 📝 Code Structure

### index.html (Login Page)
```
- HTML Structure
- CSS Styling
- JavaScript Logic
  ├── Login Handler
  ├── Register Handler
  └── Tab Switching
```

### dashboard.html (Main App)
```
- HTML Structure
- CSS Styling
- JavaScript Logic
  ├── Authentication Check
  ├── Data Loading
  │   ├── loadWalletBalance()
  │   ├── loadTransactions()
  │   └── loadNotifications()
  ├── Transfer Logic
  │   ├── performTransfer()
  │   └── performTopup()
  └── UI Updates
```

## 🚀 Performance Tips

1. **Lazy Loading**: Load data on demand
2. **Caching**: Store frequently accessed data
3. **Debouncing**: Limit API calls on rapid actions
4. **Error Recovery**: Retry failed requests
5. **Local State**: Minimize server calls

## 📋 Checklist

- [ ] Buka index.html di browser
- [ ] Login dengan admin/admin123
- [ ] Lihat dashboard
- [ ] Cek balance menampilkan
- [ ] Lihat transaction history
- [ ] Lihat notifications
- [ ] Coba transfer ke user lain
- [ ] Coba top up
- [ ] Lihat update real-time
- [ ] Test logout

## 🔗 Related Files

- `API_DOCUMENTATION.md` - Complete API docs
- `Postman_Collection.json` - Postman testing
- API Gateway - `api-gateway/README.md`
- Services - `[service]/README.md`

---

**Frontend Version**: 1.0.0  
**Last Updated**: 2024  
**Browser Support**: Chrome, Firefox, Safari, Edge
