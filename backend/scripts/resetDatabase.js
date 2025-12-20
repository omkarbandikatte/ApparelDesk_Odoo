const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'ApparelDesk',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

async function resetDatabase() {
  try {
    await client.connect();
    console.log('✅ Connected to database');
    
    console.log('⚠️  Dropping all existing tables...');
    
    // Drop all tables in correct order (respecting foreign keys)
    const dropOrder = [
      'payments',
      'customer_invoices',
      'vendor_bills',
      'sale_order_lines',
      'purchase_order_lines',
      'sale_orders',
      'purchase_orders',
      'coupon_codes',
      'discount_offers',
      'payment_terms',
      'products',
      'contacts',
      'users',
      'settings'
    ];
    
    for (const table of dropOrder) {
      try {
        await client.query(`DROP TABLE IF EXISTS ${table} CASCADE;`);
        console.log(`  ✓ Dropped ${table}`);
      } catch (error) {
        console.log(`  - ${table} doesn't exist or already dropped`);
      }
    }
    
    console.log('✅ All old tables dropped');
    console.log('Now run: npm run setup-db');
    
    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    await client.end();
    process.exit(1);
  }
}

resetDatabase();

