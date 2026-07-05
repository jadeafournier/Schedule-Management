const express = require('express');
const SleepRecord = require('../models/SleepRecord');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const records = await SleepRecord.findRecent(30);
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch sleep records', error: error.message });
  }
});

router.post('/', async (req, res) => {
  const { startTime, endTime, durationSeconds } = req.body;

  if (!startTime || !endTime || !durationSeconds) {
    return res.status(400).json({ message: 'startTime, endTime, and durationSeconds are required' });
  }

  try {
    const record = await SleepRecord.create({ startTime, endTime, durationSeconds });
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: 'Failed to save sleep record', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: 'Invalid record id' });
  }

  try {
    const deleted = await SleepRecord.removeById(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Sleep record not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete sleep record', error: error.message });
  }
});

module.exports = router;
