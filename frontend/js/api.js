const API_BASE_URL = 'http://localhost:3000/api';

async function apiCall(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };
    
    // Add JWT token to Authorization header if available
    const token = localStorage.getItem('token');
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (body) {
        options.body = JSON.stringify(body);
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        
        // Handle 401 Unauthorized (token expired or invalid)
        if (response.status === 401) {
            localStorage.clear();
            window.location.href = 'index.html';
            throw new Error('Session expired. Please login again.');
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// User Service API
const userAPI = {
    getAll: () => apiCall('/user-service/users'),
    getById: (id) => apiCall(`/user-service/users/${id}`),
    create: (name, email, password) => 
        apiCall('/user-service/users', 'POST', { name, email, password }),
    update: (id, name, email) => 
        apiCall(`/user-service/users/${id}`, 'PUT', { name, email }),
    delete: (id) => apiCall(`/user-service/users/${id}`, 'DELETE'),
    login: (email, password) => 
        apiCall('/user-service/users/login', 'POST', { email, password })
};

// Wallet Service API
const walletAPI = {
    getWallet: () => apiCall('/wallet-service/wallets'),
    topup: (amount) => 
        apiCall('/wallet-service/wallets/topup', 'POST', { amount }),
    withdraw: (amount) => 
        apiCall('/wallet-service/wallets/withdraw', 'POST', { amount })
};

// Transaction Service API
const transactionAPI = {
    getAll: () => apiCall('/transaction-service/transactions'),
    getById: (id) => apiCall(`/transaction-service/transactions/${id}`),
    getByUser: () => apiCall('/transaction-service/transactions/user'),
    send: (recipientId, amount) => 
        apiCall('/transaction-service/transactions/send', 'POST', { 
            recipient_id: recipientId, 
            amount 
        }),
    topup: (amount) => 
        apiCall('/transaction-service/transactions/topup', 'POST', { amount }),
    withdraw: (amount) => 
        apiCall('/transaction-service/transactions/withdraw', 'POST', { amount })
};

// Notification Service API
const notificationAPI = {
    getByUser: () => apiCall('/notification-service/notifications'),
    send: (userId, message) => 
        apiCall('/notification-service/notifications/send', 'POST', { user_id: userId, message })
};

