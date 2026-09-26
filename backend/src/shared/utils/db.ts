import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Single shared pg pool for the whole backend.
// Every module (core, Admin, users) imports this instead of opening its own connection.
export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'ui_builder',
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});
