const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Read the schema file
const schemaPath = path.join(__dirname, '../database/schema.sql');
let schemaSQL = fs.readFileSync(schemaPath, 'utf8');

// Database connection details
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'ApparelDesk',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
};

// Use pg library to execute the schema
const { Client } = require('pg');

async function runSchema() {
  const client = new Client({
    host: dbConfig.host,
    port: dbConfig.port,
    database: dbConfig.database,
    user: dbConfig.user,
    password: dbConfig.password,
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('✅ Connected to database');

    // Migrate existing tables if needed
    console.log('Checking for existing tables to migrate...');
    
    // Check and migrate contacts table
    try {
      const checkContacts = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'contacts' AND column_name = 'type'
      `);
      if (checkContacts.rows.length > 0) {
        console.log('⚠️  Migrating contacts table...');
        await client.query(`ALTER TABLE contacts RENAME COLUMN type TO contact_type;`);
        console.log('✅ Migrated contacts.type to contact_type');
      }
    } catch (error) {
      // Table might not exist yet
    }

    // Check and migrate coupon_codes table
    try {
      const checkCoupons = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'coupon_codes' AND column_name = 'status'
      `);
      if (checkCoupons.rows.length > 0) {
        console.log('⚠️  Migrating coupon_codes table...');
        // Add used column if it doesn't exist
        await client.query(`
          ALTER TABLE coupon_codes 
          ADD COLUMN IF NOT EXISTS used BOOLEAN DEFAULT false;
        `);
        // Migrate status to used
        await client.query(`
          UPDATE coupon_codes 
          SET used = (status = 'used');
        `);
        // Drop old status column
        await client.query(`ALTER TABLE coupon_codes DROP COLUMN IF EXISTS status;`);
        console.log('✅ Migrated coupon_codes.status to used');
      }
    } catch (error) {
      // Table might not exist yet
    }

    // Drop old indexes that might conflict
    try {
      await client.query(`DROP INDEX IF EXISTS idx_coupon_codes_status;`);
    } catch (error) {
      // Index might not exist
    }

    console.log('Running schema...');
    
    // Execute the entire schema SQL file
    await client.query(schemaSQL);
    
    console.log('✅ Schema executed successfully!');
    console.log('✅ All tables, triggers, and indexes created!');

    await client.end();
    console.log('✅ Database setup complete!');
    process.exit(0);
  } catch (error) {
    // Check if it's just a "already exists" error
    if (error.message.includes('already exists') || 
        error.message.includes('duplicate key') ||
        (error.message.includes('relation') && error.message.includes('already exists'))) {
      console.log('⚠️  Some objects already exist (this is okay)');
      console.log('✅ Schema check complete!');
      await client.end();
      process.exit(0);
    } else {
      console.error('❌ Error running schema:', error.message);
      console.error('Error code:', error.code);
      await client.end();
      process.exit(1);
    }
  }
}

runSchema();
