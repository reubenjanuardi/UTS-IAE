#!/bin/bash

# E-Wallet Microservices Quick Start Script
# This script installs dependencies for all services

echo "========================================="
echo "E-Wallet Microservices Setup"
echo "========================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to install dependencies
install_service() {
    local service=$1
    echo -e "${YELLOW}Installing dependencies for $service...${NC}"
    cd "$service"
    npm install
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ $service dependencies installed${NC}"
    else
        echo -e "${RED}✗ Failed to install $service dependencies${NC}"
        exit 1
    fi
    cd ..
}

# Install all services
echo -e "${YELLOW}Step 1: Installing API Gateway${NC}"
install_service "api-gateway"
echo ""

echo -e "${YELLOW}Step 2: Installing User Service${NC}"
install_service "user-service"
echo ""

echo -e "${YELLOW}Step 3: Installing Wallet Service${NC}"
install_service "wallet-service"
echo ""

echo -e "${YELLOW}Step 4: Installing Transaction Service${NC}"
install_service "transaction-service"
echo ""

echo -e "${YELLOW}Step 5: Installing Notification Service${NC}"
install_service "notification-service"
echo ""

echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}✓ All dependencies installed successfully!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo -e "${YELLOW}To start the services, run these commands in separate terminals:${NC}"
echo ""
echo "Terminal 1: cd api-gateway && npm start"
echo "Terminal 2: cd user-service && npm start"
echo "Terminal 3: cd wallet-service && npm start"
echo "Terminal 4: cd transaction-service && npm start"
echo "Terminal 5: cd notification-service && npm start"
echo ""
echo -e "${YELLOW}Then open frontend/index.html in your browser${NC}"
echo ""
