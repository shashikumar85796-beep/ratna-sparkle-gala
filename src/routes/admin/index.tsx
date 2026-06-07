import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { adminLogin, isAdminLoggedIn } from '@/lib/adminAuth';
import logoImg from '@/assets/BCS-Trophy-Website-Logo.png';

export const Route = createFileRoute('/admin/')({
  component: AdminLoginPage,
});

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdminLoggedIn()) navigate({ to: '/admin/dashboard' });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    // Direct comparison — no async needed
    if (username.trim() === 'bcsadmin' && password === 'BCS@2026') {
      const session = { username: username.trim(), loginTime: Date.now(), expires: Date.now() + 24 * 60 * 60 * 1000 };
      localStorage.setItem('bcs_admin_session', JSON.stringify(session));
      navigate({ to: '/admin/dashboard' });
    } else {
      setError('Invalid username or password');
    }
    setLoading(false);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '14px 16px', borderRadius: '10px',
    border: '1px solid rgba(201,168,76,0.3)', background: 'rgba(255,255,255,0.04)',
    color: '#fff', fontFamily: "'Open Sans', sans-serif", fontSize: '15px',
    outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#080808',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Open Sans', sans-serif",
      backgroundImage: 'radial-gradient(ellipse at center, rgba(201,168,76,0.08) 0%, transparent 60%)',
    }}>
      <div style={{
        width: '100%', maxWidth: '420px', padding: '0 20px',
      }}>
        <div style={{
          background: '#111', border: '1px solid rgba(201,168,76,0.2)',
          borderRadius: '20px', padding: '48px 40px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <img src={logoImg} alt="BCS Ratna" style={{ height: '64px', width: 'auto', objectFit: 'contain', marginBottom: '16px' }} />
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: '10px', color: '#C9A84C', letterSpacing: '4px', textTransform: 'uppercase', margin: 0 }}>
              Admin Panel
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontFamily: "'Raleway', sans-serif", fontSize: '11px', color: '#C9A84C', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block', marginBottom: '6px', fontWeight: 700 }}>
                Username
              </label>
              <input
                type="text" value={username}
                onChange={e => setUsername(e.target.value)}
                style={inputStyle} placeholder="Enter username"
                required autoFocus
              />
            </div>
            <div>
              <label style={{ fontFamily: "'Raleway', sans-serif", fontSize: '11px', color: '#C9A84C', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block', marginBottom: '6px', fontWeight: 700 }}>
                Password
              </label>
              <input
                type="password" value={password}
                onChange={e => setPassword(e.target.value)}
                style={inputStyle} placeholder="Enter password"
                required
              />
            </div>

            {error && (
              <p style={{ color: '#EF4444', fontSize: '13px', textAlign: 'center', margin: 0, padding: '10px', background: 'rgba(239,68,68,0.08)', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)' }}>
                {error}
              </p>
            )}

            <button
              type="submit" disabled={loading}
              style={{
                padding: '14px', borderRadius: '10px', border: 'none',
                background: 'linear-gradient(135deg, #BF953F, #C9A84C, #B38728)',
                color: '#000', fontFamily: "'Raleway', sans-serif",
                fontWeight: 800, fontSize: '13px', letterSpacing: '2px',
                textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1, transition: 'all 0.3s', marginTop: '8px',
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#444' }}>
          BCS Ratna Award · Aavishkar Media Group
        </p>
      </div>
    </div>
  );
}
