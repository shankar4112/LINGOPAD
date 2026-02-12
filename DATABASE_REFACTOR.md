# Database Refactor: Sequelize ORM Implementation

This document explains the new database layer that supports both SQLite (local development) and PostgreSQL (cloud/production).

## Overview

- **Before**: Raw SQLite3 queries scattered throughout server.js
- **After**: Sequelize ORM with centralized configuration and repository pattern
- **Databases Supported**: SQLite (default) and PostgreSQL
- **Backward Compatible**: All existing functionality maintained

## Architecture

```
server/
├── config/
│   └── database.js                 # Sequelize configuration (NEW)
├── models/
│   ├── TranslationModel.js         # Sequelize model definition (NEW)
│   ├── TranslationRepository.js    # Data access layer (NEW)
│   ├── Database.js                 # OLD: Keep for reference
│   └── Translation.js              # OLD: Keep for reference
├── server.js                       # Updated to use new layer
└── .env                           # Updated with DB config
```

## Database Configuration

### SQLite (Default - Local Development)

No configuration needed! By default, the app uses SQLite.

```env
DATABASE_TYPE=sqlite
```

SQLite file will be created at: `server/translations.db`

### PostgreSQL (Cloud/Production)

Set the following environment variables:

```env
DATABASE_TYPE=postgresql
DB_HOST=your-db-host.com
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_NAME=lingopad
DB_SSL=false

# Optional: Connection pool settings
DB_POOL_MIN=0
DB_POOL_MAX=5
DB_POOL_ACQUIRE=30000
DB_POOL_IDLE=10000
```

## Quick Start

### Local Development (SQLite)

```bash
# 1. Install dependencies (already done)
npm install

# 2. Start the server
npm run dev

# The database will be created automatically
```

### Production (PostgreSQL)

```bash
# 1. Create a PostgreSQL database
createdb lingopad

# 2. Set environment variables
export DATABASE_TYPE=postgresql
export DB_HOST=your-server
export DB_USER=postgres
export DB_PASSWORD=your_password
export DB_NAME=lingopad

# 3. Start the server
npm run dev
```

## API Usage (No Changes!)

All existing API endpoints work exactly the same:

```javascript
// Save translation
POST /save-translation
{
  "inputText": "Hello",
  "translatedText": "नमस्ते",
  "pronunciation": "namaste",
  "targetLanguage": "hindi",
  "translationMethod": "nllb"
}

// Get all translations
GET /saved-translations?limit=100&offset=0

// Clear all translations
DELETE /clear-translations
```

## Code Changes

### Before (Raw SQLite3)

```javascript
import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('translations.db');

// Using callback-based queries
db.run(
  'INSERT INTO translations (input_text, ...) VALUES (?, ...)',
  [data],
  function(err) {
    if (err) console.error(err);
    // ...
  }
);

db.all('SELECT * FROM translations', [], (err, rows) => {
  // ...
});
```

### After (Sequelize ORM)

```javascript
import TranslationRepository from './models/TranslationRepository.js';

// Using async/await with ORM
const saved = await TranslationRepository.save({
  inputText: 'Hello',
  translatedText: 'नमस्ते',
  // ...
});

const allTranslations = await TranslationRepository.getAll(limit, offset);
```

## Repository Methods

All database operations go through `TranslationRepository`:

### save(translationData)
Save a new translation
```javascript
const result = await TranslationRepository.save({
  inputText: 'Hello',
  translatedText: 'नमस्ते',
  pronunciation: 'namaste',
  sourceLanguage: 'english',
  targetLanguage: 'hindi',
  translationMethod: 'nllb'
});
// Returns: { id, inputText, translatedText, ... }
```

### getAll(limit, offset)
Get all translations paginated
```javascript
const translations = await TranslationRepository.getAll(limit = 100, offset = 0);
// Returns: Array of translation objects
```

### getById(id)
Get specific translation
```javascript
const translation = await TranslationRepository.getById(5);
```

### getByLanguage(targetLanguage, limit, offset)
Get translations in specific language
```javascript
const hindiTranslations = await TranslationRepository.getByLanguage('hindi', 100, 0);
```

### search(query, limit, offset)
Search translations
```javascript
const results = await TranslationRepository.search('hello', 100, 0);
// Searches both inputText and translatedText
```

### deleteById(id)
Delete specific translation
```javascript
const result = await TranslationRepository.deleteById(5);
```

### clearAll()
Delete all translations
```javascript
const result = await TranslationRepository.clearAll();
```

### count()
Get total number of translations
```javascript
const total = await TranslationRepository.count();
```

### getStatistics()
Get translation statistics
```javascript
const stats = await TranslationRepository.getStatistics();
// Returns:
// {
//   totalTranslations: 150,
//   totalLanguages: 5,
//   languageCounts: { hindi: 50, tamil: 40, ... },
//   methodCounts: { nllb: 100, aws: 50 }
// }
```

## Database Schema

### translations table

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key, auto-increment |
| input_text | TEXT | Original text |
| translated_text | TEXT | Translated text |
| pronunciation | TEXT | Pronunciation guide |
| source_language | VARCHAR(50) | Source language (default: english) |
| target_language | VARCHAR(50) | Target language |
| translation_method | VARCHAR(50) | Method used (nllb, aws, huggingface, mock) |
| created_at | DATETIME | Creation timestamp |
| updated_at | DATETIME | Last update timestamp |

## Migration from SQLite to PostgreSQL

If you want to migrate from SQLite to PostgreSQL:

```bash
# 1. Export data from SQLite
npm run export:sqlite

# 2. Set up PostgreSQL environment variables
# 3. Update DATABASE_TYPE=postgresql
# 4. Start server (Sequelize will create tables)
# 5. Import data into PostgreSQL
npm run import:postgres
```

*Note: Migration scripts can be added if needed*

## Advantages of This Refactor

### 1. Database Agnostic
- Switch between SQLite and PostgreSQL with just environment variables
- Add more databases later (MySQL, MariaDB, etc.)

### 2. Type Safety (Optional)
- Can add TypeScript for better IDE support
- Self-documenting code with types

### 3. Query Builder
- Sequelize provides type-safe query builder
- Prevents SQL injection naturally
- More readable queries

### 4. Async/Await
- No more callback hell
- Better error handling with try/catch
- Cleaner code

### 5. Migrations
- Manage schema changes with migrations (future)
- Version control your database schema
- Easy rollbacks

### 6. Relationships
- Support for table relationships (future)
- Foreign keys, joins, etc.

### 7. Connection Pooling
- Automatic connection reuse
- Better performance under load
- Configurable pool size

## Testing Database Connection

```bash
# Test if database is configured correctly
curl http://localhost:3001/get-started

# The response will show which database is being used
```

## Troubleshooting

### "database is locked" (SQLite)
This usually means:
1. Multiple server instances are running
2. A transaction wasn't properly closed
3. File permissions issue

Solution:
```bash
# Kill all Node processes
pkill -f "node server"

# Remove lock file (if exists)
rm translations.db-wal
rm translations.db-shm

# Start fresh
npm run dev
```

### "connection refused" (PostgreSQL)
1. Check PostgreSQL is running: `psql -U postgres -c "SELECT 1"`
2. Check credentials: `psql -U <user> -d <dbname> -h <host>`
3. Check firewall: `telnet <host> 5432`

### "table does not exist"
The Sequelize sync should create tables automatically on startup. If not:

```bash
# Check server logs
npm run dev

# Manually create tables
# (This should happen automatically but you can force it)
```

## Performance Considerations

### SQLite
- Good for: Development, small deployments, demos
- Max connections: 1 (single file)
- Max concurrent users: ~10-20
- Typical use case: Local development

### PostgreSQL
- Good for: Production, scaling, concurrent users
- Max connections: Configurable (default 100)
- Max concurrent users: 100+
- Typical use case: Cloud deployment

## Next Steps

1. Test with both SQLite and PostgreSQL
2. Add migration scripts if needed
3. Consider adding model relationships
4. Add validation rules as needed
5. Monitor performance with each database

## Resources

- Sequelize Documentation: https://sequelize.org/
- SQLite3: https://www.sqlite.org/
- PostgreSQL: https://www.postgresql.org/
- Connection Pooling: https://en.wikipedia.org/wiki/Connection_pool
