import { useEffect, useMemo, useRef, useState } from 'react';
import { createSleepRecord } from '../api/sleepRecords';
import { formatDuration } from '../utils/formatDuration';

function calculateDurationSeconds(startTime, endTime) {
  if (!startTime || !endTime) {
    return 0;
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    return 0;
  }

  return Math.floor((end - start) / 1000);
}

export default function SleepRecordDialog({ open, onClose, onSaved }) {
  const dialogRef = useRef(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const durationSeconds = useMemo(
    () => calculateDurationSeconds(startTime, endTime),
    [startTime, endTime]
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return undefined;
    }

    if (open && !dialog.open) {
      dialog.showModal();
    }

    if (!open && dialog.open) {
      dialog.close();
    }

    return undefined;
  }, [open]);

  useEffect(() => {
    if (!open) {
      setStartTime('');
      setEndTime('');
      setError('');
      setSaving(false);
    }
  }, [open]);

  function handleClose() {
    if (saving) {
      return;
    }

    onClose();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!startTime || !endTime) {
      setError('Start time and end time are required.');
      return;
    }

    if (durationSeconds <= 0) {
      setError('End time must be after start time.');
      return;
    }

    setSaving(true);

    try {
      await createSleepRecord({
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        durationSeconds,
      });

      onSaved?.();
      onClose();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="app-dialog sleep-record-dialog"
      onCancel={(event) => {
        event.preventDefault();
        handleClose();
      }}
      onClose={handleClose}
    >
      <div className="app-dialog-panel panel app-dialog-panel-with-close sleep-record-dialog-panel">
        <button type="button" className="dialog-close-button" onClick={handleClose} disabled={saving}>
          Close
        </button>

        <div className="panel-header">
          <h2>Add Sleep Record</h2>
          <p>Enter your sleep times and save the calculated duration.</p>
        </div>

        <form className="sleep-form sleep-form-dialog" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Start time</span>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
              required
            />
          </label>

          <label className="form-field">
            <span>End time</span>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
              required
            />
          </label>

          <label className="form-field">
            <span>Duration</span>
            <input type="text" value={formatDuration(durationSeconds)} readOnly />
          </label>

          <button type="submit" className="primary-button" disabled={saving || durationSeconds <= 0}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </form>

        {error && <p className="panel-message error">{error}</p>}
      </div>
    </dialog>
  );
}
