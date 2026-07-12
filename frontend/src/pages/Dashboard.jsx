import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import Chatbot from "../components/Chatbot";

function Dashboard({ setCurrentView }) {
  const { 
    currentUser, 
    userRole, 
    assets, 
    bookings, 
    tickets, 
    transfers, 
    activityLogs 
  } = useContext(AppContext);

  const [chartRange, setChartRange] = useState('7d');

  const getGreetingDetails = () => {
    if (currentUser) {
      return { name: currentUser.name, greeting: `Welcome back, ${currentUser.name}` };
    }
    return { name: 'Sarah Jenkins', greeting: 'Hi, Sarah' };
  };

  const details = getGreetingDetails();

  // Helper values to show/hide sections based on roles
  const isAdmin = userRole === 'Admin';
  const isManager = userRole === 'Asset Manager';
  const isDeptHead = userRole === 'Department Head';
  const isEmployee = userRole === 'Employee';

  // --- Dynamic KPI Calculations ---
  const assetsAvailableCount = assets.filter(a => a.status === 'Available').length;
  const assetsAllocatedCount = assets.filter(a => a.status === 'Allocated').length;
  const maintenanceCount = tickets.filter(t => t.status !== 'Resolved' && t.status !== 'Rejected').length;
  const activeBookingsCount = bookings.filter(b => b.status === 'Upcoming' || b.status === 'Ongoing').length;
  const pendingTransfersCount = transfers.filter(t => t.status === 'Pending').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const overdueAllocations = assets.filter(a => a.status === 'Allocated' && a.expectedReturnDate && a.expectedReturnDate < todayStr);
  const upcomingReturns = assets.filter(a => a.status === 'Allocated' && a.expectedReturnDate && a.expectedReturnDate >= todayStr);

  const totalReturnTracked = overdueAllocations.length + upcomingReturns.length;

  // Chart visualization metrics (Dynamic scaling based on active assets)
  const totalAssetsCount = assets.length || 1;
  const activePercent = Math.round((assetsAllocatedCount / totalAssetsCount) * 100);
  const maintPercent = Math.round((assets.filter(a => a.status === 'Under Maintenance').length / totalAssetsCount) * 100);
  const lostPercent = Math.round((assets.filter(a => a.status === 'Lost').length / totalAssetsCount) * 100);
  const retiredPercent = Math.round((assets.filter(a => a.status === 'Retired' || a.status === 'Disposed').length / totalAssetsCount) * 100);
  const availablePercent = 100 - activePercent - maintPercent - lostPercent - retiredPercent;

  // Utilization trend charts (Simulated metrics matching range selection)
  const chartData = chartRange === '7d' 
    ? [
        { label: 'Mon', value: 40, active: false },
        { label: 'Tue', value: 65, active: false },
        { label: 'Wed', value: 55, active: false },
        { label: 'Thu', value: 85, active: false },
        { label: 'Fri', value: Math.max(activePercent, 45), active: true },
        { label: 'Sat', value: 20, active: false },
        { label: 'Sun', value: 15, active: false }
      ]
    : [
        { label: 'W1', value: 42, active: false },
        { label: 'W2', value: 58, active: false },
        { label: 'W3', value: 64, active: false },
        { label: 'W4', value: Math.max(activePercent, 72), active: true }
      ];

  const getDaysBetween = (d1, d2) => {
    const diffTime = Math.abs(new Date(d1) - new Date(d2));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

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
          <div onClick={() => setCurrentView('assets')} className="glass-card p-padding-card rounded-xl flex flex-col justify-between h-40 group hover:border-primary/40 cursor-pointer">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-primary">inventory_2</span>
              <span className="text-primary font-label-sm text-label-sm font-bold">Total: {assets.length}</span>
            </div>
            <div>
              <p className="font-display-lg text-[32px] font-bold leading-none text-on-surface">{assetsAvailableCount}</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-2">Assets Available</p>
            </div>
          </div>

          {/* Card 2 */}
          <div onClick={() => setCurrentView('allocation')} className="glass-card p-padding-card rounded-xl flex flex-col justify-between h-40 group hover:border-primary/40 cursor-pointer">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-secondary">person_pin</span>
              <span className="text-on-surface-variant font-label-sm text-label-sm">Active</span>
            </div>
            <div>
              <p className="font-display-lg text-[32px] font-bold leading-none text-on-surface">{assetsAllocatedCount}</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-2">Assets Allocated</p>
            </div>
          </div>

          {/* Card 3 */}
          <div onClick={() => setCurrentView('maintenance')} className="glass-card p-padding-card rounded-xl flex flex-col justify-between h-40 group hover:border-primary/40 cursor-pointer">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-tertiary-container text-tertiary">build</span>
              <span className="text-tertiary font-label-sm text-label-sm font-bold">{maintenanceCount > 0 ? 'Urgent' : 'Clear'}</span>
            </div>
            <div>
              <p className="font-display-lg text-[32px] font-bold leading-none text-on-surface">{maintenanceCount}</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-2">Maintenance Open</p>
            </div>
          </div>

          {/* Card 4 */}
          <div onClick={() => setCurrentView('booking')} className="glass-card p-padding-card rounded-xl flex flex-col justify-between h-40 group hover:border-primary/40 cursor-pointer">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-secondary-fixed-dim">calendar_today</span>
              <span className="text-secondary font-label-sm text-label-sm">Active</span>
            </div>
            <div>
              <p className="font-display-lg text-[32px] font-bold leading-none text-on-surface">{activeBookingsCount}</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-2">Active Bookings</p>
            </div>
          </div>

          {/* Card 5 */}
          <div onClick={() => setCurrentView('allocation')} className="glass-card p-padding-card rounded-xl flex flex-col justify-between h-40 group hover:border-primary/40 cursor-pointer border-error/20">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-error">assignment_return</span>
              {overdueAllocations.length > 0 && (
                <span className="text-error font-label-sm text-label-sm font-bold">{overdueAllocations.length} Overdue</span>
              )}
            </div>
            <div>
              <p className="font-display-lg text-[32px] font-bold leading-none text-on-surface">{overdueAllocations.length}</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-2">Overdue Returns</p>
            </div>
          </div>

          {/* Card 6 */}
          <div onClick={() => setCurrentView('allocation')} className="glass-card p-padding-card rounded-xl flex flex-col justify-between h-40 group hover:border-primary/40 cursor-pointer">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-secondary-fixed">move_up</span>
              <span className="text-on-surface-variant font-label-sm text-label-sm">Transfers</span>
            </div>
            <div>
              <p className="font-display-lg text-[32px] font-bold leading-none text-on-surface">{pendingTransfersCount}</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-2">Pending Transfers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left Column: Overdue alerts and Chart */}
        <div className="lg:col-span-8 space-y-gutter">
          
          {/* Overdue Returns Alerts Panel */}
          <div className="glass-card rounded-xl overflow-hidden border border-outline-variant/60">
            <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between bg-error/5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>report</span>
                <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface">Return Tracking & Alerts</h4>
              </div>
              <button 
                onClick={() => setCurrentView('allocation')}
                className="text-primary hover:text-primary-container font-label-md text-label-md hover:underline font-semibold"
              >
                Manage Allocations
              </button>
            </div>
            
            <div className="divide-y divide-outline-variant/40 max-h-72 overflow-y-auto custom-scrollbar">
              {overdueAllocations.map(a => (
                <div key={a.id} className="px-6 py-4 flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer border-l-4 border-l-error">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-error-container/10 border border-error/20 flex items-center justify-center text-error">
                      <span className="material-symbols-outlined">laptop_mac</span>
                    </div>
                    <div>
                      <p className="font-label-md text-label-md font-semibold text-on-surface">{a.name} ({a.tag})</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Holder: {a.assignedTo} • Serial: {a.serialNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="bg-error/10 border border-error/20 text-error font-label-sm text-label-sm px-3 py-1 rounded-full font-semibold">
                      {getDaysBetween(new Date(), a.expectedReturnDate)} Days Overdue
                    </span>
                    <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Expected: {a.expectedReturnDate}</p>
                  </div>
                </div>
              ))}

              {upcomingReturns.map(a => (
                <div key={a.id} className="px-6 py-4 flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer border-l-4 border-l-primary/30">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-container/10 border border-primary/20 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">laptop_mac</span>
                    </div>
                    <div>
                      <p className="font-label-md text-label-md font-semibold text-on-surface">{a.name} ({a.tag})</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Holder: {a.assignedTo} • Location: {a.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="bg-primary/10 border border-primary/20 text-primary font-label-sm text-label-sm px-3 py-1 rounded-full font-semibold">
                      Upcoming Return
                    </span>
                    <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Due: {a.expectedReturnDate}</p>
                  </div>
                </div>
              ))}

              {totalReturnTracked === 0 && (
                <div className="p-8 text-center text-on-surface-variant font-medium">
                  <span className="material-symbols-outlined text-4xl mb-2 text-outline-variant">check_circle</span>
                  <p>All allocations are running on schedule. No returns due currently.</p>
                </div>
              )}
            </div>
          </div>

          {/* Utilization Trends Chart Card */}
          <div className="glass-card p-padding-card rounded-xl border border-outline-variant/60">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-headline-sm text-headline-sm font-semibold text-on-surface">Allocation Utilizations</h4>
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
                    <div className="absolute -top-3 bg-surface-container-highest text-on-surface text-[11px] px-2.5 py-1 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none border border-outline-variant font-semibold">
                      {data.value}%
                    </div>
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
          <div className="glass-card p-padding-card rounded-xl border border-outline-variant/60">
            <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-6">Recent Activity</h4>
            <div className="space-y-6 relative before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-outline-variant/60">
              {activityLogs.slice(0, 4).map((log, idx) => (
                <div key={log.id} className="relative pl-8 animate-fade-in">
                  <div className={`absolute left-1.5 top-1.5 w-3 h-3 rounded-full ring-4 ring-surface ${
                    idx === 0 ? 'bg-primary' : idx === 1 ? 'bg-secondary' : idx === 2 ? 'bg-tertiary' : 'bg-outline'
                  }`}></div>
                  <p className="font-label-md text-label-md font-bold text-on-surface">{log.action}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">By {log.user}</p>
                  <p className="font-label-sm text-label-sm text-primary font-semibold mt-1">{log.timestamp}</p>
                </div>
              ))}
              {activityLogs.length === 0 && (
                <p className="text-xs text-on-surface-variant italic py-4">No recent activity logs.</p>
              )}
            </div>
            <button 
              onClick={() => setCurrentView('logs')}
              className="w-full mt-6 py-2.5 text-on-surface-variant hover:text-on-surface font-label-md text-label-md border border-outline-variant/60 rounded-xl hover:bg-surface-container transition-all font-semibold active:scale-[0.98]"
            >
              View Full History
            </button>
          </div>

          {/* Asset Health Progress Bars Card */}
          <div className="glass-card p-padding-card rounded-xl border border-outline-variant/60">
            <h4 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest font-bold mb-6">Asset Condition Health</h4>
            <div className="space-y-4">
              
              {/* Row 1 */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span className="font-body-sm text-body-sm font-medium text-on-surface">Operational (Available/Allocated)</span>
                  </div>
                  <span className="font-label-md text-label-md font-bold text-on-surface">{availablePercent + activePercent}%</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden border border-outline-variant/10">
                  <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${availablePercent + activePercent}%` }}></div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                    <span className="font-body-sm text-body-sm font-medium text-on-surface">Under Maintenance</span>
                  </div>
                  <span className="font-label-md text-label-md font-bold text-on-surface">{maintPercent}%</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden border border-outline-variant/10">
                  <div className="bg-tertiary h-full rounded-full transition-all duration-500" style={{ width: `${maintPercent}%` }}></div>
                </div>
              </div>

              {/* Row 3 */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-error"></span>
                    <span className="font-body-sm text-body-sm font-medium text-on-surface">Lost / Retired</span>
                  </div>
                  <span className="font-label-md text-label-md font-bold text-on-surface">{lostPercent + retiredPercent}%</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden border border-outline-variant/10">
                  <div className="bg-error h-full rounded-full transition-all duration-500" style={{ width: `${lostPercent + retiredPercent}%` }}></div>
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
          <span className="material-symbols-outlined text-[28px] group-hover:rotate-90 transition-transform duration-300">
            add
          </span>
          <span className="absolute right-16 bg-surface-container-highest text-on-surface px-3 py-1 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-outline-variant font-semibold">
            Quick Register
          </span>
        </button>
      )}

      {/* AI Chatbot */}
      <Chatbot />

    </div>
  );
}
export default Dashboard;