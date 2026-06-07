import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { isAdminLoggedIn } from '@/lib/adminAuth';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Link } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/dashboard')({ component: DashboardPage });

function useAnimatedCount(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

const GOLD_COLORS = ['#C9A84C', '#F5D78A', '#8B6914', '#E8C56A', '#9A7A2E'];

function StatCard({ label, value, icon, sub }: { label: string; value: number; icon: string; sub?: string }) {
  const count = useAnimatedCount(value);
  return (
    <div style={{
      background: '#1A1A1A', border: '1px solid rgba(201,168,76,0.15)',
      borderRadius: '16px', padding: '24px', flex: 1,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: '11px', color: '#666', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>{label}</p>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: '36px', fontWeight: 800, color: '#C9A84C', margin: 0, lineHeight: 1 }}>{count.toLocaleString()}</p>
          {sub && <p style={{ fontSize: '12px', color: '#555', marginTop: '6px' }}>{sub}</p>}
        </div>
        <span style={{ fontSize: '32px' }}>{icon}</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, verified: 0, pending: 0, rejected: 0 });
  const [catData, setCatData] = useState<any[]>([]);
  const [payData, setPayData] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdminLoggedIn()) { navigate({ to: '/admin' }); return; }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [totRes, verRes, penRes, rejRes, catRes, payRes, recRes] = await Promise.all([
        supabase.from('nominations').select('id', { count: 'exact', head: true }),
        supabase.from('nominations').select('id', { count: 'exact', head: true }).eq('nomination_status', 'verified'),
        supabase.from('nominations').select('id', { count: 'exact', head: true }).eq('nomination_status', 'pending'),
        supabase.from('nominations').select('id', { count: 'exact', head: true }).eq('nomination_status', 'rejected'),
        supabase.from('nominations').select('category'),
        supabase.from('nominations').select('payment_status'),
        supabase.from('nominations').select('nomination_id,full_name,category,nomination_status,created_at').order('created_at', { ascending: false }).limit(10),
      ]);
      setStats({ total: totRes.count ?? 0, verified: verRes.count ?? 0, pending: penRes.count ?? 0, rejected: rejRes.count ?? 0 });

      const catCounts: Record<string, number> = {};
      (catRes.data ?? []).forEach((r: any) => { catCounts[r.category] = (catCounts[r.category] ?? 0) + 1; });
      setCatData(Object.entries(catCounts).map(([name, value]) => ({ name: name.substring(0, 12), value })));

      const payCounts: Record<string, number> = {};
      (payRes.data ?? []).forEach((r: any) => { payCounts[r.payment_status] = (payCounts[r.payment_status] ?? 0) + 1; });
      setPayData(Object.entries(payCounts).map(([name, value]) => ({ name, value })));

      setRecent(recRes.data ?? []);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Dashboard">
      {/* Stats Row */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <StatCard label="Total Nominations" value={stats.total} icon="📋" />
        <StatCard label="Verified" value={stats.verified} icon="✅" sub={`₹${(stats.verified * 11800).toLocaleString()} revenue`} />
        <StatCard label="Pending Review" value={stats.pending} icon="⏳" />
        <StatCard label="Rejected" value={stats.rejected} icon="❌" />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
        <div style={{ background: '#1A1A1A', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ fontFamily: "'Raleway', sans-serif", fontSize: '14px', color: '#C9A84C', marginBottom: '20px', fontWeight: 700 }}>Nominations by Category</h3>
          {catData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={catData}>
                <XAxis dataKey="name" tick={{ fill: '#666', fontSize: 11 }} />
                <YAxis tick={{ fill: '#666', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#1A1A1A', border: '1px solid #C9A84C', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="value" fill="#C9A84C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: '#444', fontSize: '13px', textAlign: 'center', padding: '40px 0' }}>No data yet</p>
          )}
        </div>

        <div style={{ background: '#1A1A1A', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ fontFamily: "'Raleway', sans-serif", fontSize: '14px', color: '#C9A84C', marginBottom: '20px', fontWeight: 700 }}>Payment Status</h3>
          {payData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={payData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, value }: any) => `${name}: ${value}`}>
                  {payData.map((_, i) => <Cell key={i} fill={GOLD_COLORS[i % GOLD_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1A1A1A', border: '1px solid #C9A84C', borderRadius: '8px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: '#444', fontSize: '13px', textAlign: 'center', padding: '40px 0' }}>No data yet</p>
          )}
        </div>
      </div>

      {/* Recent Nominations */}
      <div style={{ background: '#1A1A1A', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '16px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontFamily: "'Raleway', sans-serif", fontSize: '14px', color: '#C9A84C', margin: 0, fontWeight: 700 }}>Recent Nominations</h3>
          <Link to="/admin/nominations" style={{ fontSize: '12px', color: '#C9A84C', textDecoration: 'none', fontFamily: "'Raleway', sans-serif", fontWeight: 600 }}>
            View All →
          </Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
                {['ID', 'Name', 'Category', 'Date', 'Status'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontFamily: "'Raleway', sans-serif", fontSize: '11px', color: '#666', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan={5} style={{ padding: '14px 12px' }}>
                    <div style={{ height: '16px', background: '#252525', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
                  </td></tr>
                ))
              ) : recent.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: '#444', padding: '32px', fontSize: '13px' }}>No nominations yet</td></tr>
              ) : recent.map(r => (
                <tr key={r.nomination_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,168,76,0.03)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '14px 12px', color: '#C9A84C', fontFamily: 'monospace', fontSize: '12px' }}>{r.nomination_id}</td>
                  <td style={{ padding: '14px 12px', color: '#fff' }}>{r.full_name}</td>
                  <td style={{ padding: '14px 12px', color: '#888' }}>{r.category}</td>
                  <td style={{ padding: '14px 12px', color: '#666' }}>{new Date(r.created_at).toLocaleDateString('en-IN')}</td>
                  <td style={{ padding: '14px 12px' }}><StatusBadge status={r.nomination_status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
