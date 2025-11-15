@echo off
REM E-Wallet Microservices Quick Start Script for Windows
REM This script installs dependencies for all services

echo =========================================
echo E-Wallet Microservices Setup
echo =========================================
echo.

setlocal enabledelayedexpansion

:install_service
set service=%1
if "%service%"=="" goto done

echo Installing dependencies for %service%...
cd %service%
call npm install
if %errorlevel% neq 0 (
    echo Failed to install %service% dependencies
    exit /b 1
)
echo.
cd ..

goto :eof

:done
echo =========================================
echo All dependencies installed successfully!
echo =========================================
echo.
echo To start the services, run these commands in separate terminals:
echo.
echo Terminal 1: cd api-gateway ^&^& npm start
echo Terminal 2: cd user-service ^&^& npm start
echo Terminal 3: cd wallet-service ^&^& npm start
echo Terminal 4: cd transaction-service ^&^& npm start
echo Terminal 5: cd notification-service ^&^& npm start
echo.
echo Then open frontend/index.html in your browser
echo.

REM Install all services
call :install_service api-gateway
call :install_service user-service
call :install_service wallet-service
call :install_service transaction-service
call :install_service notification-service

goto end

:end
echo =========================================
echo Setup complete!
echo =========================================
