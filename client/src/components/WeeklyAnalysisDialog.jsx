import { useEffect, useRef } from 'react';
import DialogCloseButton from './DialogCloseButton';
import SleepAnalysisChart from './SleepAnalysisChart';

export default function WeeklyAnalysisDialog({ open, refreshKey, onClose }) {
  const dialogRef = useRef(null);

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

  function handleClose() {
    onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      className="app-dialog weekly-analysis-dialog"
      onCancel={(event) => {
        event.preventDefault();
        handleClose();
      }}
      onClose={handleClose}
    >
      <div className="app-dialog-panel panel app-dialog-panel-with-close weekly-analysis-dialog-panel">
        <DialogCloseButton onClick={handleClose} />
        <SleepAnalysisChart refreshKey={refreshKey} embedded dialogOpen={open} />
      </div>
    </dialog>
  );
}
