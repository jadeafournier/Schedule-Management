import { useEffect, useState } from 'react';
import { createSleepRecord } from '../api/sleepRecords';
import { formatDuration } from '../utils/formatDuration';
import SleepSnowmanFace from './SleepSnowmanFace';

export default function SleepToggleButton({ onRecordSaved }) {
  const [isAsleep, setIsAsleep] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAsleep || !startTime) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isAsleep, startTime]);

  async function handleToggle() {
    setError('');

    if (!isAsleep) {
      setStartTime(Date.now());
      setElapsedSeconds(0);
      setIsAsleep(true);
      return;
    }

    const endTime = Date.now();
    const durationSeconds = Math.max(1, Math.floor((endTime - startTime) / 1000));

    setSaving(true);

    try {
      await createSleepRecord({
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        durationSeconds,
      });

      setIsAsleep(false);
      setStartTime(null);
      setElapsedSeconds(0);
      onRecordSaved?.();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="sleep-toggle-section">
      <button
        type="button"
        className={`sleep-toggle-button${isAsleep ? ' is-asleep' : ''}`}
        onClick={handleToggle}
        disabled={saving}
        aria-pressed={isAsleep}
        aria-label={isAsleep ? 'Mark as awake' : 'Mark as asleep'}
      >
        <SleepSnowmanFace isAsleep={isAsleep} />
      </button>

      <p className="sleep-toggle-status" aria-live="polite">
        {saving
          ? 'Saving sleep record...'
          : isAsleep
            ? `Sleeping · ${formatDuration(elapsedSeconds)}`
            : 'Tap when you fall asleep'}
      </p>

      {error && <p className="panel-message error sleep-toggle-error">{error}</p>}
    </section>
  );
}
