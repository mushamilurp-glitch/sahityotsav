const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDatabase() {
  const sql = neon('postgresql://neondb_owner:npg_m0xvoAwC5gXU@ep-noisy-mouse-anihh6up.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require');

  try {
    console.log('Connecting to database...');
    console.log('DATABASE_URL:', 'postgresql://neondb_owner:npg_m0xvoAwC5gXU@ep-noisy-mouse-anihh6up.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require');

    // Read schema file
    const schemaPath = path.join(__dirname, '..', 'database-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split schema into individual statements and execute them
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log('Executing schema...');

    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Executing:', statement.substring(0, 50) + '...');
        await sql.unsafe(statement);
      }
    }

    console.log('Database initialized successfully!');

    // Verify the user was inserted
    const users = await sql`SELECT * FROM users`;
    console.log('Users after init:', users);

  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initDatabase();