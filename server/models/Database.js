import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Database {
  constructor() {
    this.db = new sqlite3.Database(path.join(__dirname, '../translations.db'));
    this.initializeTables();
  }

  initializeTables() {
    // Create translations table if it doesn't exist
    this.db.run(`
      CREATE TABLE IF NOT EXISTS translations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        input_text TEXT NOT NULL,
        translated_text TEXT NOT NULL,
        pronunciation TEXT,
        source_language TEXT,
        target_language TEXT,
        translation_method TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add pronunciation column if it doesn't exist (for existing databases)
    this.db.run(`
      ALTER TABLE translations ADD COLUMN pronunciation TEXT
    `, (err) => {
      if (err && err.message.includes('duplicate column name')) {
        // Column already exists, ignore error
        console.log('Database schema is up to date');
      } else if (err) {
        console.error('Error adding pronunciation column:', err.message);
      } else {
        console.log('Added pronunciation column to translations table');
      }
    });
  }

  getConnection() {
    return this.db;
  }

  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

// Singleton pattern
let instance;
export default {
  getInstance() {
    if (!instance) {
      instance = new Database();
    }
    return instance;
  }
};
