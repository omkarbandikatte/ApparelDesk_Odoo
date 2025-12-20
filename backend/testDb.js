const sequelize = require('./config/database');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  }
})();
