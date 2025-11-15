# User Service

Manages user registration, authentication, and user data.

## Endpoints

- `GET /health` - Health check
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `GET /internal/users/:id` - Internal endpoint for other services

## Database

SQLite with `users` table containing:
- id (INTEGER PRIMARY KEY)
- name (TEXT)
- email (TEXT UNIQUE)
- password (TEXT)
- created_at (DATETIME)

## Port

Runs on port 3001
