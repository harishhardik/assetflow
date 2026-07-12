import React, { useState, useEffect } from 'react';

function ResourceBooking({ userRole }) {
  const [activeCategory, setActiveCategory] = useState('All'); // All, Venues, Equipment
  const [activeMode, setActiveMode] = useState('Timeline'); // Timeline, Month
  const [bookingDate, setBookingDate] = useState('October 24, 2023');
  const [showNewBookingModal, setShowNewBookingModal] = useState(false);

  // Time indicator simulation
  const [nowPosition, setNowPosition] = useState(0);

  useEffect(() => {
    // Set mock "now" position for 13:00 (13 * 80px width per hour column + 120px header offset)
    const hour = 13;
    const minutes = 15;
    const position = 120 + (hour * 80) + (minutes * (80 / 60));
    setNowPosition(position);
  }, []);

  // Resources state
  const [resources] = useState([
    { id: 1, name: 'Conference Room A', type: 'Venues', location: 'Level 4 • 12 Cap', status: 'Available', color: 'primary', icon: 'meeting_room' },
    { id: 2, name: 'Spectrometer Pro', type: 'Equipment', location: 'Lab Unit 2 • High-End', status: 'Booked', color: 'tertiary', icon: 'biotech' },
    { id: 3, name: 'Workstation 08', type: 'Equipment', location: 'Creative Suite • Win11', status: 'Available', color: 'primary', icon: 'laptop_mac' },
    { id: 4, name: 'Render Farm', type: 'Equipment', location: 'Server Center', status: 'Offline', color: 'error', icon: 'shutter_speed' }
  ]);

  const filteredResources = resources.filter(res => {
    if (activeCategory === 'All') return true;
    return res.type === activeCategory;
  });

  return (
    <div className="flex-1 flex overflow-hidden h-[calc(100vh-64px)] transition-colors duration-300">
      
      {/* Left Column: Resource Selector Sidebar */}
      <div className="w-80 bg-surface-container-low border-r border-outline-variant/60 flex flex-col h-full flex-shrink-0">
        <div className="p-6 border-b border-outline-variant/60">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">Resources</h2>
            <button className="text-primary hover:bg-primary/10 p-1.5 rounded-lg transition-colors">
              <span className="material-symbols-outlined">filter_list</span>
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
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
          {filteredResources.map(res => (
            <div 
              key={res.id} 
              className={`p-4 bg-surface-container border border-outline-variant/60 rounded-xl cursor-pointer hover:border-primary/50 transition-all group ${
                res.status === 'Offline' ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 ${
                  res.color === 'primary' ? 'text-primary' : res.color === 'tertiary' ? 'text-tertiary' : 'text-error'
                }`}>
                  <span className="material-symbols-outlined text-[24px]">{res.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-label-md text-label-md text-on-surface font-bold truncate">{res.name}</h3>
                  <p className="text-xs text-on-surface-variant mb-2 font-medium">{res.location}</p>
                  
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${
                      res.status === 'Available' ? 'bg-primary' : res.status === 'Booked' ? 'bg-tertiary' : 'bg-error'
                    }`}></span>
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${
                      res.status === 'Available' ? 'text-primary' : res.status === 'Booked' ? 'text-tertiary' : 'text-error'
                    }`}>
                      {res.status}
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
        <div className="h-20 border-b border-outline-variant/60 flex items-center justify-between px-gutter flex-shrink-0 bg-surface-container/20">
          <div className="flex items-center gap-4">
            <div className="flex bg-surface-container-highest/60 rounded-lg p-0.5 border border-outline-variant/40">
              <button 
                onClick={() => setActiveMode('Timeline')}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                  activeMode === 'Timeline' 
                    ? 'bg-surface text-on-surface shadow-sm' 
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Timeline
              </button>
              <button 
                onClick={() => setActiveMode('Month')}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                  activeMode === 'Month' 
                    ? 'bg-surface text-on-surface shadow-sm' 
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Month
              </button>
            </div>
            
            <div className="h-6 w-[1px] bg-outline-variant/60"></div>
            
            <div className="flex items-center gap-3">
              <button className="p-1.5 border border-outline-variant/60 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface">{bookingDate}</span>
              <button className="p-1.5 border border-outline-variant/60 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
            <button className="text-primary hover:text-primary-container text-sm font-semibold ml-2">Today</button>
          </div>
          
          <button 
            onClick={() => setShowNewBookingModal(true)}
            className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all shadow-md"
          >
            <span className="material-symbols-outlined text-lg">add_task</span>
            New Booking
          </button>
        </div>

        {/* Timeline Grid (Horizontal & Vertical Scrollable) */}
        <div className="flex-1 overflow-auto custom-scrollbar relative bg-background/20 select-none">
          
          {/* Time Header Grid */}
          <div className="sticky top-0 z-20 flex bg-surface-container border-b border-outline-variant/60 min-w-max">
            {/* Header Intersection */}
            <div className="w-[120px] h-12 flex items-center justify-center border-r border-outline-variant/60 font-label-sm text-label-sm text-on-surface-variant bg-surface-container-high font-bold shrink-0">
              Resources
            </div>
            {/* 24 hour markers */}
            {Array.from({ length: 24 }).map((_, i) => (
              <div 
                key={i}
                className="w-20 h-12 flex items-center justify-center border-r border-outline-variant/30 font-label-sm text-label-sm text-on-surface-variant shrink-0 font-medium"
              >
                {i < 10 ? `0${i}:00` : `${i}:00`}
              </div>
            ))}
          </div>

          {/* Timeline Row Content Grid */}
          <div className="relative min-w-max">
            <div className="divide-y divide-outline-variant/20">
              
              {/* Row 1: Conference Room A */}
              <div className="flex h-24 group min-w-max">
                <div className="w-[120px] flex flex-col justify-center px-4 border-r border-outline-variant/60 bg-surface-container-low group-hover:bg-surface-container transition-colors shrink-0">
                  <span className="font-label-md text-label-md text-on-surface font-bold">Conf A</span>
                  <span className="text-[10px] text-on-surface-variant font-semibold">Room 401</span>
                </div>
                {/* 24 cell containers */}
                <div className="relative flex-1 w-[1920px] bg-surface/10 h-full">
                  {/* Grid cells guides */}
                  <div className="absolute inset-0 flex">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div key={i} className="w-20 h-full border-r border-outline-variant/10 shrink-0"></div>
                    ))}
                  </div>

                  {/* Absolute booking block 1: Marketing Sync (10:00 - 14:00 -> 10 * 80 = 800px left, 4 * 80 = 320px width) */}
                  <div className="absolute left-[800px] top-2 bottom-2 w-[320px] bg-primary/10 border border-primary/40 rounded-xl p-3 cursor-pointer hover:bg-primary/20 transition-all z-10">
                    <div className="flex flex-col h-full justify-between">
                      <div className="flex justify-between items-start">
                        <span className="font-label-sm text-label-sm font-bold text-primary truncate">Marketing Sync</span>
                        <span className="material-symbols-outlined text-[14px] text-primary/60 shrink-0">lock</span>
                      </div>
                      <span className="text-[10px] text-primary font-semibold">10:00 - 14:00 • Sarah J.</span>
                    </div>
                  </div>

                  {/* Absolute booking block 2: Board Prep (18:00 - 20:00 -> 18 * 80 = 1440px left, 2 * 80 = 160px width) */}
                  <div className="absolute left-[1440px] top-2 bottom-2 w-[160px] bg-secondary-container/10 border border-secondary/40 rounded-xl p-3 cursor-pointer hover:bg-secondary-container/20 transition-all z-10">
                    <div className="flex flex-col h-full justify-between">
                      <span className="font-label-sm text-label-sm font-bold text-secondary truncate">Board Prep</span>
                      <span className="text-[10px] text-secondary font-semibold">18:00 - 20:00 • Alex C.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Spectrometer Pro */}
              <div className="flex h-24 group min-w-max">
                <div className="w-[120px] flex flex-col justify-center px-4 border-r border-outline-variant/60 bg-surface-container-low group-hover:bg-surface-container transition-colors shrink-0">
                  <span className="font-label-md text-label-md text-on-surface font-bold">Spectro 02</span>
                  <span className="text-[10px] text-on-surface-variant font-semibold">Lab 12</span>
                </div>
                <div className="relative flex-1 w-[1920px] bg-surface/10 h-full">
                  <div className="absolute inset-0 flex">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div key={i} className="w-20 h-full border-r border-outline-variant/10 shrink-0"></div>
                    ))}
                  </div>

                  {/* Booking block: Conflict Detected (01:30 - 04:30 -> 1.5 * 80 = 120px left, 3 * 80 = 240px width) */}
                  <div className="absolute left-[120px] top-2 bottom-2 w-[240px] bg-error/10 border border-error/40 rounded-xl p-3 z-10">
                    <div className="flex items-center gap-1.5 text-error mb-1">
                      <span className="material-symbols-outlined text-sm font-bold">warning</span>
                      <span className="font-label-sm text-label-sm font-bold">Conflict Detected</span>
                    </div>
                    <span className="text-[10px] text-error font-semibold block leading-tight">Double booking at 01:30</span>
                  </div>

                  {/* Booking block: Deep Sample Scan (08:00 - 14:00 -> 8 * 80 = 640px left, 6 * 80 = 480px width) */}
                  <div className="absolute left-[640px] top-2 bottom-2 w-[480px] bg-tertiary-container/10 border border-tertiary/40 rounded-xl p-3 z-10">
                    <div className="flex flex-col h-full justify-between">
                      <span className="font-label-sm text-label-sm font-bold text-tertiary truncate">Deep Sample Scan</span>
                      <span className="text-[10px] text-tertiary font-semibold">08:00 - 14:00 • Dr. Aris</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 3: Workstation 08 */}
              <div className="flex h-24 group min-w-max">
                <div className="w-[120px] flex flex-col justify-center px-4 border-r border-outline-variant/60 bg-surface-container-low group-hover:bg-surface-container transition-colors shrink-0">
                  <span className="font-label-md text-label-md text-on-surface font-bold">WS-08</span>
                  <span className="text-[10px] text-on-surface-variant font-semibold">Creatives</span>
                </div>
                <div className="relative flex-1 w-[1920px] bg-surface/10 h-full">
                  <div className="absolute inset-0 flex">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div key={i} className="w-20 h-full border-r border-outline-variant/10 shrink-0"></div>
                    ))}
                  </div>

                  {/* Active selection range (20:00 - 22:00 -> 20 * 80 = 1600px left, 2 * 80 = 160px width) */}
                  <div className="absolute left-[1600px] top-0 bottom-0 w-[160px] bg-primary/5 border-x border-primary/20 flex items-center justify-center z-10">
                    <span className="text-[9px] text-primary font-bold uppercase tracking-widest rotate-90 whitespace-nowrap">Selected</span>
                  </div>
                </div>
              </div>

              {/* Row 4: Render Farm (Offline) */}
              <div className="flex h-24 group min-w-max opacity-50 bg-slate-900/10">
                <div className="w-[120px] flex flex-col justify-center px-4 border-r border-outline-variant/60 bg-surface-container-low shrink-0">
                  <span className="font-label-md text-label-md text-on-surface font-bold">RenderFarm</span>
                  <span className="text-[10px] text-on-surface-variant font-semibold">Cluster A</span>
                </div>
                <div className="relative flex-1 w-[1920px] h-full">
                  <div className="absolute inset-0 flex">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div key={i} className="w-20 h-full border-r border-outline-variant/10 shrink-0"></div>
                    ))}
                  </div>
                  {/* Maintenance slot */}
                  <div className="absolute left-[400px] top-2 bottom-2 w-[160px] bg-surface-bright border border-outline/30 rounded-xl p-3 flex items-center justify-center">
                    <span className="font-label-sm text-label-sm font-bold text-on-surface-variant/70">Maintenance</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Current Time Indicator Red Line */}
            {nowPosition > 0 && (
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
      </div>

      {/* Right Column: Stats/Upcoming Sidebar */}
      <div className="w-72 bg-surface-container-low border-l border-outline-variant/60 p-6 space-y-6 flex flex-col h-full flex-shrink-0 overflow-y-auto custom-scrollbar">
        <section>
          <h2 className="font-label-md text-label-md font-bold mb-4 uppercase tracking-widest text-on-surface-variant">Your Reservations</h2>
          <div className="space-y-3">
            <div className="p-3 bg-surface-container rounded-lg border-l-4 border-primary border border-outline-variant/10 shadow-sm">
              <p className="text-xs font-bold text-on-surface">Client Presentation</p>
              <p className="text-[10px] text-on-surface-variant font-medium mt-1">Room B • 15:30 - 17:00</p>
            </div>
            <div className="p-3 bg-surface-container rounded-lg border-l-4 border-secondary-container border border-outline-variant/10 shadow-sm">
              <p className="text-xs font-bold text-on-surface">AR Headset Rental</p>
              <p className="text-[10px] text-on-surface-variant font-medium mt-1">Storage A • Tomorrow</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-label-md text-label-md font-bold mb-4 uppercase tracking-widest text-on-surface-variant">Resource Health</h2>
          <div className="p-4 bg-surface-container rounded-xl border border-outline-variant/40 text-center shadow-sm">
            <div className="text-3xl font-black text-primary mb-1">94%</div>
            <p className="text-xs text-on-surface-variant font-semibold">Asset Utilization Rate</p>
            <div className="mt-4 h-1.5 w-full bg-surface-container-lowest rounded-full overflow-hidden border border-outline-variant/10">
              <div className="h-full bg-primary" style={{ width: '94%' }}></div>
            </div>
          </div>
        </section>

        <section className="mt-auto">
          <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
            <div className="flex items-center gap-2 text-primary mb-2 font-bold text-xs">
              <span className="material-symbols-outlined text-lg">info</span>
              <span>Booking Rule</span>
            </div>
            <p className="text-[11px] leading-relaxed text-on-surface-variant font-medium">
              Reservations over 4 hours require department head approval. Please plan accordingly.
            </p>
          </div>
        </section>
      </div>

      {/* New Booking Modal */}
      {showNewBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowNewBookingModal(false)}></div>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              setShowNewBookingModal(false);
            }}
            className="bg-surface-container-high w-full max-w-md rounded-2xl border border-outline-variant/60 p-6 z-10 shadow-2xl relative animate-fade-in"
          >
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">Request Resource Booking</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1 block">Resource</label>
                <select className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none">
                  <option>Conference Room A (Level 4)</option>
                  <option>Spectrometer Pro (Lab 2)</option>
                  <option>Workstation 08 (Creatives)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1 block">Date</label>
                <input type="date" className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none text-on-surface" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1 block">Start Time</label>
                  <input type="time" className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none text-on-surface" />
                </div>
                <div>
                  <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1 block">End Time</label>
                  <input type="time" className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none text-on-surface" />
                </div>
              </div>
              <div>
                <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1 block">Purpose</label>
                <input type="text" placeholder="e.g. Design review meeting" className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none" required />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="flex-1 py-3 bg-primary text-on-primary font-bold rounded-xl hover:brightness-110 transition-all shadow-md active:scale-95">
                Book
              </button>
              <button type="button" onClick={() => setShowNewBookingModal(false)} className="flex-1 py-3 border border-outline-variant rounded-xl font-bold hover:bg-surface-bright transition-all active:scale-95">
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
