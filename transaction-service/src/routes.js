const express = require('express');
const Transaction = require('./models');
const axios = require('axios');
const router = express.Router();

const WALLET_SERVICE_URL = 'http://localhost:3002';
const NOTIFICATION_SERVICE_URL = 'http://localhost:3004';

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'transaction-service' });
});

// Get all transactions (admin)
router.get('/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.getAll();
    res.json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get transactions for authenticated user
router.get('/transactions/user', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User ID not found in token' });
    }
    
    const transactions = await Transaction.getByUserId(userId);
    res.json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get transaction by ID
router.get('/transactions/:id', async (req, res) => {
  try {
    const transaction = await Transaction.getById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    res.json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send money (from authenticated user)
router.post('/transactions/send', async (req, res) => {
  try {
    const sender_id = req.headers['x-user-id'];
    const { recipient_id, amount } = req.body;

    if (!sender_id) {
      return res.status(401).json({ success: false, message: 'User ID not found in token' });
    }

    if (!recipient_id || !amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid recipient_id or amount' });
    }

    if (sender_id === recipient_id) {
      return res.status(400).json({ success: false, message: 'Cannot send to yourself' });
    }

    // Update sender balance
    try {
      await axios.put(`${WALLET_SERVICE_URL}/internal/wallets/${sender_id}/balance`, { amount: -amount });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to deduct sender balance' });
    }

    // Update recipient balance
    try {
      await axios.put(`${WALLET_SERVICE_URL}/internal/wallets/${recipient_id}/balance`, { amount: amount });
    } catch (error) {
      // Try to refund sender
      await axios.put(`${WALLET_SERVICE_URL}/internal/wallets/${sender_id}/balance`, { amount: amount });
      return res.status(500).json({ success: false, message: 'Failed to add recipient balance' });
    }

    // Create transaction records
    const transactionId = await Transaction.create(sender_id, 'send', amount, recipient_id, 'completed');

    // Send notifications
    try {
      await axios.post(`${NOTIFICATION_SERVICE_URL}/notifications/send`, {
        user_id: sender_id,
        message: `You sent $${amount} to user ${recipient_id}`
      });
      await axios.post(`${NOTIFICATION_SERVICE_URL}/notifications/send`, {
        user_id: recipient_id,
        message: `You received $${amount} from user ${sender_id}`
      });
    } catch (error) {
      console.error('Failed to send notification:', error.message);
    }

    res.json({ success: true, message: 'Money sent successfully', data: { id: transactionId } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Top-up (for authenticated user)
router.post('/transactions/topup', async (req, res) => {
  try {
    const user_id = req.headers['x-user-id'];
    const { amount } = req.body;

    if (!user_id) {
      return res.status(401).json({ success: false, message: 'User ID not found in token' });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    // Update wallet balance
    try {
      await axios.put(`${WALLET_SERVICE_URL}/internal/wallets/${user_id}/balance`, { amount: amount });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to top-up wallet' });
    }

    // Create transaction record
    const transactionId = await Transaction.create(user_id, 'topup', amount, null, 'completed');

    // Send notification
    try {
      await axios.post(`${NOTIFICATION_SERVICE_URL}/notifications/send`, {
        user_id,
        message: `Top-up of $${amount} completed successfully`
      });
    } catch (error) {
      console.error('Failed to send notification:', error.message);
    }

    res.json({ success: true, message: 'Top-up successful', data: { id: transactionId } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Withdraw (for authenticated user)
router.post('/transactions/withdraw', async (req, res) => {
  try {
    const user_id = req.headers['x-user-id'];
    const { amount } = req.body;

    if (!user_id) {
      return res.status(401).json({ success: false, message: 'User ID not found in token' });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    // Update wallet balance
    try {
      await axios.put(`${WALLET_SERVICE_URL}/internal/wallets/${user_id}/balance`, { amount: -amount });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    // Create transaction record
    const transactionId = await Transaction.create(user_id, 'withdraw', amount, null, 'completed');

    // Send notification
    try {
      await axios.post(`${NOTIFICATION_SERVICE_URL}/notifications/send`, {
        user_id,
        message: `Withdrawal of $${amount} completed successfully`
      });
    } catch (error) {
      console.error('Failed to send notification:', error.message);
    }

    res.json({ success: true, message: 'Withdrawal successful', data: { id: transactionId } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
