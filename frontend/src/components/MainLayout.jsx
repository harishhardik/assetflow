import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

function MainLayout({ children, theme, setTheme, userRole, currentView, setCurrentView, onLogout }) {
  return (
    <div className="flex h-screen w-full bg-background text-on-surface overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar 
        userRole={userRole} 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        onLogout={onLogout} 
      />

      {/* Main content pane */}
      <div className="flex-1 flex flex-col h-full overflow-hidden ml-64">
        {/* Header bar */}
        <Header 
          theme={theme} 
          setTheme={setTheme} 
          userRole={userRole} 
          currentView={currentView}
        />

        {/* Dynamic page container */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="animate-fade-in h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
