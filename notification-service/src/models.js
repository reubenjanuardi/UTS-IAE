const { db } = require('./database');

class Notification {
  static getByUserId(userId) {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
        [userId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });
  }

  static create(userId, message) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO notifications (user_id, message) VALUES (?, ?)',
        [userId, message],
        function (err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM notifications ORDER BY created_at DESC', (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }
}

module.exports = Notification;
