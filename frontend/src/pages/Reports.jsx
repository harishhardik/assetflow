import React from 'react';

function Reports() {
  return (
    <div className="p-margin-page max-w-container-max mx-auto space-y-element-gap md:space-y-gutter pb-24 transition-colors duration-300">
      
      {/* Page Header */}
      <div>
        <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Reports & Analytics</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
          Real-time metrics on equipment utilization, maintenance frequencies, and lifecycle alerts.
        </p>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
        
        {/* Card 1: Utilization by Department */}
        <div className="glass-card p-padding-card rounded-xl">
          <h4 className="font-label-md text-label-md font-bold text-on-surface mb-6 uppercase tracking-wider text-primary">
            Utilization by Department
          </h4>
          <div className="h-48 flex items-end justify-between gap-3 px-4 pt-6 border-b border-outline-variant/30 relative">
            {/* Simple Visual Bars */}
            {[
              { name: 'Eng', val: 50 },
              { name: 'Design', val: 80 },
              { name: 'HR', val: 35 },
              { name: 'Ops', val: 95 },
              { name: 'Sales', val: 60 }
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center h-full justify-end relative group">
                <div className="absolute -top-3 bg-surface-container-highest text-on-surface text-[10px] px-2 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                  {bar.val}%
                </div>
                <div 
                  style={{ height: `${bar.val}%` }}
                  className="w-full max-w-[36px] bg-primary/20 hover:bg-primary/40 border-t-2 border-primary rounded-t transition-all duration-350"
                ></div>
                <span className="text-[10px] text-on-surface-variant font-semibold mt-2">{bar.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Maintenance Frequency */}
        <div className="glass-card p-padding-card rounded-xl">
          <h4 className="font-label-md text-label-md font-bold text-on-surface mb-6 uppercase tracking-wider text-secondary">
            Maintenance Frequency
          </h4>
          <div className="h-48 flex items-end justify-between border-b border-outline-variant/30 relative px-2 pt-6">
            {/* Interactive SVG Sparkline Chart */}
            <svg className="w-full h-full stroke-secondary fill-none" viewBox="0 0 100 50" preserveAspectRatio="none">
              <path 
                d="M 0 45 L 20 20 L 40 30 L 60 10 L 80 25 L 100 5" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="drop-shadow-[0_2px_8px_rgba(59,130,246,0.3)]"
              />
            </svg>
            <div className="absolute bottom-2 left-0 right-0 flex justify-between text-[10px] text-on-surface-variant font-semibold px-2 pointer-events-none">
              <span>Q1</span>
              <span>Q2</span>
              <span>Q3</span>
              <span>Q4</span>
            </div>
          </div>
        </div>

      </div>

      {/* Stats and Alerts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        
        {/* Left Side: Most Used / Idle */}
        <div className="space-y-gutter">
          {/* Most Used Assets */}
          <div className="glass-card p-padding-card rounded-xl">
            <h4 className="font-label-md text-label-md font-bold text-on-surface mb-4 uppercase tracking-widest text-on-surface-variant">
              Most Used Assets
            </h4>
            <ul className="space-y-3">
              <li className="flex justify-between items-center text-sm font-medium border-b border-outline-variant/20 pb-2">
                <span className="text-on-surface">Room B2</span>
                <span className="text-on-surface-variant text-xs">34 bookings this month</span>
              </li>
              <li className="flex justify-between items-center text-sm font-medium border-b border-outline-variant/20 pb-2">
                <span className="text-on-surface">Van AF-343</span>
                <span className="text-on-surface-variant text-xs">21 trips this month</span>
              </li>
              <li className="flex justify-between items-center text-sm font-medium pb-1">
                <span className="text-on-surface">Projector AF-335</span>
                <span className="text-on-surface-variant text-xs">18 uses</span>
              </li>
            </ul>
          </div>

          {/* Idle Assets */}
          <div className="glass-card p-padding-card rounded-xl">
            <h4 className="font-label-md text-label-md font-bold text-on-surface mb-4 uppercase tracking-widest text-on-surface-variant">
              Idle Assets
            </h4>
            <ul className="space-y-3">
              <li className="flex justify-between items-center text-sm font-medium border-b border-outline-variant/20 pb-2">
                <span className="text-on-surface font-code text-xs text-primary">Camera AF-0301</span>
                <span className="text-on-surface-variant text-xs">Unused 60+ days</span>
              </li>
              <li className="flex justify-between items-center text-sm font-medium pb-1">
                <span className="text-on-surface font-code text-xs text-primary">Chair AF-0410</span>
                <span className="text-on-surface-variant text-xs">Unused 45 days</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side: Maintenance Alerts */}
        <div className="glass-card p-padding-card rounded-xl flex flex-col justify-between">
          <div>
            <h4 className="font-label-md text-label-md font-bold text-on-surface mb-4 uppercase tracking-widest text-on-surface-variant">
              Assets Due for Maintenance / Nearing Retirement
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-3 items-start border-b border-outline-variant/20 pb-3">
                <span className="material-symbols-outlined text-tertiary mt-0.5">build</span>
                <div>
                  <p className="text-sm font-bold text-on-surface">Forklift AF-0087</p>
                  <p className="text-xs text-on-surface-variant font-medium mt-0.5">Service is due in 5 days</p>
                </div>
              </li>
              <li className="flex gap-3 items-start pb-1">
                <span className="material-symbols-outlined text-outline mt-0.5">history</span>
                <div>
                  <p className="text-sm font-bold text-on-surface">Laptop AF-0020</p>
                  <p className="text-xs text-on-surface-variant font-medium mt-0.5">4 years old : nearing retirement age</p>
                </div>
              </li>
            </ul>
          </div>

          <button className="w-full mt-8 py-3 bg-primary text-on-primary font-bold rounded-xl hover:brightness-110 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">file_download</span>
            Export Report
          </button>
        </div>

      </div>

    </div>
  );
}

export default Reports;
