#!/bin/bash

echo "Starting E-Wallet System..."
echo ""

# Create databases if they don't exist
echo "Checking and creating databases..."

cd user-service
if [ ! -f users.db ]; then
    echo "Creating users.db..."
    python3 -c "from config import Config; from models import db; from app import app, create_tables; app.app_context().push(); create_tables()" 2>/dev/null
fi
cd ..

cd wallet-service
if [ ! -f wallets.db ]; then
    echo "Creating wallets.db..."
    python3 -c "from config import Config; from models import db; from app import app, create_tables; app.app_context().push(); create_tables()" 2>/dev/null
fi
cd ..

cd transaction-service
if [ ! -f transactions.db ]; then
    echo "Creating transactions.db..."
    python3 -c "from config import Config; from models import db; from app import app, create_tables; app.app_context().push(); create_tables()" 2>/dev/null
fi
cd ..

cd notification-service
if [ ! -f notifications.db ]; then
    echo "Creating notifications.db..."
    python3 -c "from config import Config; from models import db; from app import app, create_tables; app.app_context().push(); create_tables()" 2>/dev/null
fi
cd ..

echo ""
echo "Starting API Gateway on port 3000..."
cd api-gateway
npm install > /dev/null 2>&1
npm run dev &
GATEWAY_PID=$!
cd ..
sleep 3

echo "Starting User Service on port 3001..."
cd user-service
pip install -r requirements.txt > /dev/null 2>&1
python3 app.py &
USER_SERVICE_PID=$!
cd ..
sleep 3

echo "Starting Wallet Service on port 3002..."
cd wallet-service
pip install -r requirements.txt > /dev/null 2>&1
python3 app.py &
WALLET_SERVICE_PID=$!
cd ..
sleep 3

echo "Starting Transaction Service on port 3003..."
cd transaction-service
pip install -r requirements.txt > /dev/null 2>&1
python3 app.py &
TRANSACTION_SERVICE_PID=$!
cd ..
sleep 3

echo "Starting Notification Service on port 3004..."
cd notification-service
pip install -r requirements.txt > /dev/null 2>&1
python3 app.py &
NOTIFICATION_SERVICE_PID=$!
cd ..

echo ""
echo "========================================"
echo "  E-Wallet System Started!"
echo "========================================"
echo ""
echo "API Gateway: http://localhost:3000"
echo "User Service: http://localhost:3001/api-docs"
echo "Wallet Service: http://localhost:3002/api-docs"
echo "Transaction Service: http://localhost:3003/api-docs"
echo "Notification Service: http://localhost:3004/api-docs"
echo ""
echo "Frontend: frontend/index.html"
echo ""
echo "Default Credentials:"
echo "Username: admin"
echo "Password: admin123"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for interrupt
trap "kill $GATEWAY_PID $USER_SERVICE_PID $WALLET_SERVICE_PID $TRANSACTION_SERVICE_PID $NOTIFICATION_SERVICE_PID" INT

wait
