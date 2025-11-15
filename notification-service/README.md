# Notification Service

Manages transaction notifications for users.

## Endpoints

- `GET /health` - Health check
- `GET /notifications/:userId` - Get notifications by user ID
- `GET /notifications` - Get all notifications
- `POST /notifications/send` - Send notification

## Database

SQLite with `notifications` table containing:
- id (INTEGER PRIMARY KEY)
- user_id (INTEGER)
- message (TEXT)
- created_at (DATETIME)

## Integrations

- Called by transaction-service after transactions

## Port

Runs on port 3004
