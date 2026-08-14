import { useMemo, useState } from 'react';

const PASSCODE_KEY = 'workout-tracker-passcode';
const WORKOUTS_KEY = 'workout-tracker-workouts';
const DEFAULT_PASSCODE = '1234';

const initialWorkouts = [
  {
    id: 'w1',
    name: 'Bench Press',
    category: 'Upper Body',
    sets: 4,
    reps: 8,
    weight: 80,
    date: '2026-08-14',
    notes: 'Focus on controlled lowering.'
  },
  {
    id: 'w2',
    name: 'Goblet Squat',
    category: 'Legs',
    sets: 4,
    reps: 10,
    weight: 28,
    date: '2026-08-12',
    notes: 'Keep chest tall and brace core.'
  },
  {
    id: 'w3',
    name: 'Row Intervals',
    category: 'Conditioning',
    sets: 5,
    reps: 1,
    weight: 0,
    date: '2026-08-10',
    notes: 'Moderate pace with full recovery.'
  }
];

const getToday = () => new Date().toISOString().slice(0, 10);

function getSavedWorkouts() {
  const saved = localStorage.getItem(WORKOUTS_KEY);

  if (!saved) {
    localStorage.setItem(WORKOUTS_KEY, JSON.stringify(initialWorkouts));
    return initialWorkouts;
  }

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.length ? parsed : initialWorkouts;
  } catch {
    localStorage.setItem(WORKOUTS_KEY, JSON.stringify(initialWorkouts));
    return initialWorkouts;
  }
}

function getActivePasscode() {
  return localStorage.getItem(PASSCODE_KEY) || DEFAULT_PASSCODE;
}

function App() {
  const [passcodeInput, setPasscodeInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [authError, setAuthError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newPasscode, setNewPasscode] = useState('');
  const [entries, setEntries] = useState(() => getSavedWorkouts());
  const [formState, setFormState] = useState({
    name: '',
    category: 'Strength',
    sets: '3',
    reps: '10',
    weight: '0',
    date: getToday(),
    notes: ''
  });

  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [entries]
  );

  const weeklyTotal = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - start.getDay() + 1);

    return entries.filter((entry) => {
      const date = new Date(entry.date + 'T00:00:00');
      return date >= start;
    }).length;
  }, [entries]);

  const handleUnlock = (event) => {
    event.preventDefault();

    if (passcodeInput === getActivePasscode()) {
      setIsUnlocked(true);
      setAuthError('');
      setPasscodeInput('');
      return;
    }

    setAuthError('Incorrect PIN. Try again.');
  };

  const handleSubmitWorkout = (event) => {
    event.preventDefault();

    if (!formState.name.trim()) {
      return;
    }

    const newEntry = {
      id: crypto.randomUUID(),
      name: formState.name.trim(),
      category: formState.category,
      sets: Number(formState.sets) || 0,
      reps: Number(formState.reps) || 0,
      weight: Number(formState.weight) || 0,
      date: formState.date,
      notes: formState.notes.trim()
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem(WORKOUTS_KEY, JSON.stringify(updated));
    setFormState({
      name: '',
      category: 'Strength',
      sets: '3',
      reps: '10',
      weight: '0',
      date: getToday(),
      notes: ''
    });
    setShowForm(false);
  };

  const handleChangePasscode = (event) => {
    event.preventDefault();

    const cleaned = newPasscode.trim();
    if (cleaned.length < 4) {
      return;
    }

    localStorage.setItem(PASSCODE_KEY, cleaned);
    setSettingsOpen(false);
    setNewPasscode('');
    setAuthError('');
  };

  const handleLogout = () => {
    setIsUnlocked(false);
    setPasscodeInput('');
  };

  if (!isUnlocked) {
    return (
      <main className="login-shell">
        <div className="login-card">
          <p className="eyebrow">Private access</p>
          <h1>Workout Tracker</h1>
          <form onSubmit={handleUnlock} className="login-form">
            <label htmlFor="passcode">Enter your PIN</label>
            <input
              id="passcode"
              type="password"
              inputMode="numeric"
              value={passcodeInput}
              onChange={(event) => setPasscodeInput(event.target.value)}
              maxLength={6}
              placeholder="1234"
            />
            <button type="submit" className="primary-button">Unlock</button>
          </form>
          {authError && <p className="error-text">{authError}</p>}
          <p className="login-hint">Default PIN is 1234. Change it in settings after you unlock.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Personal plan</p>
          <h1>Workout Tracker</h1>
        </div>
        <button type="button" className="ghost-button" onClick={handleLogout}>
          Lock
        </button>
      </header>

      <section className="summary-card">
        <div>
          <span>This week</span>
          <strong>{weeklyTotal}</strong>
        </div>
        <div>
          <span>Sessions</span>
          <strong>{entries.length}</strong>
        </div>
      </section>

      <section className="actions-row">
        <button type="button" className="primary-button" onClick={() => setShowForm((current) => !current)}>
          {showForm ? 'Cancel' : '+ Log workout'}
        </button>
        <button type="button" className="secondary-button" onClick={() => setSettingsOpen((current) => !current)}>
          Settings
        </button>
      </section>

      {showForm && (
        <form className="entry-form" onSubmit={handleSubmitWorkout}>
          <h2>New workout</h2>
          <div className="field-row">
            <input
              type="text"
              placeholder="Exercise name"
              value={formState.name}
              onChange={(event) => setFormState({ ...formState, name: event.target.value })}
            />
            <select
              value={formState.category}
              onChange={(event) => setFormState({ ...formState, category: event.target.value })}
            >
              <option value="Strength">Strength</option>
              <option value="Upper Body">Upper Body</option>
              <option value="Legs">Legs</option>
              <option value="Conditioning">Conditioning</option>
              <option value="Mobility">Mobility</option>
            </select>
          </div>

          <div className="field-row">
            <input
              type="number"
              min="1"
              placeholder="Sets"
              value={formState.sets}
              onChange={(event) => setFormState({ ...formState, sets: event.target.value })}
            />
            <input
              type="number"
              min="1"
              placeholder="Reps"
              value={formState.reps}
              onChange={(event) => setFormState({ ...formState, reps: event.target.value })}
            />
            <input
              type="number"
              min="0"
              placeholder="Weight"
              value={formState.weight}
              onChange={(event) => setFormState({ ...formState, weight: event.target.value })}
            />
          </div>

          <div className="field-row single">
            <input
              type="date"
              value={formState.date}
              onChange={(event) => setFormState({ ...formState, date: event.target.value })}
            />
          </div>

          <textarea
            rows="3"
            placeholder="Notes (optional)"
            value={formState.notes}
            onChange={(event) => setFormState({ ...formState, notes: event.target.value })}
          />

          <button type="submit" className="primary-button">Save workout</button>
        </form>
      )}

      {settingsOpen && (
        <form className="settings-panel" onSubmit={handleChangePasscode}>
          <h2>Private settings</h2>
          <label htmlFor="new-passcode">Change PIN</label>
          <input
            id="new-passcode"
            type="password"
            inputMode="numeric"
            value={newPasscode}
            onChange={(event) => setNewPasscode(event.target.value)}
            maxLength={6}
            placeholder="New 4+ digit PIN"
          />
          <button type="submit" className="secondary-button">Save PIN</button>
        </form>
      )}

      <section className="list-card">
        <h2>Recent workouts</h2>
        {sortedEntries.length === 0 ? (
          <p className="empty-text">No workouts logged yet.</p>
        ) : (
          sortedEntries.map((workout) => (
            <article key={workout.id} className="workout-row">
              <div className="day-pill">{new Date(workout.date + 'T00:00:00').toLocaleDateString('en-US', { day: 'numeric' })}</div>
              <div>
                <h3>{workout.name}</h3>
                <p>
                  {workout.category} • {workout.sets} sets • {workout.reps} reps • {workout.weight} lb
                </p>
                {workout.notes ? <small>{workout.notes}</small> : null}
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}

export default App;
