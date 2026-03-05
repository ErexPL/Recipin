import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: process.env.POSTGRES_URL ? { rejectUnauthorized: false } : false
});

export const initDB = async () => {
  if (!process.env.POSTGRES_URL) {
    console.warn("POSTGRES_URL is not set. Skipping DB initialization.");
    return;
  }

  const client = await pool.connect();

  await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        passwordHash TEXT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

  await client.query(`
      CREATE TABLE IF NOT EXISTS recipes (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        author_id INTEGER NOT NULL REFERENCES users(id),
        author_name TEXT NOT NULL,
        image TEXT,
        prepTime TEXT,
        difficulty TEXT,
        ingredients TEXT,
        steps TEXT,
        upvotes INTEGER DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

  await client.query(`
      CREATE TABLE IF NOT EXISTS saves (
        user_id INTEGER NOT NULL REFERENCES users(id),
        recipe_id INTEGER NOT NULL REFERENCES recipes(id),
        PRIMARY KEY (user_id, recipe_id)
      )
    `);

  await client.query(`
      CREATE TABLE IF NOT EXISTS upvotes (
        user_id INTEGER NOT NULL REFERENCES users(id),
        recipe_id INTEGER NOT NULL REFERENCES recipes(id),
        PRIMARY KEY (user_id, recipe_id)
      )
    `);

  client.release();
  console.log("PostgreSQL Database initialized.");
};
