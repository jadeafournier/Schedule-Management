require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./db');
const sleepRecordsRouter = require('./routes/sleepRecords');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/sleep-records', sleepRecordsRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

async function startServer() {
  try {
    await initDatabase();
    console.log('Connected to MySQL');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('MySQL connection error:', error.message);
    process.exit(1);
  }
}

startServer();
