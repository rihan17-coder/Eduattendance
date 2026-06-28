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
import { FacultyService } from '../services/FacultyService';
import { showToast, FacultyMember } from '../utils/db';

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
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [loading, setLoading] = useState(true);

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

  const loadData = async (bypassCache = false) => {
    try {
      const list = await FacultyService.getFaculty(bypassCache);
      setFaculty(list);
      setLoading(false);
    } catch (e) {
      showToast('Error syncing faculty roster from Supabase', 'error');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleGlobalSearch = () => {
      const q = localStorage.getItem('global_search_query');
      if (q !== null) {
        setSearch(q);
        localStorage.removeItem('global_search_query');
      }
    };
    
    handleGlobalSearch();
    window.addEventListener('global-search', handleGlobalSearch);
    return () => window.removeEventListener('global-search', handleGlobalSearch);
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
      status: f.status || 'active',
    });
    setEditingFacultyId(f.id);
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handleDeleteFaculty = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this faculty member?')) {
      try {
        setFaculty(prev => prev.filter(f => f.id !== id));
        await FacultyService.deleteFaculty(id);
        setActiveMenuId(null);
        showToast('Faculty member profile deleted', 'success');
        loadData(true);
      } catch (err) {
        showToast('Failed to delete faculty member', 'error');
        loadData();
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const subjectsArray = formData.subjects
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    try {
      const facultyPayload = {
        id: editingFacultyId || undefined,
        name: formData.name,
        dept: formData.dept,
        subjects: subjectsArray,
        email: formData.email,
        phone: formData.phone,
        status: formData.status,
      };

      // Optimistic state update
      if (editingFacultyId) {
        setFaculty(prev => prev.map(f => f.id === editingFacultyId ? { ...f, ...facultyPayload, id: editingFacultyId } : f));
      } else {
        setFaculty(prev => [...prev, { ...facultyPayload, id: 'temp-' + Date.now(), status: formData.status }]);
      }
      setIsModalOpen(false);

      await FacultyService.saveFaculty(facultyPayload);
      showToast(editingFacultyId ? 'Faculty details updated successfully' : 'New faculty member added successfully', 'success');
      loadData(true);
    } catch (err) {
      showToast('Error saving faculty member details', 'error');
      loadData();
    }
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
            <p className="page-subtitle">Manage department instructors, subjects, and schedules.</p>
          </div>
          <div className="page-header-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => loadData(true)}>
              <TrendingUp size={13} />
              Sync DB
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleOpenAddModal}>
              <Plus size={13} />
              Add Instructor
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px var(--text-secondary)' }}>Loading faculty roster...</div>
      ) : (
        <>
          {/* Summary Cards */}
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
              <div className="stat-value">
                {Array.from(new Set(faculty.flatMap(f => f.subjects))).length}
              </div>
              <div className="stat-label">Unique Subjects</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-top">
                <div className="stat-card-icon purple"><TrendingUp size={20} /></div>
              </div>
              <div className="stat-value">92%</div>
              <div className="stat-label">Average Lecture Delivery</div>
            </div>
          </div>

          {/* Roster toolbar */}
          <div className="table-toolbar mb-4">
            <div className="table-search">
              <Search size={13} color="var(--text-tertiary)" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search instructors by name or department..."
                aria-label="Search faculty"
              />
            </div>
            <div className="flex gap-2">
              <button className={`btn btn-sm ${view === 'grid' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setView('grid')}>Grid View</button>
              <button className={`btn btn-sm ${view === 'table' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setView('table')}>Table View</button>
            </div>
          </div>

          {view === 'grid' ? (
            <div className="faculty-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {filtered.map((f, idx) => {
                const initials = f.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                const avatarColor = avatarColors[idx % avatarColors.length];
                return (
                  <div key={f.id} className="card" style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', right: 16, top: 16 }}>
                      <button className="icon-btn" onClick={() => setActiveMenuId(activeMenuId === f.id ? null : f.id)} style={{ border: 'none', background: 'transparent' }}>
                        <MoreHorizontal size={14} />
                      </button>
                      {activeMenuId === f.id && (
                        <div className="card shadow-lg" style={{
                          position: 'absolute',
                          right: 0,
                          top: 24,
                          zIndex: 100,
                          padding: '6px 0',
                          width: 140,
                          border: '1px solid var(--border)',
                        }}>
                          <button className="flex items-center gap-2" onClick={() => handleOpenEditModal(f)} style={{ width: '100%', border: 'none', background: 'transparent', padding: '8px 12px', fontSize: 12.5, textAlign: 'left', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                            <Edit2 size={12} /> Edit profile
                          </button>
                          <button className="flex items-center gap-2" onClick={() => handleDeleteFaculty(f.id)} style={{ width: '100%', border: 'none', background: 'transparent', padding: '8px 12px', fontSize: 12.5, textAlign: 'left', cursor: 'pointer', color: 'var(--danger)' }}>
                            <Trash2 size={12} /> Remove faculty
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <div className="flex items-center gap-3">
                        <div className={`avatar avatar-md ${avatarColor}`}>{initials}</div>
                        <div>
                          <h3 style={{ fontSize: 14.5, fontWeight: 700, margin: 0 }}>{f.name}</h3>
                          <span className="badge badge-primary" style={{ marginTop: 4, display: 'inline-block' }}>{f.dept}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12.5, color: 'var(--text-secondary)', borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                        <div className="flex items-center gap-2">
                          <Mail size={13} color="var(--text-tertiary)" />
                          <span>{f.email}</span>
                        </div>
                        {f.phone && (
                          <div className="flex items-center gap-2">
                            <Phone size={13} color="var(--text-tertiary)" />
                            <span>{f.phone}</span>
                          </div>
                        )}
                      </div>

                      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 6 }}>Assigned subjects</div>
                        <div className="flex flex-wrap gap-1.5">
                          {f.subjects.map(sub => (
                            <span key={sub} className="badge badge-neutral" style={{ fontSize: 11 }}>{sub}</span>
                          ))}
                          {f.subjects.length === 0 && <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>No subjects assigned</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Instructor</th>
                    <th>Department</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Assigned Subjects</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(f => (
                    <tr key={f.id}>
                      <td className="font-semibold">{f.name}</td>
                      <td><span className="badge badge-primary">{f.dept}</span></td>
                      <td>{f.email}</td>
                      <td>{f.phone}</td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {f.subjects.map(s => <span key={s} className="badge badge-neutral" style={{ fontSize: 11 }}>{s}</span>)}
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEditModal(f)}>Edit</button>
                          <button className="btn btn-ghost btn-sm" onClick={() => handleDeleteFaculty(f.id)} style={{ color: 'var(--danger)' }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

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
              <div className="card-title">{editingFacultyId ? 'Edit Instructor Details' : 'Add New Instructor'}</div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}>
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
                  placeholder="e.g. Dr. Ramesh Kumar"
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
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="ME">ME</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Subjects (comma-separated)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. ML (AI301), Python (AI101)"
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
                  placeholder="e.g. r.kumar@edu.in"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. +91 99999 88888"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="flex gap-2 justify-end" style={{ marginTop: 12 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingFacultyId ? 'Save Changes' : 'Add Instructor'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
