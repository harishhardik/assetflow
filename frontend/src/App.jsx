import React, { useState, useEffect, useContext } from 'react';
import Login from './pages/Login';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import AssetsManagement from './pages/AssetsManagement';
import AllocationTransfer from './pages/AllocationTransfer';
import ResourceBooking from './pages/ResourceBooking';
import MaintenanceBoard from './pages/MaintenanceBoard';
import OrganizationSetup from './pages/OrganizationSetup';
import AssetAudit from './pages/AssetAudit';
import ReportsAnalytics from './pages/ReportsAnalytics';
import ActivityLogs from './pages/ActivityLogs';
import { AppContextProvider, AppContext } from './context/AppContext';

function AppContent() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'dark';
  });

  const { currentUser, userRole, handleLogout } = useContext(AppContext);
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

  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard setCurrentView={setCurrentView} />;
      case 'assets':
        return <AssetsManagement />;
      case 'allocation':
        return <AllocationTransfer />;
      case 'booking':
        return <ResourceBooking />;
      case 'maintenance':
        return <MaintenanceBoard />;
      case 'organization':
        return <OrganizationSetup />;
      case 'audit':
        return <AssetAudit />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'logs':
        return <ActivityLogs />;
      default:
        return <Dashboard setCurrentView={setCurrentView} />;
    }
  };

  if (!currentUser) {
    return <Login theme={theme} setTheme={setTheme} />;
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

function App() {
  return (
    <AppContextProvider>
      <AppContent />
    </AppContextProvider>
  );
}

export default App;
