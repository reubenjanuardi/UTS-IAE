📋 TROUBLESHOOTING GUIDE - API Gateway 404 Error
================================================

Issue: "Cannot GET /api/user-service/users" (404 error)
       All services returning 404 except authentication


DIAGNOSIS STEPS
===============

Step 1: Verify API Gateway is running
   A. Open browser: http://localhost:3000/health
   B. Should see: {"status":"healthy", ...}
   
   If ERROR: API Gateway not started
      → Run: cd api-gateway && npm install && npm start
      → Wait 10 seconds
      → Try health check again

Step 2: Verify Backend Services are running
   A. User Service:          http://localhost:3001/health
   B. Wallet Service:        http://localhost:3002/health
   C. Transaction Service:   http://localhost:3003/health
   D. Notification Service:  http://localhost:3004/health
   
   Each should return: {"status":"healthy", ...}
   
   If any ERROR:
      → Open new terminal
      → cd [service-name]-service
      → python -m pip install -r requirements.txt
      → python app.py
      → Wait 5 seconds, try again

Step 3: Verify Authentication Works
   A. Get Token:
      POST http://localhost:3000/auth/login
      Body: {"username":"admin","password":"admin123"}
      
   B. Copy the token from response
   
   C. If ERROR "username and password are required":
      → Make sure you're sending JSON with correct headers
      → Header: Content-Type: application/json
      → Body: {"username":"admin","password":"admin123"}

Step 4: Test Service Endpoint with Token
   A. Using token from Step 3, test:
      GET http://localhost:3000/api/user-service/users
      Header: Authorization: Bearer [YOUR_TOKEN_HERE]
   
   B. Expected responses:
      ✓ 200 with user data → WORKING!
      ✗ 404 "Cannot GET" → Route not reaching service
      ✗ 401 "Unauthorized" → Token issue
      ✗ 503 "Service unavailable" → Backend service not running

Step 5: Check Logs
   → Look at API Gateway terminal for debug logs
   → Look at service terminal for errors
   → Add this to diagnose:
      curl -v -H "Authorization: Bearer TOKEN" http://localhost:3000/api/user-service/users


COMMON ISSUES
=============

Issue: "Cannot GET /api/user-service/users" (404)
   Cause: API Gateway route not matching
   Fix:
      1. Restart API Gateway
      2. Verify npm_modules installed: "ls api-gateway/node_modules"
      3. Check api-gateway/index.js line 240 has correct app.use() routes

Issue: "Access denied. No token provided" (401)
   Cause: Missing Authorization header
   Fix:
      1. Add header: Authorization: Bearer YOUR_TOKEN
      2. Make sure "Bearer " is included (with space)

Issue: "Invalid or expired token" (403)
   Cause: Token invalid or signature mismatch
   Fix:
      1. Get new token from /auth/login
      2. Copy entire token string
      3. Verify JWT_SECRET matches in .env

Issue: Service returns 503 "Service unavailable"
   Cause: Backend service not running or not accessible
   Fix:
      1. Verify service running on correct port:
         - User:        3001
         - Wallet:      3002
         - Transaction: 3003
         - Notification: 3004
      2. Kill any process on that port: taskkill /F /IM python.exe
      3. Restart service: python app.py

Issue: Service returns 401 "Unauthorized: No user info"
   Cause: X-User-Id header not forwarded by API Gateway
   Fix:
      1. Verify token was validated by API Gateway
      2. Check req.user exists in authenticateJWT middleware
      3. Restart services


QUICK FIX (Windows)
===================

1. Kill all running services:
   taskkill /F /IM python.exe
   taskkill /F /IM node.exe

2. Clean restart:
   cd e-wallet-project
   start-all.bat

3. Wait 30 seconds

4. Test in browser:
   http://localhost:3000/health
   → Should work
   
5. Login:
   POST http://localhost:3000/auth/login
   Body: {"username":"admin","password":"admin123"}
   → Should get token

6. Use token to test:
   GET http://localhost:3000/api/user-service/users
   Header: Authorization: Bearer [TOKEN]
   → Should work


DEBUG REQUESTS (using curl/Postman)
===================================

Test 1: Health Check
   GET http://localhost:3000/health
   → Should work (no auth needed)

Test 2: Login
   POST http://localhost:3000/auth/login
   Content-Type: application/json
   Body: {"username":"admin","password":"admin123"}
   → Copy token

Test 3: Get Users with Token
   GET http://localhost:3000/api/user-service/users
   Authorization: Bearer [TOKEN_FROM_TEST_2]
   → Should work and return users

Test 4: Direct Service (bypass API Gateway)
   GET http://localhost:3001/users
   X-User-Id: 1
   → If this works but Test 3 doesn't = API Gateway issue
   → If this fails too = Service issue


LOGS TO CHECK
=============

1. API Gateway Console (node index.js):
   - Should show "🚀 API Gateway running on http://localhost:3000"
   - Should show "Connected Services:" with 4 services
   - When request comes in: "Proxy response: 200 from http://localhost:3001"

2. User Service Console (python app.py):
   - Should show "✅ User database initialized"
   - Should show "🚀 User Service running on http://localhost:3001"
   - When request comes in with X-User-Id header: handles request normally

3. If you see "[ERROR]" in API Gateway:
   - Check proxy configuration
   - Verify pathRewrite is working
   - Check node_modules for http-proxy-middleware


MANUAL TESTING
==============

From PowerShell/CMD:

# Test 1: Health
curl http://localhost:3000/health

# Test 2: Login
$login = curl -X POST http://localhost:3000/auth/login `
  -H "Content-Type: application/json" `
  -d '{"username":"admin","password":"admin123"}'

# Test 3: Get users (replace TOKEN)
curl -H "Authorization: Bearer [TOKEN]" `
  http://localhost:3000/api/user-service/users


IF STILL NOT WORKING
====================

1. Run: cd api-gateway && npm install  (reinstall dependencies)
2. Run: npm start (start API Gateway manually)
3. In new terminal: cd user-service && python app.py (start one service)
4. Try: curl -H "Authorization: Bearer admin123" http://localhost:3000/health

5. Post your ERROR MESSAGE in issues with:
   - What endpoint are you testing?
   - What is the exact error message?
   - Are all services running? (check all 5 terminals)
   - What terminal shows the error?
