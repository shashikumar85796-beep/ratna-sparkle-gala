import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { adminLogout, isAdminLoggedIn, getAdminName } from '@/lib/adminAuth';
import logoImg from '@/assets/BCS-Trophy-Website-Logo.png';

const navSections = [
  {
    label: 'Overview',
    items: [{ icon: '📊', label: 'Dashboard', to: '/admin/dashboard' }],
  },
  {
    label: 'Nominations',
    items: [
      { icon: '📋', label: 'All Nominations', to: '/admin/nominations' },
      { icon: '💰', label: 'Payments', to: '/admin/payments' },
      { icon: '📁', label: 'Export Data', to: '/admin/export' },
    ],
  },
  {
    label: 'Content Management',
    items: [
      { icon: '🖼', label: 'Gallery (Glimpses)', to: '/admin/gallery' },
      { icon: '📅', label: 'Past Events', to: '/admin/past-events' },
      { icon: '🎬', label: 'Video Gallery', to: '/admin/videos' },
      { icon: '🏆', label: 'Winners', to: '/admin/winners' },
    ],
  },
  {
    label: 'Homepage Sections',
    items: [
      { icon: '⭐', label: 'VIP Attendees', to: '/admin/attendees' },
      { icon: '🤝', label: 'Partners & Sponsors', to: '/admin/partners' },
      { icon: '💬', label: 'Testimonials', to: '/admin/testimonials' },
    ],
  },
  {
    label: 'System',
    items: [
      { icon: '⚙️', label: 'Site Settings', to: '/admin/settings' },
    ],
  },
];

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: '12px', color: '#888' }}>
      {time.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
      {' '}
      {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </span>
  );
}

type Props = {
  children: React.ReactNode;
  title: string;
};

export function AdminLayout({ children, title }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    adminLogout();
    navigate({ to: '/admin' });
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0A0A', fontFamily: "'Open Sans', sans-serif" }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px', background: '#0A0A0A',
        borderRight: '1px solid rgba(201,168,76,0.15)',
        borderTop: '2px solid #C9A84C',
        position: 'fixed', top: 0, left: 0, bottom: 0,
        overflowY: 'auto', zIndex: 100,
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Logo */}
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
          <img src={logoImg} alt="BCS Ratna" style={{ height: '56px', width: 'auto', objectFit: 'contain' }} />
          <p style={{
            fontFamily: "'Raleway', sans-serif", fontSize: '10px',
            color: '#C9A84C', letterSpacing: '3px', textTransform: 'uppercase',
            marginTop: '8px',
          }}>
            Admin Panel
          </p>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '8px 0' }}>
          {navSections.map(section => (
            <div key={section.label}>
              <p style={{
                fontFamily: "'Raleway', sans-serif", fontSize: '10px', color: '#555',
                letterSpacing: '2px', textTransform: 'uppercase',
                padding: '16px 20px 6px', margin: 0,
              }}>
                {section.label}
              </p>
              {section.items.map(item => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to as any}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '12px 20px', margin: '2px 8px', borderRadius: '8px',
                      fontFamily: "'Raleway', sans-serif", fontSize: '12px',
                      fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase',
                      color: isActive ? '#C9A84C' : '#888',
                      background: isActive ? 'rgba(201,168,76,0.12)' : 'transparent',
                      borderLeft: isActive ? '3px solid #C9A84C' : '3px solid transparent',
                      textDecoration: 'none', transition: 'all 0.2s',
                      paddingLeft: isActive ? '17px' : '20px',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(201,168,76,0.08)';
                        e.currentTarget.style.color = '#C9A84C';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#888';
                      }
                    }}
                  >
                    <span style={{ fontSize: '14px' }}>{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(201,168,76,0.1)' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', padding: '12px', borderRadius: '8px',
              border: '1px solid rgba(201,168,76,0.3)', background: 'transparent',
              color: '#C9A84C', cursor: 'pointer', fontFamily: "'Raleway', sans-serif",
              fontSize: '12px', fontWeight: 700, letterSpacing: '1.5px',
              textTransform: 'uppercase', transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(201,168,76,0.1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Topbar */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 50,
          height: '56px', background: '#0D0D0D',
          borderBottom: '1px solid rgba(201,168,76,0.15)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '0 32px',
        }}>
          <h1 style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 700, fontSize: '18px', color: '#fff', margin: 0 }}>
            {title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <LiveClock />
            <span style={{
              padding: '6px 14px', background: 'rgba(201,168,76,0.1)',
              border: '1px solid rgba(201,168,76,0.2)', borderRadius: '20px',
              fontFamily: "'Raleway', sans-serif", fontSize: '12px', color: '#C9A84C',
              fontWeight: 600,
            }}>
              {getAdminName()}
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: '6px 16px', border: '1px solid rgba(201,168,76,0.3)',
                background: 'transparent', color: '#C9A84C', borderRadius: '6px',
                cursor: 'pointer', fontFamily: "'Raleway', sans-serif",
                fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase',
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Content */}
        <main style={{ padding: '32px', flex: 1, background: '#0F0F0F' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
