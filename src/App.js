import { useState } from 'react';
import { Calendar, Plus, Pill, Check, Clock, User, LogOut, MapPin, Search } from 'lucide-react';
import './App.css';

const MedTrack = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedInUser, setLoggedInUser] = useState('');

  const [medications, setMedications] = useState([
    { id: 1, name: 'Lisinopril',  dosage: '10mg',  time: '08:00', frequency: 'Daily', taken: false, days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
    { id: 2, name: 'Metformin',   dosage: '500mg', time: '12:00', frequency: 'Daily', taken: false, days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
    { id: 3, name: 'Atorvastatin',dosage: '20mg',  time: '20:00', frequency: 'Daily', taken: false, days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
  ]);

  const [newMed, setNewMed] = useState({
    name: '', dosage: '', time: '', frequency: 'Daily',
    days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  });

  const pharmacies = [
    { id: 1, name: 'CVS Pharmacy',     address: '1234 Main Street, San Diego, CA 92101', phone: '(619) 555-0101', hours: 'Mon-Fri: 8AM-10PM, Sat-Sun: 9AM-6PM' },
    { id: 2, name: 'Walgreens',        address: '5678 Harbor Drive, San Diego, CA 92102', phone: '(619) 555-0202', hours: '24 Hours' },
    { id: 3, name: 'Rite Aid',         address: '9012 Pacific Highway, San Diego, CA 92103', phone: '(619) 555-0303', hours: 'Mon-Sat: 9AM-9PM, Sun: 10AM-6PM' },
    { id: 4, name: 'Target Pharmacy',  address: '3456 Mission Boulevard, San Diego, CA 92109', phone: '(858) 555-0404', hours: 'Mon-Fri: 9AM-8PM, Sat-Sun: 9AM-6PM' },
    { id: 5, name: 'Costco Pharmacy',  address: '7890 Balboa Avenue, San Diego, CA 92111', phone: '(858) 555-0505', hours: 'Mon-Fri: 10AM-7PM, Sat: 9:30AM-6PM, Sun: Closed' },
  ];

  const handleLogin = () => {
    if (username && password) {
      setLoggedInUser(username);
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setLoggedInUser('');
    setCurrentView('dashboard');
  };

  const toggleMedication = (id) => {
    setMedications(meds =>
      meds.map(med => (med.id === id ? { ...med, taken: !med.taken } : med))
    );
  };

  const addMedication = () => {
    if (newMed.name && newMed.dosage && newMed.time) {
      setMedications(meds => [...meds, { id: Date.now(), ...newMed, taken: false }]);
      setNewMed({ name: '', dosage: '', time: '', frequency: 'Daily', days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] });
      setCurrentView('dashboard');
    }
  };

  const toggleDay = (day) => {
    setNewMed(state => ({
      ...state,
      days: state.days.includes(day)
        ? state.days.filter(d => d !== day)
        : [...state.days, day],
    }));
  };

  const getTodaysMedications = () => {
    const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const todayName = dayNames[new Date().getDay()];
    return medications
      .filter(med => med.days.includes(todayName))
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  if (!isLoggedIn) {
    return (
      <div className="page page--gradient center">
        <div className="card card--elevated card--narrow">
          <div className="brand">
            <div className="brand__circle"><Pill className="icon-lg icon--on-dark" /></div>
            <h1 className="title">MedTrack</h1>
            <p className="muted">Your Personal Medication Manager</p>
          </div>

          <div className="stack-lg">
            <div className="stack-sm">
              <label className="label">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                placeholder="Enter your username"
              />
            </div>

            <div className="stack-sm">
              <label className="label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Enter your password"
              />
            </div>

            <button onClick={handleLogin} className="btn btn--primary btn--block">Login</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page page--light">
      <header className="app-header">
        <div className="container row between center-y">
          <div className="row center-y gap-sm">
            <div className="brand__chip"><Pill className="icon-sm icon--on-dark" /></div>
            <h1 className="app-name">MedTrack</h1>
          </div>

          <div className="row center-y gap-md">
            <div className="row center-y gap-xs text-dim">
              <User className="icon-sm" />
              <span className="text-strong">{loggedInUser}</span>
            </div>
            <button onClick={handleLogout} className="btn btn--ghost row center-y gap-xs">
              <LogOut className="icon-xs" /> <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container section">
        {currentView === 'dashboard' && (
          <div className="grid grid--sidebar">
            <section className="card card--elevated">
              <div className="row between center-y mb-md">
                <h2 className="section-title row center-y gap-xs">
                  <Clock className="icon-sm accent" /> Today&apos;s Medications
                </h2>
                <span className="text-dim text-sm">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </span>
              </div>

              <div className="stack-md">
                {getTodaysMedications().length === 0 ? (
                  <div className="empty-state">
                    <Pill className="icon-xl text-faint" />
                    <p className="text-dim">No medications scheduled for today</p>
                  </div>
                ) : (
                  getTodaysMedications().map((med) => (
                    <div
                      key={med.id}
                      className={`med-row ${med.taken ? 'med-row--taken' : ''}`}
                    >
                      <div className="med-row__main">
                        <div className="row center-y gap-sm">
                          <h3 className={`med-name ${med.taken ? 'text-success' : ''}`}>{med.name}</h3>
                          {med.taken && <span className="badge badge--success">Taken</span>}
                        </div>
                        <div className="stack-xs text-dim">
                          <p className="text-sm"><span className="text-strong">Dosage:</span> {med.dosage}</p>
                          <p className="text-sm"><span className="text-strong">Time:</span> {med.time}</p>
                          <p className="text-sm"><span className="text-strong">Frequency:</span> {med.frequency}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleMedication(med.id)}
                        className={`btn-circle ${med.taken ? 'btn-circle--success' : 'btn-circle--primary'}`}
                        aria-label="Toggle taken"
                      >
                        <Check className="icon-sm icon--on-dark" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </section>

            <aside className="stack-md">
              <button onClick={() => setCurrentView('addMed')} className="promo promo--indigo">
                <Plus className="icon-lg" />
                <h3 className="promo__title">Add New Medication</h3>
                <p className="promo__desc">Create a new medication schedule</p>
              </button>

              <button onClick={() => setCurrentView('weekly')} className="promo promo--purple">
                <Calendar className="icon-lg" />
                <h3 className="promo__title">Weekly Schedule</h3>
                <p className="promo__desc">View your medication calendar</p>
              </button>

              <button onClick={() => setCurrentView('pharmacies')} className="promo promo--teal">
                <MapPin className="icon-lg" />
                <h3 className="promo__title">Find Pharmacies</h3>
                <p className="promo__desc">Locate nearby pharmacies</p>
              </button>
            </aside>
          </div>
        )}

        {currentView === 'addMed' && (
          <section className="card card--elevated narrow">
            <div className="row between center-y mb-md">
              <h2 className="section-title row center-y gap-xs">
                <Plus className="icon-sm accent" /> Add New Medication
              </h2>
              <button onClick={() => setCurrentView('dashboard')} className="link">← Back</button>
            </div>

            <div className="stack-lg">
              <div className="stack-sm">
                <label className="label">Medication Name</label>
                <input
                  type="text"
                  value={newMed.name}
                  onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                  className="input"
                  placeholder="e.g., Aspirin"
                />
              </div>

              <div className="stack-sm">
                <label className="label">Dosage</label>
                <input
                  type="text"
                  value={newMed.dosage}
                  onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                  className="input"
                  placeholder="e.g., 100mg"
                />
              </div>

              <div className="stack-sm">
                <label className="label">Time</label>
                <input
                  type="time"
                  value={newMed.time}
                  onChange={(e) => setNewMed({ ...newMed, time: e.target.value })}
                  className="input"
                />
              </div>

              <div className="stack-sm">
                <label className="label">Frequency</label>
                <select
                  value={newMed.frequency}
                  onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                  className="input"
                >
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>As Needed</option>
                </select>
              </div>

              <div className="stack-sm">
                <label className="label">Days of the Week</label>
                <div className="chip-row">
                  {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`chip ${newMed.days.includes(day) ? 'chip--active' : ''}`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={addMedication} className="btn btn--primary btn--block">Add Medication</button>
            </div>
          </section>
        )}

        {currentView === 'weekly' && (
          <section className="card card--elevated">
            <div className="row between center-y mb-md">
              <h2 className="section-title row center-y gap-xs">
                <Calendar className="icon-sm accent" /> Weekly Medication Schedule
              </h2>
              <button onClick={() => setCurrentView('dashboard')} className="link">← Back</button>
            </div>

            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Medication</th>
                    {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day) => (
                      <th key={day} className="text-center">{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {medications.map((med) => (
                    <tr key={med.id}>
                      <td>
                        <div className="stack-xxs">
                          <p className="text-strong">{med.name}</p>
                          <p className="text-dim text-sm">{med.dosage} at {med.time}</p>
                        </div>
                      </td>
                      {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day) => (
                        <td key={day} className="text-center">
                          {med.days.includes(day)
                            ? <div className="dot dot--indigo"><Check className="icon-xs accent" /></div>
                            : <span className="text-faint">—</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {currentView === 'pharmacies' && (
          <section className="card card--elevated">
            <div className="row between center-y mb-md">
              <h2 className="section-title row center-y gap-xs">
                <MapPin className="icon-sm accent" /> Nearby Pharmacies
              </h2>
              <button onClick={() => setCurrentView('dashboard')} className="link">← Back</button>
            </div>

            <div className="mb-md">
              <div className="input-wrap">
                <Search className="icon-xs text-dim input-wrap__icon" />
                <input
                  type="text"
                  placeholder="Search pharmacies by name or location..."
                  className="input input--with-icon"
                />
              </div>
            </div>

            <div className="stack-md">
              {pharmacies.map((pharmacy) => (
                <div key={pharmacy.id} className="pharmacy-row">
                  <div className="pharmacy-row__info">
                    <h3 className="text-strong mb-xxs">{pharmacy.name}</h3>
                    <div className="stack-xxs text-dim">
                      <p className="row start gap-xs"><MapPin className="icon-xxs accent" /> {pharmacy.address}</p>
                      <p><span className="text-strong">Phone:</span> {pharmacy.phone}</p>
                      <p className="row start gap-xs"><Clock className="icon-xxs accent" /> {pharmacy.hours}</p>
                    </div>
                  </div>
                  <button className="btn btn--primary">Get Directions</button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default MedTrack;
