require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.TRANSACTION_SERVICE_DB || path.join(__dirname, '..', 'database.sqlite');
const busyTimeout = parseInt(process.env.DB_BUSY_TIMEOUT || '5000', 10);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Database connection error:', err);
  else console.log(`Connected to database: ${dbPath}`);
});

// Configure SQLite for better performance
db.configure('busyTimeout', busyTimeout);

const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Enable WAL mode for better concurrency
      db.run('PRAGMA journal_mode = WAL', (err) => {
        if (err) console.error('WAL mode error:', err);
      });
      
      db.run(
        `CREATE TABLE IF NOT EXISTS transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          type TEXT NOT NULL,
          amount REAL NOT NULL,
          recipient_id INTEGER,
          status TEXT DEFAULT 'completed',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  });
};

module.exports = { db, initializeDatabase };
