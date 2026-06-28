import { Search, Bell, Settings } from 'lucide-react';
import { useLocation } from 'react-router-dom';

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

export default function TopNav() {
  const location = useLocation();
  const route = routeLabels[location.pathname] ?? { label: 'Page', parent: 'EduAttend' };
  const today = formatDate(new Date());

  return (
    <header className="topnav">
      {/* Breadcrumb */}
      <div className="topnav-breadcrumb">
        <span className="breadcrumb-item">EduAttend Pro</span>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-item">{route.parent}</span>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">{route.label}</span>
      </div>

      {/* Search */}
      <div className="topnav-search">
        <Search size={14} color="var(--text-tertiary)" />
        <input
          type="text"
          placeholder="Search students, faculty..."
          aria-label="Global search"
        />
      </div>

      {/* Actions */}
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
          AD
        </div>
      </div>
    </header>
  );
}
