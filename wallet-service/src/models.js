const { db } = require('./database');

class Wallet {
  static getByUserId(userId) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM wallets WHERE user_id = ?', [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static create(userId) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO wallets (user_id, balance) VALUES (?, ?)',
        [userId, 0],
        function (err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  static updateBalance(userId, amount) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE wallets SET balance = balance + ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
        [amount, userId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  static setBalance(userId, balance) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE wallets SET balance = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
        [balance, userId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  static getBalance(userId) {
    return new Promise((resolve, reject) => {
      db.get('SELECT balance FROM wallets WHERE user_id = ?', [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row ? row.balance : null);
      });
    });
  }
}

module.exports = Wallet;
