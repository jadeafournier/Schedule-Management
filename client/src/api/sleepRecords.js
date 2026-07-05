const API_BASE = '/api';

export async function fetchSleepRecords() {
  const response = await fetch(`${API_BASE}/sleep-records`);
  if (!response.ok) {
    throw new Error('Failed to load sleep records');
  }
  return response.json();
}

export async function createSleepRecord({ startTime, endTime, durationSeconds }) {
  const response = await fetch(`${API_BASE}/sleep-records`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ startTime, endTime, durationSeconds }),
  });

  if (!response.ok) {
    throw new Error('Failed to save sleep record');
  }

  return response.json();
}

export async function deleteSleepRecord(id) {
  const response = await fetch(`${API_BASE}/sleep-records/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete sleep record');
  }
}
