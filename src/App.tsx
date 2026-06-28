/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Search, Bell, Settings, LogOut, User, Shield, Info, Check, X } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Faculty from './pages/Faculty';
import Students from './pages/Students';
import Attendance from './pages/Attendance';
import SettingsPage from './pages/Settings';
import Login from './pages/Login';
import { getSession, initDB, logoutUser } from './utils/db';

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

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [session, setSession] = useState(getSession());
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: '1', title: 'Low Attendance Flagged', desc: 'Indhu S (Sec A) attendance dropped below 75%', time: '10 min ago', unread: true },
    { id: '2', title: 'Roster Generated', desc: 'Successfully imported 126 AI/DS student records', time: '1 hr ago', unread: true },
    { id: '3', title: 'System Security Verified', desc: 'Morning database roll cache updated', time: '3 hr ago', unread: false },
  ]);

  // Modals state
  const [isAdminProfileOpen, setIsAdminProfileOpen] = useState(false);

  useEffect(() => {
    // Initialize LocalStorage Database Seed
    initDB();
    const activeSession = getSession();
    if (activeSession) {
      setIsAuthenticated(true);
      setSession(activeSession);
    }

    // Register Toast Listener
    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      setToast(customEvent.detail);
      // Auto clear toast
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    };
    window.addEventListener('show-toast', handleToastEvent);
    return () => window.removeEventListener('show-toast', handleToastEvent);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setSession(getSession());
  };

  const handleLogout = () => {
    logoutUser();
    setIsAuthenticated(false);
    setSession(null);
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleClearNotif = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadNotifCount = notifications.filter(n => n.unread).length;

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Define TopNav inside App to access notification states & profile options
  function TopNav() {
    const location = useLocation();
    const route = routeLabels[location.pathname] ?? { label: 'Page', parent: 'EduAttend' };
    const today = formatDate(new Date());
    const userInitials = session?.username ? session.username.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'AD';

    // Dropdown Toggles
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchVal, setSearchVal] = useState('');

    const handleSearchSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!searchVal.trim()) return;
      
      // Store in search cache and dispatch custom event so students list catches it
      localStorage.setItem('global_search_query', searchVal);
      window.dispatchEvent(new Event('global-search'));
      
      // Redirect to Students page
      window.location.hash = ''; // clear hash
      const link = document.createElement('a');
      link.href = '/students';
      // Simulate navigate via routing or standard dispatch
      window.history.pushState({}, '', '/students');
      window.dispatchEvent(new PopStateEvent('popstate'));
    };

    return (
      <header className="topnav">
        <div className="topnav-breadcrumb">
          <span className="breadcrumb-item">EduAttend Pro</span>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-item">{route.parent}</span>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-current">{route.label}</span>
        </div>

        <form onSubmit={handleSearchSubmit} className="topnav-search">
          <Search size={14} color="var(--text-tertiary)" />
          <input
            type="text"
            placeholder="Type query &amp; Enter to search students..."
            aria-label="Global search"
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
          />
        </form>

        <div className="topnav-actions" style={{ position: 'relative' }}>
          <div className="topnav-date">{today}</div>

          {/* Notifications Trigger */}
          <div style={{ position: 'relative' }}>
            <button 
              className="icon-btn" 
              onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
              aria-label="Notifications" 
              title="Notifications"
            >
              <Bell size={16} />
              {unreadNotifCount > 0 && <span className="notif-dot" />}
            </button>

            {/* Notifications Panel */}
            {isNotifOpen && (
              <div className="card" style={{
                position: 'absolute',
                right: 0,
                top: 42,
                width: 320,
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                zIndex: 500,
                overflow: 'hidden',
              }}>
                <div style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'var(--bg)',
                }}>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' }}>Notifications</span>
                  {unreadNotifCount > 0 && (
                    <button 
                      onClick={handleMarkAllRead}
                      style={{ border: 'none', background: 'transparent', color: 'var(--primary)', fontSize: 11.5, fontWeight: 600, cursor: 'pointer' }}
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                  {notifications.map(n => (
                    <div key={n.id} style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid var(--border)',
                      background: n.unread ? 'rgba(37, 99, 235, 0.03)' : 'transparent',
                      position: 'relative',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>{n.title}</div>
                        <button 
                          onClick={() => handleClearNotif(n.id)}
                          style={{ border: 'none', background: 'transparent', color: 'var(--text-tertiary)', cursor: 'pointer' }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginTop: 2 }}>{n.desc}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 4 }}>{n.time}</div>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 12.5 }}>
                      No new notifications
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Settings Shortcut */}
          {session?.role === 'admin' && (
            <button 
              className="icon-btn" 
              onClick={() => {
                window.history.pushState({}, '', '/settings');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              aria-label="Settings" 
              title="Settings"
            >
              <Settings size={16} />
            </button>
          )}

          {/* Profile Dropdown */}
          <div style={{ position: 'relative' }}>
            <div 
              className="topnav-avatar" 
              role="button" 
              onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}
              aria-label="User profile" 
              title={session?.username}
            >
              {userInitials}
            </div>

            {isProfileOpen && (
              <div className="card" style={{
                position: 'absolute',
                right: 0,
                top: 42,
                width: 220,
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                zIndex: 500,
                overflow: 'hidden',
                padding: '6px 0',
              }}>
                <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{session?.username}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>
                    {session?.role === 'admin' ? 'Administrator' : 'Faculty Member'}
                  </div>
                </div>

                <button 
                  onClick={() => { setIsAdminProfileOpen(true); setIsProfileOpen(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    width: '100%',
                    padding: '10px 16px',
                    border: 'none',
                    background: 'transparent',
                    textAlign: 'left',
                    fontSize: 12.5,
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  <User size={13} /> View Profile
                </button>

                {session?.role === 'admin' && (
                  <button 
                    onClick={() => {
                      window.history.pushState({}, '', '/settings');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                      setIsProfileOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      width: '100%',
                      padding: '10px 16px',
                      border: 'none',
                      background: 'transparent',
                      textAlign: 'left',
                      fontSize: 12.5,
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                    }}
                  >
                    <Settings size={13} /> Account Settings
                  </button>
                )}

                <button 
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    width: '100%',
                    padding: '10px 16px',
                    border: 'none',
                    background: 'transparent',
                    textAlign: 'left',
                    fontSize: 12.5,
                    color: 'var(--danger)',
                    cursor: 'pointer',
                    borderTop: '1px solid var(--border)',
                  }}
                >
                  <LogOut size={13} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    );
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

      {/* Global Toast Alert */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: toast.type === 'success' ? 'var(--success)' : toast.type === 'error' ? 'var(--danger)' : '#3b82f6',
          color: '#fff',
          padding: '10px 18px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          zIndex: 2000,
          fontSize: 13,
          fontWeight: 600,
        }}>
          <Check size={14} />
          {toast.message}
        </div>
      )}

      {/* User Profile Modal Dialog */}
      {isAdminProfileOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div className="card" style={{ width: '100%', maxWidth: 400, borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', overflow: 'hidden' }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="card-title">User Profile Info</div>
              <button 
                onClick={() => setIsAdminProfileOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '24px 20px' }}>
              <div className={`avatar avatar-lg avatar-blue`} style={{ width: 64, height: 64, fontSize: 24, fontWeight: 700 }}>
                {session?.username ? session.username.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'AD'}
              </div>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{session?.username}</h3>
                <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>
                  {session?.role === 'admin' ? 'Administrator Account' : 'Faculty Member Account'}
                </p>
              </div>
              
              <div style={{ width: '100%', borderTop: '1px solid var(--border)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Role Status:</span>
                  <span className="badge badge-success" style={{ padding: '2px 8px' }}>Active</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Login Node:</span>
                  <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>Simulated local session</span>
                </div>
              </div>

              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => setIsAdminProfileOpen(false)}
                style={{ marginTop: 12, width: '100%', justifyContent: 'center' }}
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </Router>
  );
}
