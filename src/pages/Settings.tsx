import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, CheckCircle, Database } from 'lucide-react';
import { getSettings, saveSettings, initDB } from '../utils/db';

export default function Settings() {
  const [deptName, setDeptName] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [targetAttendance, setTargetAttendance] = useState(80);
  const [saved, setSaved] = useState(false);
  const [dbStatus, setDbStatus] = useState('');

  useEffect(() => {
    const settings = getSettings();
    setDeptName(settings.deptName);
    setInstitutionName(settings.institutionName);
    setTargetAttendance(settings.targetAttendance);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings({
      deptName,
      institutionName,
      targetAttendance: Number(targetAttendance),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleResetDB = () => {
    if (window.confirm('Are you sure you want to reset all data? This will clear custom students, faculty, and re-seed the system with historical attendance logs.')) {
      localStorage.clear();
      initDB();
      const settings = getSettings();
      setDeptName(settings.deptName);
      setInstitutionName(settings.institutionName);
      setTargetAttendance(settings.targetAttendance);
      setDbStatus('Database successfully re-seeded!');
      setTimeout(() => setDbStatus(''), 3000);
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: 800 }}>
      {/* Header */}
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">System Settings</h1>
            <p className="page-subtitle">Configure application settings and simulated database parameters.</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Settings Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">General Configuration</div>
          </div>
          <form onSubmit={handleSave} className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
              {saved ? 'Settings Saved ✓' : 'Save Configuration'}
            </button>
          </form>
        </div>

        {/* Database Management Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Database size={16} />
              Database Management
            </div>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>
              EduAttend Pro runs on a client-side simulated database (`localStorage`). If you need to wipe your custom changes, add more students, or start over with fresh mock trends, you can re-seed the storage here.
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
              Reset & Re-Seed Database
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
