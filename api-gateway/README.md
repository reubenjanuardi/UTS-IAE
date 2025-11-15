# API Gateway

Central entry point for all microservices in the E-Wallet application.

## Endpoints

- `GET /health` - Health check
- `GET /health/services` - Check all services status
- `/api/user-service/*` - User Service proxy
- `/api/wallet-service/*` - Wallet Service proxy
- `/api/transaction-service/*` - Transaction Service proxy
- `/api/notification-service/*` - Notification Service proxy

## Features

- Service discovery and health checks
- Request routing and path rewriting
- CORS support
- Error handling

## Port

Runs on port 3000
