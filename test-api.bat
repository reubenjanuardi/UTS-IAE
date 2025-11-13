@echo off
REM Test script to verify API Gateway and services are working

echo.
echo ========================================
echo   API GATEWAY & SERVICES TEST
echo ========================================
echo.

REM Test 1: Health check
echo [1] Testing API Gateway health check...
curl -s http://localhost:3000/health | findstr /C:"healthy" >nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ API Gateway is running
) else (
    echo ✗ API Gateway NOT responding
    goto END
)

REM Test 2: Login endpoint
echo.
echo [2] Testing login endpoint...
for /f "tokens=*" %%i in ('curl -s -X POST http://localhost:3000/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}" ^
  ^| findstr /C:"token"') do set TOKEN=%%i

if "%TOKEN%"=="" (
    echo ✗ Login failed
    goto END
) else (
    echo ✓ Login successful
)

REM Test 3: Check user service with token
echo.
echo [3] Testing User Service with authentication...
curl -s -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AZXdhbGxldC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDExMTExMTEsImV4cCI6MTcwMTE5NzUxMX0.test" ^
  http://localhost:3000/api/user-service/users | findstr /C:"success"

echo.
echo [4] Checking individual service health...
echo   - User Service (3001)...
curl -s http://localhost:3001/health | findstr /C:"healthy" >nul && echo   ✓ Running || echo   ✗ Not responding

echo   - Wallet Service (3002)...
curl -s http://localhost:3002/health | findstr /C:"healthy" >nul && echo   ✓ Running || echo   ✗ Not responding

echo   - Transaction Service (3003)...
curl -s http://localhost:3003/health | findstr /C:"healthy" >nul && echo   ✓ Running || echo   ✗ Not responding

echo   - Notification Service (3004)...
curl -s http://localhost:3004/health | findstr /C:"healthy" >nul && echo   ✓ Running || echo   ✗ Not responding

:END
echo.
echo ========================================
echo   Test complete
echo ========================================
