#!/bin/bash
# Database Verification Script for Mac/Linux
# Check if all databases are created and accessible

echo ""
echo "=========================================="
echo "E-Wallet Database Verification"
echo "=========================================="
echo ""

passed=0
failed=0

# Check User Service Database
echo -n "Checking user-service/users.db... "
if [ -f user-service/users.db ]; then
    size=$(du -h user-service/users.db | cut -f1)
    echo "✅ Found (Size: $size)"
    ((passed++))
else
    echo "❌ Not found"
    ((failed++))
fi

# Check Wallet Service Database
echo -n "Checking wallet-service/wallets.db... "
if [ -f wallet-service/wallets.db ]; then
    size=$(du -h wallet-service/wallets.db | cut -f1)
    echo "✅ Found (Size: $size)"
    ((passed++))
else
    echo "❌ Not found"
    ((failed++))
fi

# Check Transaction Service Database
echo -n "Checking transaction-service/transactions.db... "
if [ -f transaction-service/transactions.db ]; then
    size=$(du -h transaction-service/transactions.db | cut -f1)
    echo "✅ Found (Size: $size)"
    ((passed++))
else
    echo "❌ Not found"
    ((failed++))
fi

# Check Notification Service Database
echo -n "Checking notification-service/notifications.db... "
if [ -f notification-service/notifications.db ]; then
    size=$(du -h notification-service/notifications.db | cut -f1)
    echo "✅ Found (Size: $size)"
    ((passed++))
else
    echo "❌ Not found"
    ((failed++))
fi

echo ""
echo "=========================================="
echo "Results: $passed passed, $failed failed"
echo "=========================================="
echo ""

if [ $failed -eq 0 ]; then
    echo "✅ All databases are ready!"
    exit 0
else
    echo "❌ Some databases are missing."
    echo "Run: ./start-all.sh"
    exit 1
fi
