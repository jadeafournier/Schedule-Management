import { useState } from 'react';
import SleepRecordDialog from './SleepRecordDialog';
import SleepRecordTable from './SleepRecordTable';
import WeeklyAnalysisDialog from './WeeklyAnalysisDialog';

export default function SleepRecordForm({ refreshKey, onRecordSaved }) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isWeeklyDialogOpen, setIsWeeklyDialogOpen] = useState(false);

  return (
    <section className="panel form-panel">
      <div className="records-section-header">
        <button type="button" className="primary-button" onClick={() => setIsAddDialogOpen(true)}>
          Add Time
        </button>
        <button
          type="button"
          className="secondary-button"
          onClick={() => setIsWeeklyDialogOpen(true)}
        >
          Weekly Analysis
        </button>
      </div>

      <SleepRecordTable refreshKey={refreshKey} onRecordDeleted={onRecordSaved} />

      <SleepRecordDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSaved={onRecordSaved}
      />

      <WeeklyAnalysisDialog
        open={isWeeklyDialogOpen}
        refreshKey={refreshKey}
        onClose={() => setIsWeeklyDialogOpen(false)}
      />
    </section>
  );
}
