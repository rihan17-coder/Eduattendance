import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Filter,
  Mail,
  Phone,
  MoreHorizontal,
  BookOpen,
  Users,
  TrendingUp,
  X,
  Trash2,
  Edit2,
} from 'lucide-react';
import { getFaculty, saveFaculty } from '../utils/db';

const avatarColors = ['avatar-blue', 'avatar-purple', 'avatar-green', 'avatar-orange', 'avatar-teal', 'avatar-pink'];

interface FacultyFormData {
  name: string;
  dept: string;
  subjects: string;
  email: string;
  phone: string;
  status: 'active' | 'on-leave';
}

export default function Faculty() {
  const [faculty, setFaculty] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'table'>('grid');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFacultyId, setEditingFacultyId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FacultyFormData>({
    name: '',
    dept: 'AI & DS',
    subjects: '',
    email: '',
    phone: '',
    status: 'active',
  });

  // Action Menu state
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  useEffect(() => {
    setFaculty(getFaculty());
  }, []);

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      dept: 'AI & DS',
      subjects: '',
      email: '',
      phone: '',
      status: 'active',
    });
    setEditingFacultyId(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (f: any) => {
    setFormData({
      name: f.name,
      dept: f.dept,
      subjects: f.subjects.join(', '),
      email: f.email,
      phone: f.phone,
      status: f.status,
    });
    setEditingFacultyId(f.id);
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handleDeleteFaculty = (id: string) => {
    if (window.confirm('Are you sure you want to delete this faculty member?')) {
      const updated = faculty.filter(f => f.id !== id);
      saveFaculty(updated);
      setFaculty(updated);
      setActiveMenuId(null);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subjectsArray = formData.subjects
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (editingFacultyId) {
      // Edit
      const updated = faculty.map(f =>
        f.id === editingFacultyId
          ? { ...f, ...formData, subjects: subjectsArray }
          : f
      );
      saveFaculty(updated);
      setFaculty(updated);
    } else {
      // Add
      const initials = formData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      const color = avatarColors[faculty.length % avatarColors.length];
      const newFaculty = {
        id: Date.now().toString(),
        name: formData.name,
        dept: formData.dept,
        subjects: subjectsArray,
        email: formData.email,
        phone: formData.phone,
        status: formData.status,
        students: Math.floor(Math.random() * 40) + 80, // simulated
        attendance: Math.floor(Math.random() * 12) + 85, // simulated
        initials,
        color,
      };
      const updated = [...faculty, newFaculty];
      saveFaculty(updated);
      setFaculty(updated);
    }
    setIsModalOpen(false);
  };

  const filtered = faculty.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.dept.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Faculty Management</h1>
            <p className="page-subtitle">Manage teaching staff, roles, and subject assignments here.</p>
          </div>
          <div className="page-header-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => setView(view === 'grid' ? 'table' : 'grid')}>
              <Filter size={13} />
              Toggle View
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleOpenAddModal}>
              <Plus size={13} />
              Add Faculty
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="stats-grid mb-6">
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-card-icon blue"><Users size={20} /></div>
          </div>
          <div className="stat-value">{faculty.length}</div>
          <div className="stat-label">Total Faculty</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-card-icon green"><BookOpen size={20} /></div>
          </div>
          <div className="stat-value">{faculty.reduce((acc, f) => acc + f.subjects.length, 0)}</div>
          <div className="stat-label">Active Subjects</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-card-icon purple"><TrendingUp size={20} /></div>
          </div>
          <div className="stat-value">
            {faculty.length > 0
              ? Math.round(faculty.reduce((acc, f) => acc + (f.attendance || 90), 0) / faculty.length) + '%'
              : '—'}
          </div>
          <div className="stat-label">Avg. Class Attendance</div>
        </div>
      </div>

      {/* Table / Grid */}
      <div className="table-wrapper">
        <div className="table-toolbar">
          <div className="table-search">
            <Search size={13} color="var(--text-tertiary)" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search faculty by name or department..."
              aria-label="Search faculty"
            />
          </div>
          <div className="flex gap-2">
            <button
              className={`btn btn-sm ${view === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setView('grid')}
            >
              Grid
            </button>
            <button
              className={`btn btn-sm ${view === 'table' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setView('table')}
            >
              Table
            </button>
          </div>
        </div>

        {view === 'table' ? (
          <table style={{ overflow: 'visible' }}>
            <thead>
              <tr>
                <th>Faculty</th>
                <th>Department</th>
                <th>Subjects</th>
                <th>Students</th>
                <th>Attendance</th>
                <th>Status</th>
                <th style={{ width: 60 }}></th>
              </tr>
            </thead>
            <tbody style={{ overflow: 'visible' }}>
              {filtered.map((f, idx) => (
                <tr key={f.id} style={{ overflow: 'visible' }}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className={`avatar avatar-md ${f.color}`}>{f.initials}</div>
                      <div>
                        <div className="font-semibold">{f.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{f.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-primary">{f.dept}</span></td>
                  <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{f.subjects.join(', ')}</td>
                  <td><span className="badge badge-neutral">{f.students}</span></td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="progress-bar" style={{ width: 60, display: 'inline-block' }}>
                        <div className="progress-fill blue" style={{ width: `${f.attendance}%` }} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: f.attendance >= 90 ? 'var(--success)' : 'var(--warning)' }}>
                        {f.attendance}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${f.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                      <span className="badge-dot" />
                      {f.status === 'active' ? 'Active' : 'On Leave'}
                    </span>
                  </td>
                  <td style={{ position: 'relative', overflow: 'visible' }}>
                    <button
                      className="icon-btn"
                      onClick={() => setActiveMenuId(activeMenuId === f.id ? null : f.id)}
                      style={{ border: 'none', background: 'transparent', width: 28, height: 28 }}
                    >
                      <MoreHorizontal size={16} color="var(--text-tertiary)" />
                    </button>

                    {activeMenuId === f.id && (
                      <div style={{
                        position: 'absolute',
                        right: 8,
                        top: 36,
                        background: '#fff',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: 'var(--shadow-md)',
                        zIndex: 100,
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: 120,
                      }}>
                        <button
                          onClick={() => handleOpenEditModal(f)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '8px 12px',
                            border: 'none',
                            background: 'transparent',
                            textAlign: 'left',
                            fontSize: 12.5,
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            width: '100%',
                          }}
                        >
                          <Edit2 size={13} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteFaculty(f.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '8px 12px',
                            border: 'none',
                            background: 'transparent',
                            textAlign: 'left',
                            fontSize: 12.5,
                            color: 'var(--danger)',
                            cursor: 'pointer',
                            width: '100%',
                            borderTop: '1px solid var(--border)',
                          }}
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">
                      <div className="empty-state-icon"><Search size={22} /></div>
                      <div className="empty-state-title">No faculty members found</div>
                      <div className="empty-state-desc">Try modifying your search text.</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {filtered.map(f => (
              <div key={f.id} className="subject-card" style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: 12, right: 12 }}>
                  <button
                    className="icon-btn"
                    onClick={() => setActiveMenuId(activeMenuId === f.id ? null : f.id)}
                    style={{ border: 'none', background: 'transparent' }}
                  >
                    <MoreHorizontal size={14} color="var(--text-tertiary)" />
                  </button>
                  {activeMenuId === f.id && (
                    <div style={{
                      position: 'absolute',
                      right: 0,
                      top: 24,
                      background: '#fff',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-md)',
                      zIndex: 100,
                      display: 'flex',
                      flexDirection: 'column',
                      minWidth: 100,
                    }}>
                      <button onClick={() => handleOpenEditModal(f)} style={{ padding: '6px 12px', border: 'none', background: 'transparent', fontSize: 12, cursor: 'pointer', textAlign: 'left' }}>Edit</button>
                      <button onClick={() => handleDeleteFaculty(f.id)} style={{ padding: '6px 12px', border: 'none', background: 'transparent', fontSize: 12, cursor: 'pointer', color: 'var(--danger)', textAlign: 'left', borderTop: '1px solid var(--border)' }}>Delete</button>
                    </div>
                  )}
                </div>

                <div className="subject-card-header">
                  <div className="flex items-center gap-3">
                    <div className={`avatar avatar-lg ${f.color}`}>{f.initials}</div>
                    <div>
                      <div className="subject-name">{f.name}</div>
                      <div className="subject-code">{f.dept}</div>
                    </div>
                  </div>
                  <span className={`badge ${f.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                    {f.status === 'active' ? 'Active' : 'Leave'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
                  {f.subjects.map(s => (
                    <span key={s} className="badge badge-neutral">{s}</span>
                  ))}
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Avg. Attendance</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: f.attendance >= 90 ? 'var(--success)' : 'var(--warning)' }}>{f.attendance}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill blue" style={{ width: `${f.attendance}%` }} />
                  </div>
                </div>

                <div className="flex gap-3 mt-3" style={{ paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                  <a href={`mailto:${f.email}`} className="flex items-center gap-1" style={{ fontSize: 12, color: 'var(--text-secondary)', textDecoration: 'none' }}>
                    <Mail size={12} /> Email
                  </a>
                  <span style={{ color: 'var(--border)' }}>|</span>
                  <span className="flex items-center gap-1" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    <Users size={12} /> {f.students} students
                  </span>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ gridColumn: '1 / -1' }} className="empty-state">
                <div className="empty-state-icon"><Search size={22} /></div>
                <div className="empty-state-title">No faculty members found</div>
                <div className="empty-state-desc">Try modifying your search or click 'Add Faculty'.</div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between items-center" style={{ padding: '12px 18px', borderTop: '1px solid var(--border)' }}>
          <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
            Showing {filtered.length} of {faculty.length} faculty members
          </span>
          <div className="flex gap-2">
            <button className="btn btn-secondary btn-sm" disabled>Previous</button>
            <button className="btn btn-secondary btn-sm" disabled>Next</button>
          </div>
        </div>
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
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
          <div className="card" style={{ width: '100%', maxWidth: 460, borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', overflow: 'hidden' }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="card-title">{editingFacultyId ? 'Edit Faculty Details' : 'Add New Faculty Member'}</div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Dr. Arun Patel"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department</label>
                <select
                  className="form-select"
                  value={formData.dept}
                  onChange={e => setFormData({ ...formData, dept: e.target.value })}
                >
                  <option value="AI & DS">AI &amp; DS</option>
                  <option value="CSE">Computer Science</option>
                  <option value="ECE">Electronics</option>
                  <option value="ME">Mechanical</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Subjects Taught (comma separated)</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Machine Learning, Python"
                  value={formData.subjects}
                  onChange={e => setFormData({ ...formData, subjects: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  required
                  placeholder="e.g. a.patel@edu.in"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                >
                  <option value="active">Active</option>
                  <option value="on-leave">On Leave</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end" style={{ marginTop: 12 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {editingFacultyId ? 'Save Changes' : 'Add Faculty'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
