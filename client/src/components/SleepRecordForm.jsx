import { useState } from 'react';
import SleepRecordDialog from './SleepRecordDialog';
import SleepRecordTable from './SleepRecordTable';
import WeeklyAnalysisDialog from './WeeklyAnalysisDialog';

export default function SleepRecordForm({ refreshKey, onRecordSaved }) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isWeeklyDialogOpen, setIsWeeklyDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  function handleEditRecord(record) {
    setEditingRecord(record);
    setIsEditDialogOpen(true);
  }

  function handleCloseEditDialog() {
    setIsEditDialogOpen(false);
    setEditingRecord(null);
  }

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

      <SleepRecordTable
        refreshKey={refreshKey}
        onRecordClick={handleEditRecord}
        onRecordDeleted={onRecordSaved}
      />

      <SleepRecordDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSaved={onRecordSaved}
      />

      <SleepRecordDialog
        open={isEditDialogOpen}
        record={editingRecord}
        onClose={handleCloseEditDialog}
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
