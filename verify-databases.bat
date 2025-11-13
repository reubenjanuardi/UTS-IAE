@echo off
REM Database Verification Script for Windows
REM Check if all databases are created and accessible

echo.
echo ==========================================
echo E-Wallet Database Verification
echo ==========================================
echo.

setlocal enabledelayedexpansion
set /a passed=0
set /a failed=0

REM Check User Service Database
echo Checking user-service\users.db...
if exist user-service\users.db (
    for %%A in (user-service\users.db) do set size=%%~zA
    echo ✅ Found (Size: !size! bytes)
    set /a passed+=1
) else (
    echo ❌ Not found
    set /a failed+=1
)

REM Check Wallet Service Database
echo Checking wallet-service\wallets.db...
if exist wallet-service\wallets.db (
    for %%A in (wallet-service\wallets.db) do set size=%%~zA
    echo ✅ Found (Size: !size! bytes)
    set /a passed+=1
) else (
    echo ❌ Not found
    set /a failed+=1
)

REM Check Transaction Service Database
echo Checking transaction-service\transactions.db...
if exist transaction-service\transactions.db (
    for %%A in (transaction-service\transactions.db) do set size=%%~zA
    echo ✅ Found (Size: !size! bytes)
    set /a passed+=1
) else (
    echo ❌ Not found
    set /a failed+=1
)

REM Check Notification Service Database
echo Checking notification-service\notifications.db...
if exist notification-service\notifications.db (
    for %%A in (notification-service\notifications.db) do set size=%%~zA
    echo ✅ Found (Size: !size! bytes)
    set /a passed+=1
) else (
    echo ❌ Not found
    set /a failed+=1
)

echo.
echo ==========================================
echo Results: !passed! passed, !failed! failed
echo ==========================================
echo.

if !failed! equ 0 (
    echo ✅ All databases are ready!
    goto success
) else (
    echo ❌ Some databases are missing.
    echo Run: start-all.bat
    goto fail
)

:success
pause
exit /b 0

:fail
pause
exit /b 1
