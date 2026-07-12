import React, { useState } from 'react';

function Notifications() {
  const [activeTab, setActiveTab] = useState('All'); // All, Alerts, Approvals, Bookings
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Laptop AF-0014 assigned to Priya shah', category: 'Alerts', time: '2m ago', icon: 'laptop_mac', unread: true },
    { id: 2, text: 'Maintenance request AF-0055 approved', category: 'Approvals', time: '18m ago', icon: 'check_circle', unread: true },
    { id: 3, text: 'Booking confirmed : Room B2 : 2:00 to 3:00 PM', category: 'Bookings', time: '1h ago', icon: 'meeting_room', unread: false },
    { id: 4, text: 'Transfer approved : AF-0033 to facilities dept', category: 'Approvals', time: '3h ago', icon: 'move_up', unread: false },
    { id: 5, text: 'Overdue return : AF-0021 was due 3 days ago', category: 'Alerts', time: '1d ago', icon: 'report', unread: false },
    { id: 6, text: 'audit discrepancy flagged : AF-0088 damaged', category: 'Alerts', time: '2d ago', icon: 'warning', unread: false }
  ]);

  const filteredNotifications = notifications.filter(notif => {
    if (activeTab === 'All') return true;
    return notif.category === activeTab;
  });

  const toggleReadStatus = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: !n.unread } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const getCategoryBadgeColor = (cat) => {
    switch (cat) {
      case 'Alerts':
        return 'bg-error/15 text-error border-error/10';
      case 'Approvals':
        return 'bg-primary/15 text-primary border-primary/10';
      case 'Bookings':
        return 'bg-secondary/15 text-secondary border-secondary/10';
      default:
        return 'bg-surface-container text-on-surface-variant';
    }
  };

  return (
    <div className="p-margin-page max-w-container-max mx-auto space-y-element-gap md:space-y-gutter pb-24 transition-colors duration-300">
      
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Notifications</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">Track audit actions, resource transfers, and maintenance alerts.</p>
        </div>
        
        {notifications.some(n => n.unread) && (
          <button 
            onClick={markAllAsRead}
            className="text-primary hover:text-primary-container text-xs font-bold flex items-center gap-1.5 py-2 px-3 border border-primary/20 rounded-xl hover:bg-primary/5 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">done_all</span>
            Mark all as read
          </button>
        )}
      </div>

      {/* Tabs Filter Row */}
      <div className="flex gap-2.5 p-1 bg-surface-container rounded-xl border border-outline-variant/40 w-fit">
        {['All', 'Alerts', 'Approvals', 'Bookings'].map(tab => {
          const count = tab === 'All' ? notifications.length : notifications.filter(n => n.category === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === tab
                  ? 'bg-surface text-on-surface shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tab}
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                activeTab === tab ? 'bg-primary/10 text-primary' : 'bg-surface-container-highest text-on-surface-variant'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Notifications Table List Layout */}
      <div className="bg-surface-container border border-outline-variant/60 rounded-xl overflow-hidden shadow-sm animate-fade-in">
        <div className="divide-y divide-outline-variant/40">
          
          {filteredNotifications.length === 0 ? (
            <div className="p-16 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl opacity-50 mb-2">notifications_off</span>
              <p className="text-sm font-semibold">No notifications in this category</p>
            </div>
          ) : (
            filteredNotifications.map(notif => (
              <div 
                key={notif.id}
                onClick={() => toggleReadStatus(notif.id)}
                className={`px-6 py-4 flex items-center justify-between hover:bg-surface-bright/40 cursor-pointer transition-colors group relative ${
                  notif.unread ? 'bg-primary/5' : ''
                }`}
              >
                {/* Unread Indicator Bar */}
                {notif.unread && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                )}

                <div className="flex items-center gap-4 min-w-0">
                  {/* Status checkbox shape */}
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                    notif.unread 
                      ? 'border-primary bg-primary text-on-primary' 
                      : 'border-outline-variant/80 bg-surface'
                  }`}>
                    {notif.unread && (
                      <span className="material-symbols-outlined text-[10px] font-black">done</span>
                    )}
                  </div>

                  {/* Notification text and icon */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${
                      getCategoryBadgeColor(notif.category)
                    }`}>
                      <span className="material-symbols-outlined text-[18px]">{notif.icon}</span>
                    </div>
                    <div>
                      <p className={`text-sm leading-normal truncate font-medium ${
                        notif.unread ? 'text-on-surface font-semibold' : 'text-on-surface-variant'
                      }`}>
                        {notif.text}
                      </p>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant/80 mt-1 block">
                        {notif.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 ml-4">
                  <span className="text-xs text-on-surface-variant font-semibold">{notif.time}</span>
                </div>
              </div>
            ))
          )}

        </div>
      </div>

    </div>
  );
}

export default Notifications;
