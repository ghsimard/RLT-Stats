import dotenv from 'dotenv';

// Load the appropriate .env file based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' 
  ? '.env.production' 
  : '.env.development';

dotenv.config({ path: envFile });

// Parse CORS origins from comma-separated string
const corsOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',') 
  : ['http://localhost:4000'];

export const config = {
  ports: {
    backend: parseInt(process.env.PORT || '4001', 10)
  },
  cors: {
    origin: corsOrigins
  },
  database: {
    // If a connection string is provided, use it
    connectionString: process.env.DB_CONNECTION_STRING || undefined,
    
    // Otherwise use individual parameters
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'COSMO_RLT',
    
    // SSL settings for production
    ssl: process.env.NODE_ENV === 'production' ? {
      rejectUnauthorized: false
    } : false
  }
}; 