import { useState } from 'react';
import { LogIn, AlertCircle, GraduationCap, Shield, User } from 'lucide-react';
import { loginUser } from '../utils/db';

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username.toLowerCase() === 'admin' && password === 'admin') {
      loginUser('Administrator', 'admin');
      onLoginSuccess();
    } else if (username.toLowerCase() === 'faculty' && password === 'faculty') {
      loginUser('Dr. Arun Patel', 'faculty');
      onLoginSuccess();
    } else {
      setError('Invalid username or password. Check the helper box below!');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 10% 20%, #0f172a 0%, #1e1b4b 100%)',
      fontFamily: 'Inter, system-ui, sans-serif',
      padding: 16,
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Brand Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
          <div style={{
            width: 52,
            height: 52,
            background: 'linear-gradient(135deg, #2563EB 0%, #7c3aed 100%)',
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.3)',
            marginBottom: 12,
          }}>
            <GraduationCap size={28} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', margin: 0 }}>
            EduAttend Pro
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.6)', marginTop: 4 }}>
            AI &amp; Data Science Department Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="card" style={{
          background: 'rgba(30, 41, 59, 0.7)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          borderRadius: 16,
          padding: 28,
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 20, textAlign: 'center' }}>
            Sign In
          </h2>

          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171',
              padding: '10px 14px',
              borderRadius: 8,
              fontSize: 12.5,
              fontWeight: 500,
              marginBottom: 16,
              border: '1px solid rgba(239, 68, 68, 0.2)',
            }}>
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Username</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="admin or faculty"
                  value={username}
                  onChange={e => { setUsername(e.target.value); setError(''); }}
                  required
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                  }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                required
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{
              width: '100%',
              justifyContent: 'center',
              marginTop: 8,
              padding: '10px 16px',
              background: 'linear-gradient(135deg, #2563EB 0%, #7c3aed 100%)',
              border: 'none',
              fontWeight: 600,
            }}>
              <LogIn size={15} />
              Sign In
            </button>
          </form>
        </div>

        {/* Credentials Sandbox Helper */}
        <div className="card" style={{
          background: 'rgba(15, 23, 42, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: 12,
          padding: 16,
          marginTop: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fff', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
            <Shield size={14} color="var(--primary)" />
            Simulation Credentials
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 4 }}>
              <span>🔑 **Admin Access** (Full Portal):</span>
              <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 4px', borderRadius: 4, color: '#60a5fa' }}>admin / admin</code>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>👨‍🏫 **Faculty Access** (Attendance Only):</span>
              <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 4px', borderRadius: 4, color: '#c084fc' }}>faculty / faculty</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
