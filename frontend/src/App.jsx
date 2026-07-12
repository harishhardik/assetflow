import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import AssetsManagement from './pages/AssetsManagement';
import AllocationTransfer from './pages/AllocationTransfer';
import ResourceBooking from './pages/ResourceBooking';
import MaintenanceBoard from './pages/MaintenanceBoard';
import OrganizationSetup from './pages/OrganizationSetup';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';

function App() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'dark';
  });
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('Admin'); // Admin, Asset Manager, Department Head, Employee
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleLogin = (role) => {
    setUserRole(role);
    setIsLoggedIn(true);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('dashboard');
  };

  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard userRole={userRole} setCurrentView={setCurrentView} />;
      case 'assets':
        return <AssetsManagement userRole={userRole} />;
      case 'allocation':
        return <AllocationTransfer userRole={userRole} />;
      case 'booking':
        return <ResourceBooking userRole={userRole} />;
      case 'maintenance':
        return <MaintenanceBoard userRole={userRole} />;
      case 'organization':
        return <OrganizationSetup userRole={userRole} />;
      case 'reports':
        return <Reports />;
      case 'notifications':
        return <Notifications />;
      default:
        return <Dashboard userRole={userRole} setCurrentView={setCurrentView} />;
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} theme={theme} setTheme={setTheme} />;
  }

  return (
    <MainLayout
      theme={theme}
      setTheme={setTheme}
      userRole={userRole}
      currentView={currentView}
      setCurrentView={setCurrentView}
      onLogout={handleLogout}
    >
      {renderActiveView()}
    </MainLayout>
  );
}

export default App;
