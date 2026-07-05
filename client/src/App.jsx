import { useState } from 'react';
import SleepToggleButton from './components/SleepToggleButton';
import SleepRecordForm from './components/SleepRecordForm';
import './App.css';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRecordsChanged = () => setRefreshKey((value) => value + 1);

  return (
    <div className="app">
      <header className="app-header">
        <p className="eyebrow">Schedule Management Program</p>
        <h1>Sleep Tracker</h1>
        <p className="subtitle">Review your sleep trends and add records manually.</p>
      </header>

      <main className="app-main">
        <SleepToggleButton onRecordSaved={handleRecordsChanged} />
        <SleepRecordForm refreshKey={refreshKey} onRecordSaved={handleRecordsChanged} />
      </main>
    </div>
  );
}

export default App;
