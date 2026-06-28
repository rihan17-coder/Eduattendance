import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  Users,
  GraduationCap,
  UserCheck,
  LogOut,
  Settings as SettingsIcon,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getSession, logoutUser } from '../utils/db';

const adminItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { name: 'Attendance', icon: ClipboardList, path: '/attendance' },
  { name: 'Reports', icon: BarChart3, path: '/reports' },
  { name: 'Faculty', icon: Users, path: '/faculty' },
  { name: 'Students', icon: UserCheck, path: '/students' },
];

const facultyItems = [
  { name: 'Attendance', icon: ClipboardList, path: '/attendance' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const [session, setSession] = useState(getSession());

  useEffect(() => {
    // Poll session changes or listen to local events
    const checkSession = () => {
      setSession(getSession());
    };
    window.addEventListener('storage', checkSession);
    return () => window.removeEventListener('storage', checkSession);
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
    window.location.reload();
  };

  const navItems = session?.role === 'admin' ? adminItems : facultyItems;
  const userInitials = session?.username ? session.username.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'AD';

  return (
    <nav className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-inner">
          <div className="sidebar-logo-icon">
            <GraduationCap size={20} />
          </div>
          <div className="sidebar-logo-text">
            <h1>EduAttend Pro</h1>
            <p>AI &amp; DS Department</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="sidebar-nav">
        <div className="sidebar-section-label">Main Menu</div>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `nav-item${isActive ? ' active' : ''}`
            }
          >
            <item.icon size={17} className="nav-item-icon" />
            <span>{item.name}</span>
          </NavLink>
        ))}

        {session?.role === 'admin' && (
          <>
            <div className="sidebar-section-label">System</div>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `nav-item${isActive ? ' active' : ''}`
              }
            >
              <SettingsIcon size={17} className="nav-item-icon" />
              <span>Settings</span>
            </NavLink>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className={`user-avatar ${session?.role === 'admin' ? 'avatar-blue' : 'avatar-purple'}`}>{userInitials}</div>
          <div className="user-info">
            <div className="user-name">{session?.username || 'Admin User'}</div>
            <div className="user-role">{session?.role === 'admin' ? 'Administrator' : 'Faculty Member'}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}

