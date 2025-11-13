#!/bin/bash
# Create-Databases Script for E-Wallet System (Mac/Linux)
# This script creates all SQLite databases and initializes sample data

echo ""
echo "====================================================="
echo "Creating E-Wallet Databases"
echo "====================================================="
echo ""

echo "[1/4] Creating User Service database..."
cd user-service
python3 -c "from config import Config; from models import db; from app import app, create_tables; app.app_context().push(); create_tables()" 2>/dev/null
if [ -f users.db ]; then
    echo "✅ users.db created successfully"
else
    echo "❌ Failed to create users.db"
fi
cd ..
echo ""

echo "[2/4] Creating Wallet Service database..."
cd wallet-service
python3 -c "from config import Config; from models import db; from app import app, create_tables; app.app_context().push(); create_tables()" 2>/dev/null
if [ -f wallets.db ]; then
    echo "✅ wallets.db created successfully"
else
    echo "❌ Failed to create wallets.db"
fi
cd ..
echo ""

echo "[3/4] Creating Transaction Service database..."
cd transaction-service
python3 -c "from config import Config; from models import db; from app import app, create_tables; app.app_context().push(); create_tables()" 2>/dev/null
if [ -f transactions.db ]; then
    echo "✅ transactions.db created successfully"
else
    echo "❌ Failed to create transactions.db"
fi
cd ..
echo ""

echo "[4/4] Creating Notification Service database..."
cd notification-service
python3 -c "from config import Config; from models import db; from app import app, create_tables; app.app_context().push(); create_tables()" 2>/dev/null
if [ -f notifications.db ]; then
    echo "✅ notifications.db created successfully"
else
    echo "❌ Failed to create notifications.db"
fi
cd ..
echo ""

echo "====================================================="
echo "✅ Database initialization complete!"
echo "====================================================="
echo ""
