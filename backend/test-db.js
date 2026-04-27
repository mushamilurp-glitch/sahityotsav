const { neon } = require('@neondatabase/serverless');
require('dotenv').config();
console.log('Test CWD:', process.cwd());
console.log('Test __dirname:', __dirname);
console.log('Test DATABASE_URL:', process.env.DATABASE_URL);

const sql = neon('postgresql://neondb_owner:npg_m0xvoAwC5gXU@ep-noisy-mouse-anihh6up.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require');

async function test() {
  try {
    const result = await sql`SELECT * FROM users`;
    console.log('Users:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

test();