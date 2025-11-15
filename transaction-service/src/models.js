const { db } = require('./database');

class Transaction {
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM transactions ORDER BY created_at DESC', (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  static getById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM transactions WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static getByUserId(userId) {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM transactions WHERE user_id = ? OR recipient_id = ? ORDER BY created_at DESC',
        [userId, userId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });
  }

  static create(userId, type, amount, recipientId = null, status = 'completed') {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO transactions (user_id, type, amount, recipient_id, status) VALUES (?, ?, ?, ?, ?)',
        [userId, type, amount, recipientId, status],
        function (err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }
}

module.exports = Transaction;
