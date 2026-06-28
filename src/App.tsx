/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Search, Bell, Settings } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Faculty from './pages/Faculty';
import Students from './pages/Students';
import Attendance from './pages/Attendance';
import SettingsPage from './pages/Settings';
import Login from './pages/Login';
import { getSession, initDB } from './utils/db';

const routeLabels: Record<string, { label: string; parent: string }> = {
  '/': { label: 'Dashboard', parent: 'Overview' },
  '/attendance': { label: 'Attendance', parent: 'Management' },
  '/reports': { label: 'Reports', parent: 'Analytics' },
  '/faculty': { label: 'Faculty', parent: 'Management' },
  '/students': { label: 'Students', parent: 'Management' },
  '/settings': { label: 'Settings', parent: 'System' },
};

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function TopNav() {
  const location = useLocation();
  const route = routeLabels[location.pathname] ?? { label: 'Page', parent: 'EduAttend' };
  const today = formatDate(new Date());
  const session = getSession();
  const userInitials = session?.username ? session.username.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'AD';

  return (
    <header className="topnav">
      <div className="topnav-breadcrumb">
        <span className="breadcrumb-item">EduAttend Pro</span>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-item">{route.parent}</span>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">{route.label}</span>
      </div>

      <div className="topnav-search">
        <Search size={14} color="var(--text-tertiary)" />
        <input
          type="text"
          placeholder="Search students, faculty..."
          aria-label="Global search"
        />
      </div>

      <div className="topnav-actions">
        <div className="topnav-date">{today}</div>

        <button className="icon-btn" aria-label="Notifications" title="Notifications">
          <Bell size={16} />
          <span className="notif-dot" />
        </button>

        <button className="icon-btn" aria-label="Settings" title="Settings">
          <Settings size={16} />
        </button>

        <div className="topnav-avatar" role="button" aria-label="User profile" title="Admin User">
          {userInitials}
        </div>
      </div>
    </header>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [session, setSession] = useState(getSession());

  useEffect(() => {
    // Initialize LocalStorage Database Seed
    initDB();
    const activeSession = getSession();
    if (activeSession) {
      setIsAuthenticated(true);
      setSession(activeSession);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setSession(getSession());
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Router>
      <div className="app-layout">
        <Sidebar />
        <div className="main-content">
          <TopNav />
          <main className="page-content">
            <Routes>
              {session?.role === 'admin' ? (
                <>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/attendance" element={<Attendance />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/faculty" element={<Faculty />} />
                  <Route path="/students" element={<Students />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </>
              ) : (
                <>
                  <Route path="/attendance" element={<Attendance />} />
                  <Route path="*" element={<Navigate to="/attendance" replace />} />
                </>
              )}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
