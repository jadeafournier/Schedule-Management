const path = require('path');
const fs = require('fs');

function loadEnv() {
  const candidates = [
    path.join(path.dirname(process.execPath), '.env'),
    path.join(__dirname, '.env'),
  ];

  for (const envPath of candidates) {
    if (fs.existsSync(envPath)) {
      require('dotenv').config({ path: envPath });
      return;
    }
  }

  const envDir = path.dirname(process.execPath);
  const examplePath = path.join(envDir, '.env.example');

  require('dotenv').config({ path: path.join(__dirname, '.env') });

  if (fs.existsSync(examplePath)) {
    console.warn('No .env file found. Copy .env.example to .env and edit your MySQL settings.');
  }
}

loadEnv();

const { startServer } = require('./app');

startServer({ serveStatic: true, openBrowser: true }).catch((error) => {
  console.error('Failed to start:', error.message);
  process.exit(1);
});
