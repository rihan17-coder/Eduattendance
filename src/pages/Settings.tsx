import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, CheckCircle, Database, Shield, Bell, User, Monitor, Info } from 'lucide-react';
import { getSettings, saveSettings, initDB, showToast } from '../utils/db';

export default function Settings() {
  const [activeSubTab, setActiveSubTab] = useState('general');

  // General Settings
  const [deptName, setDeptName] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [targetAttendance, setTargetAttendance] = useState(80);
  
  // Profile Settings
  const [profileName, setProfileName] = useState('Admin User');
  const [profileEmail, setProfileEmail] = useState('admin@eduattend.edu');
  
  // Security Password Settings
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification Preferences
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [warningsEnabled, setWarningsEnabled] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  // App Theme/Appearance
  const [themeMode, setThemeMode] = useState('light');

  const [dbStatus, setDbStatus] = useState('');

  useEffect(() => {
    const settings = getSettings();
    setDeptName(settings.deptName);
    setInstitutionName(settings.institutionName);
    setTargetAttendance(settings.targetAttendance);
  }, []);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings({
      deptName,
      institutionName,
      targetAttendance: Number(targetAttendance),
    });
    showToast('General configuration updated', 'success');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Profile settings updated successfully', 'success');
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast('Please enter your current password', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    showToast('Password changed successfully!', 'success');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSavePrefs = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Notification and system preferences saved', 'success');
  };

  const handleResetDB = () => {
    if (window.confirm('Are you sure you want to reset all data? This will clear custom students, faculty, and re-seed the system with fresh morning attendance logs.')) {
      localStorage.clear();
      initDB();
      const settings = getSettings();
      setDeptName(settings.deptName);
      setInstitutionName(settings.institutionName);
      setTargetAttendance(settings.targetAttendance);
      setDbStatus('Database successfully re-seeded!');
      showToast('Local database successfully re-seeded', 'success');
      setTimeout(() => setDbStatus(''), 3000);
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: 900 }}>
      {/* Header */}
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">System Settings</h1>
            <p className="page-subtitle">Configure application settings, user accounts, and system parameters.</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 32, marginTop: 12 }}>
        {/* Left Sub-navigation menu */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { id: 'general', label: 'General Settings', icon: Monitor },
            { id: 'profile', label: 'Admin Profile', icon: User },
            { id: 'security', label: 'Security & Auth', icon: Shield },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'system', label: 'System Details', icon: Info },
            { id: 'database', label: 'Data Operations', icon: Database },
          ].map(item => {
            const Icon = item.icon;
            const active = activeSubTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSubTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: active ? 'var(--primary-soft)' : 'transparent',
                  color: active ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: active ? 700 : 500,
                  fontSize: 13,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={14} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right Settings panel content */}
        <div>
          {/* 1. General Config */}
          {activeSubTab === 'general' && (
            <div className="card">
              <div className="card-header">
                <div className="card-title">General Configuration</div>
              </div>
              <form onSubmit={handleSaveGeneral} className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Institution Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={institutionName}
                    onChange={e => setInstitutionName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Spotlight Department Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={deptName}
                    onChange={e => setDeptName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Target Attendance Rate (%)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={targetAttendance}
                    onChange={e => setTargetAttendance(Number(e.target.value))}
                    min="50"
                    max="100"
                    required
                  />
                  <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 4, display: 'block' }}>
                    Students below this percentage will be flagged as "At Risk" or "Needs Attention".
                  </span>
                </div>

                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: 8 }}>
                  <Save size={14} />
                  Save Configuration
                </button>
              </form>
            </div>
          )}

          {/* 2. Admin Profile Config */}
          {activeSubTab === 'profile' && (
            <div className="card">
              <div className="card-header">
                <div className="card-title">Administrator Profile</div>
              </div>
              <form onSubmit={handleSaveProfile} className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Profile Contact Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileName}
                    onChange={e => setProfileName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Registered Admin Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={profileEmail}
                    onChange={e => setProfileEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">System Account Role</label>
                  <input
                    type="text"
                    className="form-input"
                    value="Primary Department Administrator"
                    disabled
                    style={{ background: 'var(--bg)', color: 'var(--text-tertiary)' }}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: 8 }}>
                  <Save size={14} />
                  Update Profile Detail
                </button>
              </form>
            </div>
          )}

          {/* 3. Security Config */}
          {activeSubTab === 'security' && (
            <div className="card">
              <div className="card-header">
                <div className="card-title">Security &amp; Password Management</div>
              </div>
              <form onSubmit={handleUpdatePassword} className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Current Account Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Enter active password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Minimum 6 characters"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: 8 }}>
                  <Save size={14} />
                  Change Credentials
                </button>
              </form>
            </div>
          )}

          {/* 4. Notification Preferences */}
          {activeSubTab === 'notifications' && (
            <div className="card">
              <div className="card-header">
                <div className="card-title">Notification Preferences</div>
              </div>
              <form onSubmit={handleSavePrefs} className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={emailAlerts}
                      onChange={e => setEmailAlerts(e.target.checked)}
                      style={{ width: 15, height: 15 }}
                    />
                    <span>Enable critical alert logs in top header panel</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={warningsEnabled}
                      onChange={e => setWarningsEnabled(e.target.checked)}
                      style={{ width: 15, height: 15 }}
                    />
                    <span>Notify Class Advisors on students below 75% threshold</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={weeklyDigest}
                      onChange={e => setWeeklyDigest(e.target.checked)}
                      style={{ width: 15, height: 15 }}
                    />
                    <span>Compile and email weekly section attendance reports automatically</span>
                  </label>
                </div>

                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: 12 }}>
                  <Save size={14} />
                  Save Preferences
                </button>
              </form>
            </div>
          )}

          {/* 5. System Details */}
          {activeSubTab === 'system' && (
            <div className="card">
              <div className="card-header">
                <div className="card-title">System Information</div>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Application Version</span>
                    <span style={{ fontWeight: 700 }}>v1.2.0-beta</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Database Host</span>
                    <span style={{ fontFamily: 'monospace' }}>HTML5 LocalStorage Engine (edu_students)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Total Seeded Roster</span>
                    <span>126 Students Registered</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Target Environment</span>
                    <span>Offline Presentation Node</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 6. Database Operations */}
          {activeSubTab === 'database' && (
            <div className="card">
              <div className="card-header">
                <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Database size={16} />
                  Database Management
                </div>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <p style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>
                  EduAttend Pro runs on a client-side simulated database (`localStorage`). If you need to wipe your custom changes, add more students, or start over with fresh morning attendance logs, you can re-seed the storage here.
                </p>

                {dbStatus && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'var(--success-soft)',
                    color: 'var(--success)',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 13,
                    fontWeight: 500,
                  }}>
                    <CheckCircle size={15} />
                    {dbStatus}
                  </div>
                )}

                <button
                  onClick={handleResetDB}
                  className="btn btn-secondary"
                  style={{
                    alignSelf: 'flex-start',
                    color: 'var(--danger)',
                    borderColor: 'var(--danger)',
                    background: 'transparent',
                  }}
                >
                  <RefreshCw size={14} />
                  Reset &amp; Re-Seed Database
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
