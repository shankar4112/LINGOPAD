import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Database Configuration
 * Supports both SQLite (local development) and PostgreSQL (cloud/production)
 */

const dbType = process.env.DATABASE_TYPE || 'sqlite';
const nodeEnv = process.env.NODE_ENV || 'development';

let sequelize;

if (dbType === 'postgresql' || dbType === 'postgres') {
  // PostgreSQL Configuration
  const pgConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'lingopad',
    dialect: 'postgres',
    logging: nodeEnv === 'development' ? console.log : false,
    pool: {
      max: parseInt(process.env.DB_POOL_MAX || '5'),
      min: parseInt(process.env.DB_POOL_MIN || '0'),
      acquire: parseInt(process.env.DB_POOL_ACQUIRE || '30000'),
      idle: parseInt(process.env.DB_POOL_IDLE || '10000')
    },
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    }
  };

  console.log(`Initializing PostgreSQL database at ${pgConfig.host}:${pgConfig.port}/${pgConfig.database}`);
  sequelize = new Sequelize(
    pgConfig.database,
    pgConfig.username,
    pgConfig.password,
    pgConfig
  );
} else {
  // SQLite Configuration (Default)
  const sqlitePath = path.join(process.env.DB_STORAGE_PATH || path.dirname(__dirname), 'translations.db');

  const sqliteConfig = {
    dialect: 'sqlite',
    storage: sqlitePath,
    logging: nodeEnv === 'development' ? console.log : false
  };

  console.log(`Initializing SQLite database at ${sqlitePath}`);
  sequelize = new Sequelize(sqliteConfig);
}

/**
 * Test database connection
 */
export async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connection established successfully');
    return true;
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    return false;
  }
}

/**
 * Initialize database (create tables if they don't exist)
 */
export async function initializeDatabase() {
  try {
    // Test connection first
    if (!(await testConnection())) {
      throw new Error('Database connection failed');
    }

    // Sync all models with database
    await sequelize.sync({ alter: false });
    console.log('✓ Database synchronized successfully');
    return true;
  } catch (error) {
    console.error('✗ Database initialization failed:', error.message);
    return false;
  }
}

/**
 * Close database connection
 */
export async function closeDatabase() {
  try {
    await sequelize.close();
    console.log('✓ Database connection closed');
    return true;
  } catch (error) {
    console.error('✗ Error closing database:', error.message);
    return false;
  }
}

export default sequelize;
