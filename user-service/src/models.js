const { db } = require('./database');
const bcrypt = require('bcrypt');

class User {
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT id, name, email, created_at FROM users', (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  static getById(id) {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT id, name, email, created_at FROM users WHERE id = ?',
        [id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  static async create(name, email, password) {
    return new Promise(async (resolve, reject) => {
      try {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        db.run(
          'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
          [name, email, hashedPassword],
          function (err) {
            if (err) reject(err);
            else resolve(this.lastID);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  static findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static update(id, name, email) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET name = ?, email = ? WHERE id = ?',
        [name, email, id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM users WHERE id = ?', [id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

module.exports = User;
