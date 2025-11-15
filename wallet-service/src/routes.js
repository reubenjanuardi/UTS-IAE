const express = require('express');
const Wallet = require('./models');
const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'wallet-service' });
});

// Get wallet for authenticated user
router.get('/wallets', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User ID not found in token' });
    }

    let wallet = await Wallet.getByUserId(userId);
    
    // Create wallet if not exists
    if (!wallet) {
      await Wallet.create(userId);
      wallet = await Wallet.getByUserId(userId);
    }

    res.json({ success: true, data: wallet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Top-up wallet for authenticated user
router.post('/wallets/topup', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { amount } = req.body;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User ID not found in token' });
    }
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    let wallet = await Wallet.getByUserId(userId);
    if (!wallet) {
      await Wallet.create(userId);
    }

    await Wallet.updateBalance(userId, amount);
    const updatedWallet = await Wallet.getByUserId(userId);

    res.json({ success: true, message: 'Top-up successful', data: updatedWallet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Withdraw from wallet for authenticated user
router.post('/wallets/withdraw', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { amount } = req.body;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User ID not found in token' });
    }
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const balance = await Wallet.getBalance(userId);
    if (balance === null) {
      return res.status(404).json({ success: false, message: 'Wallet not found' });
    }

    if (balance < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }

    await Wallet.updateBalance(userId, -amount);
    const updatedWallet = await Wallet.getByUserId(userId);

    res.json({ success: true, message: 'Withdrawal successful', data: updatedWallet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Internal endpoint for transaction service - update balance
router.put('/internal/wallets/:userId/balance', async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount } = req.body;

    if (amount === undefined) {
      return res.status(400).json({ success: false, message: 'Amount required' });
    }

    const balance = await Wallet.getBalance(userId);
    if (balance === null) {
      return res.status(404).json({ success: false, message: 'Wallet not found' });
    }

    if (balance + amount < 0) {
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }

    await Wallet.updateBalance(userId, amount);
    const updatedWallet = await Wallet.getByUserId(userId);

    res.json({ success: true, data: updatedWallet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
