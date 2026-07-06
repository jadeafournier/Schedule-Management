import { useEffect, useState } from 'react';
import { deleteSleepRecord, fetchSleepRecords } from '../api/sleepRecords';
import { formatDuration } from '../utils/formatDuration';

function formatDateTime(isoString) {
  return new Date(isoString).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function SleepRecordTable({ refreshKey, onRecordClick, onRecordDeleted }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadRecords() {
      setLoading(true);
      setError('');

      try {
        const data = await fetchSleepRecords();
        if (!cancelled) {
          setRecords(data);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadRecords();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  async function handleDelete(id) {
    setError('');
    setDeletingId(id);

    try {
      await deleteSleepRecord(id);
      onRecordDeleted?.();
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="records-table-wrap">
      {loading && <p className="panel-message">Loading records...</p>}
      {error && <p className="panel-message error">{error}</p>}

      {!loading && !error && records.length === 0 && (
        <p className="panel-message">No sleep records yet.</p>
      )}

      {!loading && !error && records.length > 0 && (
        <table className="records-table">
          <thead>
            <tr>
              <th>Start time</th>
              <th>End time</th>
              <th>Duration</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr
                key={record.id}
                className="records-table-row"
                onClick={() => onRecordClick?.(record)}
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onRecordClick?.(record);
                  }
                }}
                aria-label={`Edit sleep record from ${formatDateTime(record.startTime)}`}
              >
                <td>{formatDateTime(record.startTime)}</td>
                <td>{formatDateTime(record.endTime)}</td>
                <td>{formatDuration(record.durationSeconds)}</td>
                <td className="records-table-actions">
                  <button
                    type="button"
                    className="icon-button delete-button"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDelete(record.id);
                    }}
                    disabled={deletingId === record.id}
                    aria-label={deletingId === record.id ? 'Deleting record' : 'Delete record'}
                    title={deletingId === record.id ? 'Deleting...' : 'Delete'}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="icon-button-svg">
                      <path
                        fill="currentColor"
                        d="M9 3h6a1 1 0 0 1 1 1v1h4a1 1 0 1 1 0 2h-1.05l-1.03 13.04A2.5 2.5 0 0 1 15.42 22H8.58a2.5 2.5 0 0 1-2.49-2.91L4.05 7H3a1 1 0 1 1 0-2h4V4a1 1 0 0 1 1-1Zm1 2h4V5h-4V5Zm-2.86 2 1 12.01c.05.55.51.99 1.07.99h6.78c.56 0 1.02-.44 1.07-.99L17.86 7H7.14Z"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
