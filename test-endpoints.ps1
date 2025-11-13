# PowerShell Script to Test API Endpoints
# Usage: powershell -ExecutionPolicy Bypass -File test-endpoints.ps1

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  E-WALLET API TEST SCRIPT" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Color functions
function Write-Success { param([string]$msg); Write-Host "✓ $msg" -ForegroundColor Green }
function Write-Error { param([string]$msg); Write-Host "✗ $msg" -ForegroundColor Red }
function Write-Info { param([string]$msg); Write-Host "ℹ $msg" -ForegroundColor Yellow }
function Write-Test { param([string]$msg); Write-Host "`n[TEST] $msg" -ForegroundColor Cyan }

# Test 1: Health Check
Write-Test "API Gateway Health Check"
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3000/health" -ErrorAction Stop
    Write-Success "API Gateway is running on port 3000"
    Write-Host "  Status: $($health.status)" -ForegroundColor Green
} catch {
    Write-Error "API Gateway not responding on port 3000"
    Write-Info "Make sure you ran: start-all.bat"
    exit 1
}

# Test 2: Backend Services Health
Write-Test "Backend Services Health"
$ports = @{
    "User Service" = 3001
    "Wallet Service" = 3002
    "Transaction Service" = 3003
    "Notification Service" = 3004
}

foreach ($service in $ports.Keys) {
    $port = $ports[$service]
    try {
        $health = Invoke-RestMethod -Uri "http://localhost:$port/health" -ErrorAction Stop
        Write-Success "$service is running on port $port"
    } catch {
        Write-Error "$service NOT responding on port $port"
    }
}

# Test 3: Login
Write-Test "Authentication (Login)"
try {
    $loginBody = @{
        username = "admin"
        password = "admin123"
    } | ConvertTo-Json
    
    $login = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody `
        -ErrorAction Stop
    
    Write-Success "Login successful"
    Write-Host "  User: $($login.user.username)" -ForegroundColor Green
    Write-Host "  Role: $($login.user.role)" -ForegroundColor Green
    
    # Extract token for next tests
    $token = $login.token
    Write-Info "Token received (length: $($token.Length) chars)"
} catch {
    Write-Error "Login failed: $($_.Exception.Message)"
    exit 1
}

# Test 4: Protected Endpoints
Write-Test "Protected Endpoints (with token)"

# User Service
Write-Info "Testing User Service..."
try {
    $result = Invoke-RestMethod -Uri "http://localhost:3000/api/user-service/users" `
        -Method GET `
        -Headers @{ "Authorization" = "Bearer $token" } `
        -ErrorAction Stop
    Write-Success "User Service: Retrieved $($result.data.Count) users"
} catch {
    Write-Error "User Service failed: $($_.Exception.Message)"
}

# Wallet Service
Write-Info "Testing Wallet Service..."
try {
    $result = Invoke-RestMethod -Uri "http://localhost:3000/api/wallet-service/wallets" `
        -Method GET `
        -Headers @{ "Authorization" = "Bearer $token" } `
        -ErrorAction Stop
    Write-Success "Wallet Service: Retrieved $($result.data.Count) wallets"
} catch {
    Write-Error "Wallet Service failed: $($_.Exception.Message)"
}

# Transaction Service
Write-Info "Testing Transaction Service..."
try {
    $result = Invoke-RestMethod -Uri "http://localhost:3000/api/transaction-service/transactions" `
        -Method GET `
        -Headers @{ "Authorization" = "Bearer $token" } `
        -ErrorAction Stop
    Write-Success "Transaction Service: Retrieved $($result.data.Count) transactions"
} catch {
    Write-Error "Transaction Service failed: $($_.Exception.Message)"
}

# Notification Service
Write-Info "Testing Notification Service..."
try {
    $result = Invoke-RestMethod -Uri "http://localhost:3000/api/notification-service/notifications" `
        -Method GET `
        -Headers @{ "Authorization" = "Bearer $token" } `
        -ErrorAction Stop
    Write-Success "Notification Service: Retrieved $($result.data.Count) notifications"
} catch {
    Write-Error "Notification Service failed: $($_.Exception.Message)"
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  TEST COMPLETE" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan
