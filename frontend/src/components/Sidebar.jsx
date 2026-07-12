import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

function Sidebar({ currentView, setCurrentView, onLogout }) {
  const { currentUser, userRole } = useContext(AppContext);

  const getProfileData = () => {
    if (currentUser) {
      return {
        name: currentUser.name,
        roleTitle: currentUser.role,
        initials: currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
        avatar: currentUser.avatar || ''
      };
    }
    return {
      name: 'Guest User',
      roleTitle: 'Employee',
      initials: 'GU',
      avatar: ''
    };
  };

  const profile = getProfileData();

  // Navigation Items configurations
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', roles: ['Admin', 'Asset Manager', 'Department Head', 'Employee'] },
    { id: 'organization', label: 'Organization Setup', icon: 'corporate_fare', roles: ['Admin'] },
    { id: 'assets', label: 'Assets', icon: 'inventory_2', roles: ['Admin', 'Asset Manager', 'Department Head', 'Employee'] },
    { id: 'allocation', label: 'Allocation & Transfer', icon: 'move_up', roles: ['Admin', 'Asset Manager', 'Department Head', 'Employee'] },
    { id: 'booking', label: 'Resource Booking', icon: 'event_available', roles: ['Admin', 'Asset Manager', 'Department Head', 'Employee'] },
    { id: 'maintenance', label: 'Maintenance', icon: 'build', roles: ['Admin', 'Asset Manager', 'Department Head', 'Employee'] },
    { id: 'audit', label: 'Asset Audit', icon: 'fact_check', roles: ['Admin', 'Asset Manager'] },
    { id: 'reports', label: 'Reports & Analytics', icon: 'bar_chart', roles: ['Admin', 'Asset Manager', 'Department Head'] },
    { id: 'logs', label: 'Activity Logs', icon: 'list_alt', roles: ['Admin', 'Asset Manager', 'Department Head', 'Employee'] }
  ];

  // Filter navigation items by active user role
  const visibleNavItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-low border-r border-outline-variant flex flex-col py-margin-page gap-element-gap z-40 transition-colors duration-300">
      {/* Brand logo & tagline */}
      <div className="px-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 transition-all duration-300">
            <span className="material-symbols-outlined text-on-primary font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
          </div>
          <div>
            <h1 className="font-headline-sm text-headline-sm font-black text-primary tracking-tight">AssetFlow</h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest opacity-80">Enterprise ERP</p>
          </div>
        </div>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-4 space-y-1.5">
        {visibleNavItems.map(item => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 active:scale-[0.98] relative group ${
                isActive
                  ? 'bg-secondary-container text-on-secondary-container font-semibold before:content-[""] before:absolute before:left-0 before:w-1 before:h-6 before:bg-primary before:rounded-r-full shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
              }`}
            >
              <span 
                className={`material-symbols-outlined transition-transform duration-200 group-hover:scale-105 ${
                  isActive ? 'text-primary' : 'text-on-surface-variant'
                }`}
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : undefined }}
              >
                {item.icon}
              </span>
              <span className="font-label-md text-label-md">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User profile footer widget */}
      <div className="px-4 mt-auto">
        <div className="p-4 bg-surface-container rounded-xl border border-outline-variant/60 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-3">
            {profile.avatar ? (
              <img 
                className="w-10 h-10 rounded-full border-2 border-primary object-cover" 
                src={profile.avatar} 
                alt={profile.name} 
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container font-bold flex items-center justify-center border-2 border-primary/20 text-sm">
                {profile.initials}
              </div>
            )}
            <div className="overflow-hidden">
              <p className="font-label-md text-label-md text-on-surface font-semibold truncate leading-tight">{profile.name}</p>
              <p className="text-[11px] text-on-surface-variant truncate leading-none mt-1">{profile.roleTitle}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 text-label-sm font-label-sm text-error bg-error-container/10 hover:bg-error-container/20 rounded-lg transition-colors border border-error/15"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
