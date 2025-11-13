@echo off
REM Create-Databases Script for E-Wallet System
REM This script creates all SQLite databases and initializes sample data

echo.
echo =====================================================
echo Creating E-Wallet Databases
echo =====================================================
echo.

echo [1/4] Creating User Service database...
cd user-service
python -c "from config import Config; from models import db; from app import app, create_tables; app.app_context().push(); create_tables()" 2>nul
if exist users.db (
    echo ✅ users.db created successfully
) else (
    echo ❌ Failed to create users.db
)
cd ..
echo.

echo [2/4] Creating Wallet Service database...
cd wallet-service
python -c "from config import Config; from models import db; from app import app, create_tables; app.app_context().push(); create_tables()" 2>nul
if exist wallets.db (
    echo ✅ wallets.db created successfully
) else (
    echo ❌ Failed to create wallets.db
)
cd ..
echo.

echo [3/4] Creating Transaction Service database...
cd transaction-service
python -c "from config import Config; from models import db; from app import app, create_tables; app.app_context().push(); create_tables()" 2>nul
if exist transactions.db (
    echo ✅ transactions.db created successfully
) else (
    echo ❌ Failed to create transactions.db
)
cd ..
echo.

echo [4/4] Creating Notification Service database...
cd notification-service
python -c "from config import Config; from models import db; from app import app, create_tables; app.app_context().push(); create_tables()" 2>nul
if exist notifications.db (
    echo ✅ notifications.db created successfully
) else (
    echo ❌ Failed to create notifications.db
)
cd ..
echo.

echo =====================================================
echo ✅ Database initialization complete!
echo =====================================================
echo.
pause
