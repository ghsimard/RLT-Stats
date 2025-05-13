import { Pool } from 'pg';
import { config } from './config';
const dotenv = require('dotenv');

dotenv.config();

// Log connection details (hiding password)
if (config.database.connectionString) {
  console.log('Connecting to database using connection string (password hidden)');
} else {
  console.log('Connecting to database using parameters:', {
    host: config.database.host,
    database: config.database.database,
    user: config.database.user,
    // Password is hidden for security
  });
}

// Create connection pool with either connection string or individual parameters
export const pool = new Pool(
  config.database.connectionString
    ? {
  connectionString: config.database.connectionString,
  ssl: config.database.ssl
      }
    : {
        host: config.database.host,
        user: config.database.user,
        password: config.database.password,
        database: config.database.database,
        ssl: config.database.ssl
      }
);

// Test the connection
pool.query('SELECT NOW()')
  .then(() => {
    console.log('Successfully connected to the database');
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });

export async function getTableColumns(tableName: string): Promise<string[]> {
  const query = `
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = $1
  `;
  
  try {
    const { rows } = await pool.query(query, [tableName]);
    console.log(`Found columns for table ${tableName}:`, rows.map(r => r.column_name));
    return rows.map(row => row.column_name);
  } catch (error) {
    console.error(`Error getting columns for table ${tableName}:`, error);
    throw error;
  }
}