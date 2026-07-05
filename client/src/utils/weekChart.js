export function getDateKeyFromDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getFirstDayOfWeek() {
  try {
    const locale = new Intl.Locale(navigator.language);
    if (locale.weekInfo?.firstDay) {
      return locale.weekInfo.firstDay === 7 ? 0 : locale.weekInfo.firstDay - 1;
    }
  } catch {
    // Use Sunday when locale week info is unavailable.
  }

  return 0;
}

export function getWeekRange(referenceDate = new Date()) {
  const weekStart = new Date(referenceDate);
  weekStart.setHours(0, 0, 0, 0);

  const firstDayOfWeek = getFirstDayOfWeek();
  const dayOffset = (weekStart.getDay() - firstDayOfWeek + 7) % 7;
  weekStart.setDate(weekStart.getDate() - dayOffset);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  return { weekStart, weekEnd };
}

export function formatWeekOptionLabel(weekStart, weekEnd) {
  const startLabel = weekStart.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
  const endLabel = weekEnd.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return `${startLabel} – ${endLabel}`;
}

export function getWeekOptions(records, maxWeeks = 26) {
  const { weekStart: currentWeekStart } = getWeekRange();
  let earliestWeekStart = new Date(currentWeekStart);

  if (records.length > 0) {
    const earliestRecordDate = records.reduce((earliest, record) => {
      const recordDate = new Date(record.startTime);
      return recordDate < earliest ? recordDate : earliest;
    }, new Date(records[0].startTime));

    earliestWeekStart = getWeekRange(earliestRecordDate).weekStart;
  }

  const options = [];
  const cursor = new Date(currentWeekStart);

  while (cursor >= earliestWeekStart && options.length < maxWeeks) {
    const { weekStart, weekEnd } = getWeekRange(cursor);
    options.push({
      value: getDateKeyFromDate(weekStart),
      weekStart,
      weekEnd,
      label: formatWeekOptionLabel(weekStart, weekEnd),
    });
    cursor.setDate(cursor.getDate() - 7);
  }

  return options;
}

export function formatChartLabel(date) {
  const weekday = date.toLocaleDateString(undefined, { weekday: 'short' });
  const dateLabel = date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  return `${dateLabel} (${weekday})`;
}

function formatRecordTime(isoString) {
  return new Date(isoString).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function splitRecordByMidnight(record) {
  const start = new Date(record.startTime);
  const end = new Date(record.endTime);
  const portions = [];
  let cursor = new Date(start);

  while (cursor < end) {
    const dayStart = new Date(cursor);
    dayStart.setHours(0, 0, 0, 0);

    const nextMidnight = new Date(dayStart);
    nextMidnight.setDate(nextMidnight.getDate() + 1);

    const portionEnd = end < nextMidnight ? end : nextMidnight;
    const durationSeconds = Math.floor((portionEnd.getTime() - cursor.getTime()) / 1000);

    if (durationSeconds > 0) {
      const portionStartIso = cursor.toISOString();
      const portionEndIso = portionEnd.toISOString();

      portions.push({
        dateKey: getDateKeyFromDate(cursor),
        durationSeconds,
        startTime: portionStartIso,
        label: `${formatRecordTime(portionStartIso)} – ${formatRecordTime(portionEndIso)}`,
      });
    }

    cursor = portionEnd;
  }

  return portions;
}

export function buildChartData(records, weekStart, weekEnd) {
  const weekStartKey = getDateKeyFromDate(weekStart);
  const weekEndKey = getDateKeyFromDate(weekEnd);
  const sessionsByDate = new Map();

  records.forEach((record) => {
    splitRecordByMidnight(record).forEach((portion) => {
      if (portion.dateKey < weekStartKey || portion.dateKey > weekEndKey) {
        return;
      }

      const sessions = sessionsByDate.get(portion.dateKey) ?? [];
      sessions.push({
        hours: portion.durationSeconds / 3600,
        durationSeconds: portion.durationSeconds,
        startTime: portion.startTime,
        label: portion.label,
      });
      sessionsByDate.set(portion.dateKey, sessions);
    });
  });

  let maxSessions = 0;
  const chartData = [];
  const cursor = new Date(weekStart);
  cursor.setHours(0, 0, 0, 0);

  while (cursor <= weekEnd) {
    const dateKey = getDateKeyFromDate(cursor);
    const sessions = (sessionsByDate.get(dateKey) ?? [])
      .slice()
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    maxSessions = Math.max(maxSessions, sessions.length);

    const totalHours = sessions.reduce((sum, session) => sum + session.hours, 0);
    const entry = {
      date: formatChartLabel(cursor),
      hours: Number(totalHours.toFixed(2)),
      sessionCount: sessions.length,
      sessions: sessions.map((session) => ({
        label: session.label,
        hours: Number(session.hours.toFixed(2)),
        durationSeconds: session.durationSeconds,
      })),
    };

    sessions.forEach((session, index) => {
      entry[`session_${index}`] = Number(session.hours.toFixed(2));
    });

    chartData.push(entry);
    cursor.setDate(cursor.getDate() + 1);
  }

  return { chartData, maxSessions };
}

export const SESSION_BAR_COLORS = ['#6366f1', '#8b5cf6', '#38bdf8', '#a78bfa', '#60a5fa', '#c084fc'];
