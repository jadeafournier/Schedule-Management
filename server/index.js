require('dotenv').config();

const { startServer } = require('./app');

startServer().catch((error) => {
  console.error('MySQL connection error:', error.message);
  process.exit(1);
});
