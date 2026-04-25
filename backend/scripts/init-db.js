const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDatabase() {
  const sql = neon(process.env.DATABASE_URL);

  try {
    console.log('Connecting to database...');

    // Read schema file
    const schemaPath = path.join(__dirname, '..', 'database-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Execute the entire schema as one query
    console.log('Executing schema...');
    await sql`${schema}`;

    console.log('Database initialized successfully!');

  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initDatabase();