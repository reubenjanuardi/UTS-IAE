# Notification Service - E-Wallet System

Notification Service untuk mengelola notifikasi pengguna dalam sistem E-Wallet.

## Setup

```bash
pip install -r requirements.txt
```

## Configuration

Buat file `.env` dengan konfigurasi:

```env
PORT=3004
SECRET_KEY=notification-service-secret-key
DATABASE_URL=sqlite:///notifications.db
SERVICE_NAME=notification-service
```

## Menjalankan

```bash
python app.py
```

## API Endpoints

### Notifications

- `GET /notifications` - Get all notifications
- `GET /notifications/{id}` - Get notification by ID
- `POST /notifications` - Create new notification
- `DELETE /notifications/{id}` - Delete notification
- `GET /notifications/user/{user_id}` - Get user notifications
- `GET /notifications/user/{user_id}/unread` - Get unread notifications

### Internal Endpoints

- `POST /internal/notifications` - Create notification (internal)
- `PUT /internal/notifications/{id}/read` - Mark as read
