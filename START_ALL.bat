@echo off
REM E-Wallet Microservices - Start All Services
REM This script launches all 5 services in separate windows

color 0A
title E-Wallet Microservices - All Services Launcher

echo.
echo =========================================
echo E-Wallet Microservices Launcher
echo =========================================
echo.
echo This will start all 5 services in new command windows
echo.
echo Services to start:
echo  1. API Gateway (port 3000)
echo  2. User Service (port 3001)
echo  3. Wallet Service (port 3002)
echo  4. Transaction Service (port 3003)
echo  5. Notification Service (port 3004)
echo.
echo Make sure you ran setup.bat first to install dependencies!
echo.
pause

echo.
echo Starting services...
echo.

REM Start each service in a new window
start "API Gateway (3000)" cmd /k "cd api-gateway && npm start"
timeout /t 2 /nobreak

start "User Service (3001)" cmd /k "cd user-service && npm start"
timeout /t 2 /nobreak

start "Wallet Service (3002)" cmd /k "cd wallet-service && npm start"
timeout /t 2 /nobreak

start "Transaction Service (3003)" cmd /k "cd transaction-service && npm start"
timeout /t 2 /nobreak

start "Notification Service (3004)" cmd /k "cd notification-service && npm start"
timeout /t 2 /nobreak

echo.
echo =========================================
echo All services launched!
echo =========================================
echo.
echo Waiting 5 seconds for services to initialize...
echo.
timeout /t 5 /nobreak

echo.
echo ================================
echo All services started!
echo ================================
echo.
echo API Gateway: http://localhost:3000
echo User Service: http://localhost:3001
echo Wallet Service: http://localhost:3002
echo Transaction Service: http://localhost:3003
echo Notification Service: http://localhost:3004
echo.
echo Frontend: Open frontend/index.html in your browser
echo.
echo Press any key to exit this window...
pause
