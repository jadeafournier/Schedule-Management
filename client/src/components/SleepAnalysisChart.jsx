import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { fetchSleepRecords } from '../api/sleepRecords';
import { formatDuration, formatHours } from '../utils/formatDuration';
import {
  SESSION_BAR_COLORS,
  buildChartData,
  getDateKeyFromDate,
  getWeekOptions,
  getWeekRange,
} from '../utils/weekChart';

function SleepChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  const data = payload[0]?.payload;
  if (!data) {
    return null;
  }

  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-title">{label}</p>
      <p className="chart-tooltip-total">Daily total: {formatHours(data.hours * 3600)} h</p>

      {data.sessionCount > 0 ? (
        <>
          <p className="chart-tooltip-note">
            Combined from {data.sessionCount} portion{data.sessionCount === 1 ? '' : 's'}:
          </p>
          <ul className="chart-tooltip-list">
            {data.sessions.map((session, index) => (
              <li key={`${session.label}-${index}`}>
                <span>{session.label}</span>
                <span>{formatDuration(session.durationSeconds)}</span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="chart-tooltip-note">No sleep records for this day.</p>
      )}
    </div>
  );
}

export default function SleepAnalysisChart({ refreshKey, embedded = false, dialogOpen = false }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedWeekKey, setSelectedWeekKey] = useState(() =>
    getDateKeyFromDate(getWeekRange().weekStart)
  );

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

  useEffect(() => {
    if (embedded && dialogOpen) {
      setSelectedWeekKey(getDateKeyFromDate(getWeekRange().weekStart));
    }
  }, [embedded, dialogOpen]);

  const weekOptions = useMemo(() => getWeekOptions(records), [records]);

  useEffect(() => {
    if (weekOptions.length === 0) {
      return;
    }

    const hasSelectedWeek = weekOptions.some((option) => option.value === selectedWeekKey);
    if (!hasSelectedWeek) {
      setSelectedWeekKey(weekOptions[0].value);
    }
  }, [weekOptions, selectedWeekKey]);

  const selectedWeek = useMemo(() => {
    const matchedWeek = weekOptions.find((option) => option.value === selectedWeekKey);
    if (matchedWeek) {
      return matchedWeek;
    }

    return getWeekRange();
  }, [weekOptions, selectedWeekKey]);

  const { chartData, maxSessions } = useMemo(
    () => buildChartData(records, selectedWeek.weekStart, selectedWeek.weekEnd),
    [records, selectedWeek.weekStart, selectedWeek.weekEnd]
  );

  const sessionBars = useMemo(
    () => Array.from({ length: Math.max(maxSessions, 1) }, (_, index) => index),
    [maxSessions]
  );

  const chartBody = (
    <>
      <div className={`panel-header${embedded ? ' chart-panel-header-embedded' : ''}`}>
        <div>
          <h2>{embedded ? 'Weekly Analysis' : 'Sleep Analysis'}</h2>
          <p>Daily totals sum sleep time within each calendar day, split at midnight</p>
        </div>

        {embedded && (
          <label className="week-select-field">
            <span>Week</span>
            <select
              value={selectedWeekKey}
              onChange={(event) => setSelectedWeekKey(event.target.value)}
              disabled={loading || weekOptions.length === 0}
            >
              {weekOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {loading && <p className="panel-message">Loading chart...</p>}
      {error && <p className="panel-message error">{error}</p>}

      {!loading && !error && (
        <>
          <div className="chart-container chart-container-enhanced">
            <ResponsiveContainer width="100%" height={360}>
              <BarChart
                data={chartData}
                margin={{ top: 12, right: 12, left: 4, bottom: embedded ? 24 : 8 }}
                barCategoryGap="24%"
              >
                <defs>
                  {SESSION_BAR_COLORS.map((color, index) => (
                    <linearGradient key={color} id={`sessionGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity="0.95" />
                      <stop offset="100%" stopColor={color} stopOpacity="0.65" />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(148, 163, 184, 0.16)" strokeDasharray="4 4" />
                <XAxis
                  dataKey="date"
                  stroke="#94a3b8"
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(148, 163, 184, 0.25)' }}
                  interval={0}
                  angle={embedded ? -18 : 0}
                  textAnchor={embedded ? 'end' : 'middle'}
                  height={embedded ? 58 : 32}
                  tick={{ fill: '#cbd5e1', fontSize: 12 }}
                />
                <YAxis
                  stroke="#94a3b8"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickFormatter={(value) => `${value}h`}
                  label={{
                    value: 'Total hours',
                    angle: -90,
                    position: 'insideLeft',
                    fill: '#94a3b8',
                    style: { textAnchor: 'middle' },
                  }}
                />
                <Tooltip content={<SleepChartTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }} />
                {maxSessions > 1 && (
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{ paddingBottom: '12px', fontSize: '12px', color: '#94a3b8' }}
                    formatter={(value) =>
                      value.startsWith('session_') ? `Record ${Number(value.split('_')[1]) + 1}` : value
                    }
                  />
                )}
                {sessionBars.map((sessionIndex) => (
                  <Bar
                    key={`session_${sessionIndex}`}
                    dataKey={`session_${sessionIndex}`}
                    name={`session_${sessionIndex}`}
                    stackId="dailyTotal"
                    radius={sessionIndex === sessionBars.length - 1 ? [8, 8, 0, 0] : [0, 0, 0, 0]}
                    maxBarSize={48}
                  >
                    {chartData.map((entry, entryIndex) => (
                      <Cell
                        key={`${entry.date}-${sessionIndex}`}
                        fill={
                          entry.sessionCount > 0
                            ? `url(#sessionGradient${sessionIndex % SESSION_BAR_COLORS.length})`
                            : 'transparent'
                        }
                      />
                    ))}
                  </Bar>
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="chart-footnote">
            Sleep that crosses midnight is split at 12:00 AM. Each stacked segment is one
            portion of a record added together for that day.
          </p>
        </>
      )}
    </>
  );

  if (embedded) {
    return <div className="chart-panel-embedded">{chartBody}</div>;
  }

  return <section className="panel chart-panel">{chartBody}</section>;
}
