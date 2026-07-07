const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./db');
const sleepRecordsRouter = require('./routes/sleepRecords');

function getPublicPath() {
  const packagedPublic = path.join(__dirname, '..', 'public');

  if (fs.existsSync(path.join(packagedPublic, 'index.html'))) {
    return packagedPublic;
  }

  if (process.pkg) {
    return path.join(path.dirname(process.execPath), 'public');
  }

  return path.join(__dirname, '..', 'client', 'dist');
}

function createApp({ serveStatic = false } = {}) {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use('/api/sleep-records', sleepRecordsRouter);

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  if (serveStatic) {
    const publicPath = getPublicPath();

    if (fs.existsSync(publicPath)) {
      app.use(express.static(publicPath));

      app.get(/^(?!\/api).*/, (_req, res) => {
        res.sendFile(path.join(publicPath, 'index.html'));
      });
    } else {
      console.warn(`Static files not found at ${publicPath}`);
    }
  }

  return app;
}

async function startServer(options = {}) {
  const { serveStatic = false, openBrowser = false } = options;

  await initDatabase();
  console.log('Connected to MySQL');

  const app = createApp({ serveStatic });
  const port = Number(process.env.PORT || 5000);

  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      const url = `http://localhost:${port}`;
      console.log(`Server running on ${url}`);

      if (openBrowser && process.platform === 'win32') {
        require('child_process').exec(`start "" "${url}"`);
      }

      resolve({ port, url });
    });

    server.on('error', reject);
  });
}

module.exports = {
  createApp,
  startServer,
  getPublicPath,
};
