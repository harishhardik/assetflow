import React, { useState } from 'react';

function Header({ theme, setTheme, userRole, currentView }) {
  const [showNotifications, setShowNotifications] = useState(false);

  // Formatter for view titles
  const getViewTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Enterprise Dashboard';
      case 'organization':
        return 'Organization Setup';
      case 'assets':
        return 'Asset Inventory';
      case 'allocation':
        return 'Allocation & Transfer';
      case 'booking':
        return 'Resource Booking';
      case 'maintenance':
        return 'Maintenance Board';
      default:
        return 'AssetFlow';
    }
  };

  // Static mock notifications
  const notifications = [
    { id: 1, text: 'HVAC coolant leak in Server Room 102', time: '12 mins ago', unread: true, type: 'danger' },
    { id: 2, text: 'MacBook Pro M2 return is due today', time: '1 hour ago', unread: true, type: 'warning' },
    { id: 3, text: 'New transfer request approved', time: '4 hours ago', unread: false, type: 'info' }
  ];

  return (
    <header className="flex justify-between items-center h-16 px-gutter w-full sticky top-0 z-30 bg-surface-container border-b border-outline-variant shadow-sm transition-colors duration-300">
      {/* Title & Search bar */}
      <div className="flex items-center gap-6 flex-1">
        <h2 className="text-body-md font-bold text-on-surface whitespace-nowrap hidden md:block">
          {getViewTitle()}
        </h2>
        <div className="h-4 w-[1px] bg-outline-variant hidden md:block"></div>
        <div className="relative w-full max-w-md group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
            search
          </span>
          <input 
            type="text" 
            placeholder="Search assets, users, or tickets..." 
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-300"
          />
        </div>
      </div>

      {/* Action controls */}
      <div className="flex items-center gap-4">
        {/* Active Role Indicator Badge */}
        <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs font-bold text-primary">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
          <span>Role: {userRole}</span>
        </div>

        {/* Theme Toggle Button */}
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg hover:bg-surface-bright text-on-surface-variant hover:text-on-surface transition-all duration-200"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          <span className="material-symbols-outlined">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Notifications Dropdown Trigger */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-lg hover:bg-surface-bright text-on-surface-variant hover:text-on-surface transition-all duration-200 relative ${
              showNotifications ? 'bg-surface-bright text-on-surface' : ''
            }`}
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border border-surface-container"></span>
          </button>

          {showNotifications && (
            <>
              {/* Overlay blocker */}
              <div 
                className="fixed inset-0 z-40 bg-transparent" 
                onClick={() => setShowNotifications(false)}
              ></div>
              
              {/* Notifications panel */}
              <div className="absolute right-0 mt-2 w-80 bg-surface-container-high border border-outline-variant rounded-xl shadow-xl z-50 p-4 animate-fade-in">
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-outline-variant/60">
                  <h4 className="font-label-md text-label-md font-bold">Notifications</h4>
                  <button className="text-xs text-primary hover:underline font-medium">Mark all read</button>
                </div>
                <div className="space-y-2">
                  {notifications.map(n => (
                    <div 
                      key={n.id} 
                      className={`p-3 rounded-lg border text-left cursor-pointer hover:bg-surface-bright transition-colors ${
                        n.unread 
                          ? 'bg-surface border-outline-variant/50' 
                          : 'bg-transparent border-transparent opacity-75'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-body-sm text-on-surface leading-tight font-medium">
                          {n.text}
                        </p>
                        {n.type === 'danger' && (
                          <span className="w-2 h-2 rounded-full bg-error shrink-0 mt-1"></span>
                        )}
                        {n.type === 'warning' && (
                          <span className="w-2 h-2 rounded-full bg-tertiary-container shrink-0 mt-1"></span>
                        )}
                      </div>
                      <span className="text-[10px] text-on-surface-variant mt-2 block">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Settings button */}
        <button className="p-2 rounded-lg hover:bg-surface-bright text-on-surface-variant hover:text-on-surface transition-colors duration-200">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
