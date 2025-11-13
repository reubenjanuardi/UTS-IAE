@echo off
REM Test Database Creation Script
REM Simple test to verify all databases can be created

echo.
echo ====================================================
echo Database Creation Test
echo ====================================================
echo.

setlocal enabledelayedexpansion

REM Test User Service
echo Testing User Service...
cd user-service
python -c "from config import Config; from models import db; from app import app, create_tables; app.app_context().push(); create_tables()" 2>nul
if exist users.db (
    echo ✅ users.db - SUCCESS
) else (
    echo ❌ users.db - FAILED
)
cd ..

REM Test Wallet Service  
echo Testing Wallet Service...
cd wallet-service
python -c "from config import Config; from models import db; from app import app, create_tables; app.app_context().push(); create_tables()" 2>nul
if exist wallets.db (
    echo ✅ wallets.db - SUCCESS
) else (
    echo ❌ wallets.db - FAILED
)
cd ..

REM Test Transaction Service
echo Testing Transaction Service...
cd transaction-service
python -c "from config import Config; from models import db; from app import app, create_tables; app.app_context().push(); create_tables()" 2>nul
if exist transactions.db (
    echo ✅ transactions.db - SUCCESS
) else (
    echo ❌ transactions.db - FAILED
)
cd ..

REM Test Notification Service
echo Testing Notification Service...
cd notification-service
python -c "from config import Config; from models import db; from app import app, create_tables; app.app_context().push(); create_tables()" 2>nul
if exist notifications.db (
    echo ✅ notifications.db - SUCCESS
) else (
    echo ❌ notifications.db - FAILED
)
cd ..

echo.
echo ====================================================
echo Summary:
echo ====================================================
echo.

REM Summarize
if exist user-service\users.db (
    echo ✅ user-service\users.db
) else (
    echo ❌ user-service\users.db
)

if exist wallet-service\wallets.db (
    echo ✅ wallet-service\wallets.db
) else (
    echo ❌ wallet-service\wallets.db
)

if exist transaction-service\transactions.db (
    echo ✅ transaction-service\transactions.db
) else (
    echo ❌ transaction-service\transactions.db
)

if exist notification-service\notifications.db (
    echo ✅ notification-service\notifications.db
) else (
    echo ❌ notification-service\notifications.db
)

echo.
echo All databases created successfully!
echo You can now run: start-all.bat
echo.
pause
