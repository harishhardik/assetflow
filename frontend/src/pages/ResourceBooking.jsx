import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';

function ResourceBooking() {
  const { 
    currentUser, 
    bookings, 
    bookResource, 
    cancelBooking, 
    assets 
  } = useContext(AppContext);

  const [activeCategory, setActiveCategory] = useState('All'); // All, Venues, Equipment
  const [activeMode, setActiveMode] = useState('Timeline'); // Timeline, Bookings List
  const [bookingDate, setBookingDate] = useState('2026-07-12');
  const [showNewBookingModal, setShowNewBookingModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [newResourceId, setNewResourceId] = useState('Conference Room A');
  const [newDate, setNewDate] = useState('2026-07-12');
  const [newStart, setNewStart] = useState('09:00');
  const [newEnd, setNewEnd] = useState('10:00');
  const [newPurpose, setNewPurpose] = useState('');

  // Time indicator simulation
  const [nowPosition, setNowPosition] = useState(0);

  useEffect(() => {
    // Current simulated timeline position (13:15 -> 13.25 hours)
    const hour = 13;
    const minutes = 15;
    const position = 120 + (hour * 80) + (minutes * (80 / 60));
    setNowPosition(position);
  }, []);

  const resources = [
    { id: 'Conference Room A', name: 'Conference Room A', type: 'Venues', location: 'Level 4 • 12 Cap', icon: 'meeting_room', color: 'primary' },
    { id: 'Spectrometer Pro', name: 'Spectrometer Pro', type: 'Equipment', location: 'Lab Unit 2 • High-End', icon: 'biotech', color: 'tertiary' },
    { id: 'Workstation 08', name: 'Workstation 08', type: 'Equipment', location: 'Creative Suite • Win11', icon: 'laptop_mac', color: 'primary' },
    { id: 'Render Farm', name: 'Render Farm', type: 'Equipment', location: 'Server Center', icon: 'shutter_speed', color: 'error' }
  ];

  // Dynamic shared assets added to equipment list
  const sharedAssets = assets.filter(a => a.shared);
  sharedAssets.forEach(a => {
    if (!resources.some(r => r.id === a.tag)) {
      resources.push({
        id: a.tag,
        name: a.name,
        type: 'Equipment',
        location: a.location,
        icon: 'devices',
        color: 'secondary'
      });
    }
  });

  const filteredResources = resources.filter(res => {
    if (activeCategory === 'All') return true;
    return res.type === activeCategory;
  });

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const res = resources.find(r => r.id === newResourceId);
    const type = res ? res.type : 'Equipment';

    const result = bookResource(newResourceId, type, newDate, newStart, newEnd);
    if (result.success) {
      setShowNewBookingModal(false);
      setNewPurpose('');
    } else {
      setErrorMsg(result.message);
    }
  };

  const getBookingBlockStyle = (startTime, endTime) => {
    const startHour = parseFloat(startTime.split(':')[0]) + parseFloat(startTime.split(':')[1]) / 60;
    const endHour = parseFloat(endTime.split(':')[0]) + parseFloat(endTime.split(':')[1]) / 60;
    
    const left = startHour * 80;
    const width = (endHour - startHour) * 80;
    return { left: `${left}px`, width: `${width}px` };
  };

  const shiftDate = (days) => {
    const current = new Date(bookingDate);
    current.setDate(current.getDate() + days);
    setBookingDate(current.toISOString().split('T')[0]);
  };

  // Get user's active upcoming reservations
  const userReservations = bookings.filter(b => b.user === currentUser?.name && b.status !== 'Cancelled');

  return (
    <div className="flex-1 flex overflow-hidden h-[calc(100vh-64px)] transition-colors duration-300">
      
      {/* Left Column: Resource Selector Sidebar */}
      <div className="w-80 bg-surface-container-low border-r border-outline-variant/60 flex flex-col h-full flex-shrink-0">
        <div className="p-6 border-b border-outline-variant/60">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">Bookings</h2>
            <button className="text-primary hover:bg-primary/10 p-1.5 rounded-lg transition-colors">
              <span className="material-symbols-outlined font-bold">filter_list</span>
            </button>
          </div>
          
          <div className="flex gap-2 p-0.5 bg-surface-container rounded-lg border border-outline-variant/40">
            {['All', 'Venues', 'Equipment'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-surface text-on-surface shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Resource List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 font-semibold">
          {filteredResources.map(res => (
            <div 
              key={res.id} 
              className="p-4 bg-surface-container border border-outline-variant/60 rounded-xl cursor-pointer hover:border-primary/50 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 ${
                  res.color === 'primary' ? 'text-primary' : res.color === 'tertiary' ? 'text-tertiary' : 'text-secondary'
                }`}>
                  <span className="material-symbols-outlined text-[24px]">{res.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-label-md text-label-md text-on-surface font-bold truncate">{res.name}</h3>
                  <p className="text-xs text-on-surface-variant mb-2 font-medium">{res.location}</p>
                  
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-primary">
                      Bookable
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center Area: Timeline/Calendar View */}
      <div className="flex-1 flex flex-col bg-surface overflow-hidden h-full">
        {/* Timeline Toolbar */}
        <div className="h-20 border-b border-outline-variant/60 flex items-center justify-between px-gutter flex-shrink-0 bg-surface-container/20 font-semibold">
          <div className="flex items-center gap-4">
            <div className="flex bg-surface-container-highest/60 rounded-lg p-0.5 border border-outline-variant/40">
              <button 
                onClick={() => setActiveMode('Timeline')}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                  activeMode === 'Timeline' 
                    ? 'bg-surface text-on-surface shadow-sm' 
                    : 'text-on-surface-variant'
                }`}
              >
                Calendar Timeline
              </button>
              <button 
                onClick={() => setActiveMode('List')}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                  activeMode === 'List' 
                    ? 'bg-surface text-on-surface shadow-sm' 
                    : 'text-on-surface-variant'
                }`}
              >
                All Bookings
              </button>
            </div>
            
            <div className="h-6 w-[1px] bg-outline-variant/60"></div>
            
            <div className="flex items-center gap-3">
              <button onClick={() => shiftDate(-1)} className="p-1.5 border border-outline-variant/60 rounded-lg hover:bg-surface-container text-on-surface-variant">
                <span className="material-symbols-outlined text-sm font-bold">chevron_left</span>
              </button>
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface">{bookingDate}</span>
              <button onClick={() => shiftDate(1)} className="p-1.5 border border-outline-variant/60 rounded-lg hover:bg-surface-container text-on-surface-variant">
                <span className="material-symbols-outlined text-sm font-bold">chevron_right</span>
              </button>
            </div>
            <button onClick={() => setBookingDate('2026-07-12')} className="text-primary hover:underline text-sm font-bold ml-2">Today</button>
          </div>
          
          <button 
            onClick={() => {
              setNewDate(bookingDate);
              setShowNewBookingModal(true);
            }}
            className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all shadow-md"
          >
            <span className="material-symbols-outlined text-lg font-bold">add_task</span>
            Book Resource
          </button>
        </div>

        {/* Timeline Grid */}
        {activeMode === 'Timeline' ? (
          <div className="flex-1 overflow-auto custom-scrollbar relative bg-background/20 select-none">
            
            {/* Time Header Grid */}
            <div className="sticky top-0 z-20 flex bg-surface-container border-b border-outline-variant/60 min-w-max">
              <div className="w-[120px] h-12 flex items-center justify-center border-r border-outline-variant/60 font-label-sm text-label-sm text-on-surface-variant bg-surface-container-high font-bold shrink-0">
                Resource Name
              </div>
              {Array.from({ length: 24 }).map((_, i) => (
                <div 
                  key={i}
                  className="w-20 h-12 flex items-center justify-center border-r border-outline-variant/30 font-label-sm text-label-sm text-on-surface-variant shrink-0 font-bold"
                >
                  {i < 10 ? `0${i}:00` : `${i}:00`}
                </div>
              ))}
            </div>

            {/* Timeline Row Content Grid */}
            <div className="relative min-w-max">
              <div className="divide-y divide-outline-variant/20">
                {filteredResources.map(res => {
                  const dayBookings = bookings.filter(b => b.resourceId === res.id && b.date === bookingDate && b.status !== 'Cancelled');
                  return (
                    <div key={res.id} className="flex h-24 group min-w-max">
                      <div className="w-[120px] flex flex-col justify-center px-4 border-r border-outline-variant/60 bg-surface-container-low group-hover:bg-surface-container transition-colors shrink-0">
                        <span className="font-label-md text-label-md text-on-surface font-bold truncate leading-tight">{res.name}</span>
                        <span className="text-[9px] text-on-surface-variant font-bold uppercase tracking-wider truncate mt-0.5">{res.type}</span>
                      </div>
                      <div className="relative flex-1 w-[1920px] bg-surface/10 h-full">
                        {/* Grid cells guides */}
                        <div className="absolute inset-0 flex">
                          {Array.from({ length: 24 }).map((_, i) => (
                            <div key={i} className="w-20 h-full border-r border-outline-variant/10 shrink-0"></div>
                          ))}
                        </div>

                        {/* Render Booked Blocks */}
                        {dayBookings.map(b => (
                          <div 
                            key={b.id} 
                            style={getBookingBlockStyle(b.startTime, b.endTime)}
                            className="absolute top-2 bottom-2 bg-primary/10 border border-primary/45 rounded-xl p-3 cursor-pointer hover:bg-primary/20 transition-all z-10 font-semibold"
                            title={`${b.startTime} - ${b.endTime} • Booked by ${b.user}`}
                          >
                            <div className="flex flex-col h-full justify-between">
                              <span className="font-label-sm text-label-sm font-bold text-primary truncate leading-tight">Booked Slot</span>
                              <span className="text-[9px] text-primary font-bold">{b.startTime} - {b.endTime} • {b.user}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Current Time Indicator Red Line */}
              {bookingDate === '2026-07-12' && nowPosition > 0 && (
                <div 
                  className="absolute top-0 bottom-0 w-[2px] bg-error z-30 pointer-events-none"
                  style={{ left: `${nowPosition}px` }}
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-error text-[10px] font-bold text-white px-2 py-0.5 rounded shadow-md z-40">
                    NOW
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Bookings List panel
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-background/10 font-semibold">
            <div className="bg-surface-container rounded-xl border border-outline-variant/60 overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-high border-b border-outline-variant/60">
                    <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase">Resource</th>
                    <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase">Type</th>
                    <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase">User</th>
                    <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase">Time Slot</th>
                    <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/40">
                  {bookings.map(b => (
                    <tr key={b.id} className={`hover:bg-surface-bright/40 transition-colors ${b.status === 'Cancelled' ? 'opacity-50' : ''}`}>
                      <td className="px-6 py-4 font-bold text-on-surface text-sm">{b.resourceId}</td>
                      <td className="px-6 py-4 text-xs text-on-surface-variant">{b.type}</td>
                      <td className="px-6 py-4 text-xs text-on-surface font-semibold">{b.user}</td>
                      <td className="px-6 py-4 text-xs text-on-surface-variant">{b.date}</td>
                      <td className="px-6 py-4 text-xs text-primary font-bold">{b.startTime} - {b.endTime}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${
                          b.status === 'Upcoming' ? 'bg-primary/10 border-primary/20 text-primary' :
                          b.status === 'Ongoing' ? 'bg-secondary-container text-on-secondary-container' :
                          b.status === 'Cancelled' ? 'bg-error/10 border-error/20 text-error' :
                          'bg-surface-container-highest text-on-surface-variant'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {b.status !== 'Cancelled' && (
                          <button 
                            onClick={() => cancelBooking(b.id)}
                            className="text-xs text-error font-bold px-2 py-1 bg-error-container/10 border border-error/15 rounded hover:bg-error-container/20 active:scale-95"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-on-surface-variant italic">No bookings recorded.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Stats/Upcoming Sidebar */}
      <div className="w-72 bg-surface-container-low border-l border-outline-variant/60 p-6 space-y-6 flex flex-col h-full flex-shrink-0 overflow-y-auto custom-scrollbar font-semibold">
        <section>
          <h2 className="font-label-md text-label-md font-bold mb-4 uppercase tracking-widest text-on-surface-variant">Your Reservations</h2>
          <div className="space-y-3">
            {userReservations.map(res => (
              <div key={res.id} className="p-3 bg-surface-container rounded-lg border-l-4 border-primary border border-outline-variant/10 shadow-sm flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-on-surface truncate max-w-[140px]">{res.resourceId}</p>
                  <p className="text-[10px] text-on-surface-variant mt-1">{res.date} • {res.startTime} - {res.endTime}</p>
                </div>
                <button 
                  onClick={() => cancelBooking(res.id)}
                  className="text-error hover:text-error/80 p-0.5 rounded"
                  title="Cancel Booking"
                >
                  <span className="material-symbols-outlined text-[16px] font-bold">cancel</span>
                </button>
              </div>
            ))}
            {userReservations.length === 0 && (
              <p className="text-xs text-on-surface-variant italic font-semibold">No reservations booked by you.</p>
            )}
          </div>
        </section>

        <section>
          <h2 className="font-label-md text-label-md font-bold mb-4 uppercase tracking-widest text-on-surface-variant">Utilization Summary</h2>
          <div className="p-4 bg-surface-container rounded-xl border border-outline-variant/40 text-center shadow-sm">
            <div className="text-3xl font-black text-primary mb-1">
              {Math.round((bookings.filter(b=>b.status !== 'Cancelled').length / 10) * 100) || 45}%
            </div>
            <p className="text-xs text-on-surface-variant font-semibold">Asset Active Reservation Rate</p>
            <div className="mt-4 h-1.5 w-full bg-surface-container-lowest rounded-full overflow-hidden border border-outline-variant/10">
              <div className="h-full bg-primary" style={{ width: '45%' }}></div>
            </div>
          </div>
        </section>

        <section className="mt-auto">
          <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
            <div className="flex items-center gap-2 text-primary mb-2 font-bold text-xs">
              <span className="material-symbols-outlined text-lg">info</span>
              <span>Calendar Conflict Rule</span>
            </div>
            <p className="text-[11px] leading-relaxed text-on-surface-variant font-semibold">
              The booking coordinator enforces overlapping check blocks. Simultaneous reservations on the same date will be blocked dynamically.
            </p>
          </div>
        </section>
      </div>

      {/* New Booking Modal */}
      {showNewBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowNewBookingModal(false)}></div>
          <form 
            onSubmit={handleBookingSubmit}
            className="bg-surface-container-high w-full max-w-md rounded-2xl border border-outline-variant/60 p-6 z-10 shadow-2xl relative animate-fade-in"
          >
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">Request Resource Booking</h3>
            
            {errorMsg && (
              <div className="mb-4 p-3 bg-error/10 border border-error/20 text-error rounded-xl flex gap-2 items-center text-xs font-bold">
                <span className="material-symbols-outlined text-sm font-bold">warning</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-4 mb-6 font-semibold">
              <div>
                <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1 block">Resource / Room</label>
                <select 
                  value={newResourceId}
                  onChange={(e) => setNewResourceId(e.target.value)}
                  required
                  className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none text-on-surface"
                >
                  {resources.map(r => (
                    <option key={r.id} value={r.id}>{r.name} ({r.location})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1 block">Booking Date</label>
                <input 
                  type="date" 
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  required
                  className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none text-on-surface" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1 block">Start Time</label>
                  <input 
                    type="time" 
                    value={newStart}
                    onChange={(e) => setNewStart(e.target.value)}
                    required
                    className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none text-on-surface" 
                  />
                </div>
                <div>
                  <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1 block">End Time</label>
                  <input 
                    type="time" 
                    value={newEnd}
                    onChange={(e) => setNewEnd(e.target.value)}
                    required
                    className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none text-on-surface" 
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1 block">Booking Purpose</label>
                <input 
                  type="text" 
                  value={newPurpose}
                  onChange={(e) => setNewPurpose(e.target.value)}
                  placeholder="e.g. Sprint planning meeting" 
                  className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none" 
                  required 
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="flex-1 py-3 bg-primary text-on-primary font-bold rounded-xl hover:brightness-110 transition-all shadow-md active:scale-95">
                Confirm Booking
              </button>
              <button type="button" onClick={() => setShowNewBookingModal(false)} className="flex-1 py-3 border border-outline-variant rounded-xl font-bold hover:bg-surface-bright transition-all text-on-surface-variant hover:text-on-surface">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}

export default ResourceBooking;
