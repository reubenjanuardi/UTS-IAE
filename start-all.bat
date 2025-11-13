@echo off
echo Starting E-Wallet System...
echo.

REM Create databases if they don't exist
echo Checking and creating databases...
cd user-service
if not exist users.db (
    echo Creating users.db...
    python -c "from config import Config; from models import db; from app import app, create_tables; app.app_context().push(); create_tables()" 2>nul
)
cd ..

cd wallet-service
if not exist wallets.db (
    echo Creating wallets.db...
    python -c "from config import Config; from models import db; from app import app, create_tables; app.app_context().push(); create_tables()" 2>nul
)
cd ..

cd transaction-service
if not exist transactions.db (
    echo Creating transactions.db...
    python -c "from config import Config; from models import db; from app import app, create_tables; app.app_context().push(); create_tables()" 2>nul
)
cd ..

cd notification-service
if not exist notifications.db (
    echo Creating notifications.db...
    python -c "from config import Config; from models import db; from app import app, create_tables; app.app_context().push(); create_tables()" 2>nul
)
cd ..

echo.
echo Starting API Gateway on port 3000...
cd api-gateway
start cmd /k "npm install & npm run dev"
cd ..
timeout /t 3 /nobreak

echo Starting User Service on port 3001...
cd user-service
start cmd /k "pip install -r requirements.txt & python app.py"
cd ..
timeout /t 3 /nobreak

echo Starting Wallet Service on port 3002...
cd wallet-service
start cmd /k "pip install -r requirements.txt & python app.py"
cd ..
timeout /t 3 /nobreak

echo Starting Transaction Service on port 3003...
cd transaction-service
start cmd /k "pip install -r requirements.txt & python app.py"
cd ..
timeout /t 3 /nobreak

echo Starting Notification Service on port 3004...
cd notification-service
start cmd /k "pip install -r requirements.txt & python app.py"
cd ..

echo.
echo ========================================
echo   E-Wallet System Started!
echo ========================================
echo.
echo API Gateway: http://localhost:3000
echo User Service: http://localhost:3001/api-docs
echo Wallet Service: http://localhost:3002/api-docs
echo Transaction Service: http://localhost:3003/api-docs
echo Notification Service: http://localhost:3004/api-docs
echo.
echo Frontend: frontend/index.html
echo.
echo Default Credentials:
echo Username: admin
echo Password: admin123
echo.
pause
