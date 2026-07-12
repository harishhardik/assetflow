import React, { useState } from 'react';

function Dashboard({ userRole, setCurrentView }) {
  const [chartRange, setChartRange] = useState('7d'); // '7d' or '30d'

  // Get display details based on role
  const getGreetingDetails = () => {
    switch (userRole) {
      case 'Admin':
        return { name: 'Alex Chen', greeting: 'Welcome back, Administrator' };
      case 'Asset Manager':
        return { name: 'Jane Doe', greeting: 'Good morning, Jane' };
      case 'Department Head':
        return { name: 'Marcus Thorne', greeting: 'Hello, Marcus' };
      case 'Employee':
      default:
        return { name: 'Sarah Jenkins', greeting: 'Hi, Sarah' };
    }
  };

  const details = getGreetingDetails();

  // Mock utilization trend data
  const chartData = chartRange === '7d' 
    ? [
        { label: 'Mon', value: 40, active: false },
        { label: 'Tue', value: 65, active: false },
        { label: 'Wed', value: 55, active: false },
        { label: 'Thu', value: 85, active: false },
        { label: 'Fri', value: 95, active: true },
        { label: 'Sat', value: 20, active: false },
        { label: 'Sun', value: 15, active: false }
      ]
    : [
        { label: 'W1', value: 42, active: false },
        { label: 'W2', value: 58, active: false },
        { label: 'W3', value: 74, active: false },
        { label: 'W4', value: 91, active: true }
      ];

  // Helper values to show/hide sections based on roles
  const isAdmin = userRole === 'Admin';
  const isManager = userRole === 'Asset Manager';
  const isDeptHead = userRole === 'Department Head';
  const isEmployee = userRole === 'Employee';

  return (
    <div className="p-margin-page max-w-container-max mx-auto space-y-element-gap md:space-y-gutter pb-24 transition-colors duration-300">
      
      {/* Hero Welcome & Greeting Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
            {details.greeting}
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">
            Here is what's happening across your fleet today.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {(isAdmin || isManager) && (
            <button 
              onClick={() => setCurrentView('assets')}
              className="flex items-center gap-2 bg-primary text-on-primary font-label-md text-label-md px-5 py-3 rounded-xl hover:brightness-110 transition-all shadow-lg shadow-primary/10 active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              Register Asset
            </button>
          )}
          <button 
            onClick={() => setCurrentView('booking')}
            className="flex items-center gap-2 border border-outline-variant hover:border-primary text-on-surface font-label-md text-label-md px-5 py-3 rounded-xl hover:bg-surface-container transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">event_available</span>
            Book Resource
          </button>
          <button 
            onClick={() => setCurrentView('maintenance')}
            className="flex items-center gap-2 border border-outline-variant hover:border-primary text-on-surface font-label-md text-label-md px-5 py-3 rounded-xl hover:bg-surface-container transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">build</span>
            Raise Maintenance
          </button>
        </div>
      </section>

      {/* KPI Bento Grid metrics */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">Today's Overview</h3>
          <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-widest font-medium">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            Live Updates
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-gutter">
          {/* Card 1 */}
          <div className="glass-card p-padding-card rounded-xl flex flex-col justify-between h-40 group hover:border-primary/40 cursor-pointer">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-primary">inventory_2</span>
              <span className="text-primary font-label-sm text-label-sm font-bold">+2.4%</span>
            </div>
            <div>
              <p className="font-display-lg text-[32px] font-bold leading-none text-on-surface">1,284</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-2">Assets Available</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-card p-padding-card rounded-xl flex flex-col justify-between h-40 group hover:border-primary/40 cursor-pointer">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-secondary">person_pin</span>
              <span className="text-on-surface-variant font-label-sm text-label-sm">Steady</span>
            </div>
            <div>
              <p className="font-display-lg text-[32px] font-bold leading-none text-on-surface">842</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-2">Allocated</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-card p-padding-card rounded-xl flex flex-col justify-between h-40 group hover:border-primary/40 cursor-pointer border-primary/20">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-tertiary-container">build</span>
              <span className="text-tertiary font-label-sm text-label-sm font-bold">Critical</span>
            </div>
            <div>
              <p className="font-display-lg text-[32px] font-bold leading-none text-on-surface">12</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-2">Maintenance Today</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="glass-card p-padding-card rounded-xl flex flex-col justify-between h-40 group hover:border-primary/40 cursor-pointer">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-secondary-fixed-dim">move_up</span>
              <span className="text-secondary font-label-sm text-label-sm">7 Pending</span>
            </div>
            <div>
              <p className="font-display-lg text-[32px] font-bold leading-none text-on-surface">24</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-2">Transfers</p>
            </div>
          </div>

          {/* Card 5 */}
          <div className="glass-card p-padding-card rounded-xl flex flex-col justify-between h-40 group hover:border-primary/40 cursor-pointer">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-error">assignment_return</span>
              <span className="text-error font-label-sm text-label-sm font-bold">3 Overdue</span>
            </div>
            <div>
              <p className="font-display-lg text-[32px] font-bold leading-none text-on-surface">18</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-2">Returns Due</p>
            </div>
          </div>

          {/* Card 6 */}
          <div className="glass-card p-padding-card rounded-xl flex flex-col justify-between h-40 group hover:border-primary/40 cursor-pointer">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-primary">calendar_month</span>
              <span className="text-on-surface-variant font-label-sm text-label-sm">Capacity</span>
            </div>
            <div>
              <p className="font-display-lg text-[32px] font-bold leading-none text-on-surface">45</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-2">Bookings Today</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left Column: Overdue alerts and Chart */}
        <div className="lg:col-span-8 space-y-gutter">
          {/* Overdue Alerts Card */}
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between bg-error/5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>report</span>
                <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface">Overdue Alerts</h4>
              </div>
              <button 
                onClick={() => setCurrentView('allocation')}
                className="text-primary hover:text-primary-container font-label-md text-label-md hover:underline font-semibold"
              >
                View All
              </button>
            </div>
            
            <div className="divide-y divide-outline-variant/40">
              <div className="px-6 py-4 flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined">laptop_mac</span>
                  </div>
                  <div>
                    <p className="font-label-md text-label-md font-semibold text-on-surface">MacBook Pro 16" - M2 Max</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">ID: ASSET-7729 • John Doe</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="bg-error/10 border border-error/20 text-error font-label-sm text-label-sm px-3 py-1 rounded-full font-semibold">4 Days Overdue</span>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Due: Oct 12, 2023</p>
                </div>
              </div>

              <div className="px-6 py-4 flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined">precision_manufacturing</span>
                  </div>
                  <div>
                    <p className="font-label-md text-label-md font-semibold text-on-surface">Industrial CNC Router</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">ID: ASSET-9910 • Workshop A</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="bg-tertiary-container/20 border border-tertiary/20 text-tertiary font-label-sm text-label-sm px-3 py-1 rounded-full font-semibold">Maintenance Overdue</span>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Due: Oct 14, 2023</p>
                </div>
              </div>
            </div>
          </div>

          {/* Utilization Trends Chart Card */}
          <div className="glass-card p-padding-card rounded-xl">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-headline-sm text-headline-sm font-semibold text-on-surface">Utilization Trends</h4>
              <div className="flex bg-surface-container rounded-lg p-0.5 border border-outline-variant/40">
                <button 
                  onClick={() => setChartRange('7d')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    chartRange === '7d' 
                      ? 'bg-surface text-on-surface shadow-sm' 
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  7 Days
                </button>
                <button 
                  onClick={() => setChartRange('30d')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    chartRange === '30d' 
                      ? 'bg-surface text-on-surface shadow-sm' 
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  30 Days
                </button>
              </div>
            </div>

            {/* SVG Interactive Chart Representation */}
            <div className="h-64 flex items-end justify-between gap-3 px-4 pt-6 border-b border-outline-variant/40 relative">
              {chartData.map((data, index) => {
                const barHeight = `${data.value}%`;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center h-full justify-end relative group">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-3 bg-surface-container-highest text-on-surface text-[11px] px-2.5 py-1 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none border border-outline-variant font-semibold">
                      {data.value}%
                    </div>
                    {/* Bar graphic */}
                    <div 
                      style={{ height: barHeight }}
                      className={`w-full max-w-[48px] rounded-t-lg transition-all duration-300 relative ${
                        data.active 
                          ? 'bg-gradient-to-t from-primary/60 to-primary border-t-2 border-primary' 
                          : 'bg-primary/20 hover:bg-primary/30'
                      }`}
                    ></div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-3 text-on-surface-variant font-semibold text-xs px-4">
              {chartData.map((data, index) => (
                <span 
                  key={index} 
                  className={`w-12 text-center ${data.active ? 'text-primary font-bold' : ''}`}
                >
                  {data.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Timeline & Health */}
        <div className="lg:col-span-4 space-y-gutter">
          {/* Recent Activity Card */}
          <div className="glass-card p-padding-card rounded-xl">
            <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-6">Recent Activity</h4>
            <div className="space-y-6 relative before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-outline-variant/60">
              
              {/* Timeline Item 1 */}
              <div className="relative pl-8 animate-fade-in">
                <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-primary ring-4 ring-surface"></div>
                <p className="font-label-md text-label-md font-bold text-on-surface">Asset Assigned</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Dell XPS 15 (ID: 4402) assigned to Sarah Parker</p>
                <p className="font-label-sm text-label-sm text-primary font-semibold mt-1">12 mins ago</p>
              </div>

              {/* Timeline Item 2 */}
              <div className="relative pl-8 animate-fade-in">
                <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-secondary ring-4 ring-surface"></div>
                <p className="font-label-md text-label-md font-bold text-on-surface">Maintenance Completed</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">HVAC Unit #04 check completed by Tech-One</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-1 font-semibold">45 mins ago</p>
              </div>

              {/* Timeline Item 3 */}
              <div className="relative pl-8 animate-fade-in">
                <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-error ring-4 ring-surface"></div>
                <p className="font-label-md text-label-md font-bold text-on-surface">New Incident Raised</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Projector flickering in Conference Room C</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-1 font-semibold">2 hours ago</p>
              </div>

              {/* Timeline Item 4 */}
              <div className="relative pl-8 animate-fade-in">
                <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-outline ring-4 ring-surface"></div>
                <p className="font-label-md text-label-md font-bold text-on-surface">Audit Started</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Q4 IT Hardware Audit initiated by HQ</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-1 font-semibold">Yesterday</p>
              </div>
            </div>
            <button className="w-full mt-6 py-2.5 text-on-surface-variant hover:text-on-surface font-label-md text-label-md border border-outline-variant/60 rounded-xl hover:bg-surface-container transition-all font-semibold active:scale-[0.98]">
              View History
            </button>
          </div>

          {/* Asset Health Progress Bars Card */}
          <div className="glass-card p-padding-card rounded-xl">
            <h4 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest font-bold mb-6">Asset Health</h4>
            <div className="space-y-4">
              
              {/* Row 1 */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span className="font-body-sm text-body-sm font-medium text-on-surface">Operational</span>
                  </div>
                  <span className="font-label-md text-label-md font-bold text-on-surface">94.2%</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden border border-outline-variant/10">
                  <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: '94.2%' }}></div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                    <span className="font-body-sm text-body-sm font-medium text-on-surface">In Repair</span>
                  </div>
                  <span className="font-label-md text-label-md font-bold text-on-surface">4.1%</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden border border-outline-variant/10">
                  <div className="bg-tertiary h-full rounded-full transition-all duration-500" style={{ width: '4.1%' }}></div>
                </div>
              </div>

              {/* Row 3 */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-error"></span>
                    <span className="font-body-sm text-body-sm font-medium text-on-surface">Decommissioned</span>
                  </div>
                  <span className="font-label-md text-label-md font-bold text-on-surface">1.7%</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden border border-outline-variant/10">
                  <div className="bg-error h-full rounded-full transition-all duration-500" style={{ width: '1.7%' }}></div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Contextual FAB */}
      {(isAdmin || isManager) && (
        <button 
          onClick={() => setCurrentView('assets')}
          className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-xl shadow-primary/20 hover:scale-110 active:scale-95 transition-all z-40 group"
        >
          <span className="material-symbols-outlined text-[28px] group-hover:rotate-90 transition-transform duration-300">add</span>
          <span className="absolute right-16 bg-surface-container-highest text-on-surface px-3 py-1 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-outline-variant font-semibold">
            Quick Register
          </span>
        </button>
      )}
    </div>
  );
}

export default Dashboard;
