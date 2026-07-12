import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

function ActivityLogs() {
  const { activityLogs, notifications, clearNotifications } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('logs'); // logs, alerts
  const [logSearch, setLogSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState('All Users');

  // Filter logs
  const filteredLogs = activityLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(logSearch.toLowerCase()) || 
                          log.user.toLowerCase().includes(logSearch.toLowerCase());
    const matchesUser = selectedUser === 'All Users' || log.user === selectedUser;
    return matchesSearch && matchesUser;
  });

  // Unique users who triggered logs
  const uniqueUsers = ['All Users', ...new Set(activityLogs.map(l => l.user))];

  return (
    <div className="p-margin-page max-w-container-max mx-auto space-y-element-gap md:space-y-gutter pb-24 transition-colors duration-300 font-semibold">
      
      {/* Page Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-1">Logs & Notifications</h2>
          <p className="text-on-surface-variant font-body-sm">Audit trail timeline logs and enterprise compliance alerts.</p>
        </div>
        {activeTab === 'alerts' && notifications.some(n => n.unread) && (
          <button 
            onClick={clearNotifications}
            className="bg-primary/10 border border-primary/20 text-primary font-label-md text-label-md px-4 py-2 rounded-xl hover:bg-primary/20 transition-all font-bold"
          >
            Mark All Read
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-outline-variant/60 mb-6">
        <button 
          onClick={() => setActiveTab('logs')}
          className={`pb-4 px-2 font-label-md text-label-md font-semibold border-b-2 transition-all ${
            activeTab === 'logs' ? 'text-primary border-primary' : 'text-on-surface-variant hover:text-on-surface border-transparent'
          }`}
        >
          Activity Logs ({activityLogs.length})
        </button>
        <button 
          onClick={() => setActiveTab('alerts')}
          className={`pb-4 px-2 font-label-md text-label-md font-semibold border-b-2 transition-all ${
            activeTab === 'alerts' ? 'text-primary border-primary' : 'text-on-surface-variant hover:text-on-surface border-transparent'
          }`}
        >
          System Alerts ({notifications.filter(n => n.unread).length} Unread)
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'logs' && (
        <div className="space-y-4 animate-fade-in">
          {/* Controls */}
          <div className="flex flex-wrap gap-4 items-center justify-between bg-surface-container/30 p-4 rounded-xl border border-outline-variant/40">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
              <input 
                type="text" 
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                placeholder="Search action logs..." 
                className="bg-surface-container border border-outline-variant/60 text-xs rounded-lg pl-9 pr-4 py-2 focus:ring-primary focus:border-primary outline-none transition-all w-48 sm:w-64 text-on-surface font-semibold"
              />
            </div>

            <div className="flex gap-2 items-center text-xs">
              <span className="text-on-surface-variant">Filter Operator:</span>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="bg-surface-container border border-outline-variant/60 rounded-lg px-2.5 py-1.5 outline-none text-on-surface"
              >
                {uniqueUsers.map((u, i) => (
                  <option key={i} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Timeline list */}
          <div className="glass-card rounded-xl border border-outline-variant/60 p-6 space-y-6 pl-10 relative before:content-[''] before:absolute before:left-[30px] before:top-8 before:bottom-8 before:w-[1px] before:bg-outline-variant/40">
            {filteredLogs.map((log, idx) => (
              <div key={log.id} className="relative group">
                {/* Timeline node dot */}
                <div className={`absolute left-[-26px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-surface bg-surface-container-highest group-hover:bg-primary transition-colors ${
                  idx === 0 ? 'bg-primary ring-4 ring-primary/10' : ''
                }`}></div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 bg-surface-container/20 p-3 rounded-xl border border-transparent hover:border-outline-variant/30 transition-all hover:bg-surface-container/40">
                  <div>
                    <p className="text-sm text-on-surface font-bold">{log.action}</p>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">Operator: <strong>{log.user}</strong></p>
                  </div>
                  <span className="text-[10px] text-primary/75 md:text-right shrink-0">{log.timestamp}</span>
                </div>
              </div>
            ))}
            {filteredLogs.length === 0 && (
              <p className="text-xs text-on-surface-variant italic py-8 text-center before:hidden">No action logs found matching search filters.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="space-y-4 animate-fade-in">
          {/* Alerts Grid */}
          <div className="grid grid-cols-1 gap-4">
            {notifications.map(notif => (
              <div 
                key={notif.id}
                className={`glass-card p-5 rounded-xl border flex items-start justify-between gap-4 transition-all relative overflow-hidden ${
                  notif.unread 
                    ? 'bg-surface border-outline-variant' 
                    : 'bg-surface-container-low/40 border-transparent opacity-70'
                }`}
              >
                {/* Left accent indicator */}
                {notif.unread && (
                  <div className={`absolute top-0 bottom-0 left-0 w-1 ${
                    notif.type === 'danger' ? 'bg-error' : notif.type === 'warning' ? 'bg-tertiary' : 'bg-primary'
                  }`}></div>
                )}

                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border shrink-0 ${
                    notif.type === 'danger' ? 'bg-error/15 text-error border-error/10' : 
                    notif.type === 'warning' ? 'bg-tertiary-container/15 text-tertiary border-tertiary/10' : 
                    'bg-primary-container/15 text-primary border-primary/10'
                  }`}>
                    <span className="material-symbols-outlined">
                      {notif.type === 'danger' ? 'gpp_maybe' : notif.type === 'warning' ? 'warning' : 'info'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface leading-tight text-sm">{notif.text}</h4>
                    <p className="text-[10px] text-on-surface-variant mt-2">Alert Level: <strong className="uppercase">{notif.type || 'info'}</strong> • Logged {notif.time}</p>
                  </div>
                </div>

                {notif.unread && (
                  <span className="w-2.5 h-2.5 bg-primary rounded-full shrink-0 mt-2" title="Unread Alert"></span>
                )}
              </div>
            ))}

            {notifications.length === 0 && (
              <div className="glass-card p-12 text-center border border-outline-variant/60 rounded-xl">
                <span className="material-symbols-outlined text-5xl text-outline-variant mb-2">notifications_off</span>
                <p className="text-xs text-on-surface-variant italic font-semibold">No system alerts raised.</p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default ActivityLogs;
