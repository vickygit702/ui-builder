import fs from 'fs';
import path from 'path';
import { pool } from '../../shared/utils/db';

// Minimal, dependency-free migration runner: runs every .sql file in this
// folder in filename order. No ORM yet -- schema.ts below mirrors these
// tables by hand until the project grows enough to justify one.
async function runMigrations() {
  const dir = __dirname;
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  const client = await pool.connect();
  try {
    for (const file of files) {
      const sql = fs.readFileSync(path.join(dir, file), 'utf-8');
      console.log(`Running migration: ${file}`);
      await client.query(sql);
    }
    console.log('All migrations applied successfully.');
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
