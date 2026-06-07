import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState, useCallback } from 'react';
import { isAdminLoggedIn } from '@/lib/adminAuth';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase, type Nomination } from '@/lib/supabase';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Search, Eye } from 'lucide-react';
import { CATEGORIES } from '@/lib/categories';

export const Route = createFileRoute('/admin/nominations')({ component: NominationsPage });

const inputStyle: React.CSSProperties = {
  padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(201,168,76,0.2)',
  background: '#1A1A1A', color: '#fff', fontFamily: "'Open Sans', sans-serif", fontSize: '13px',
  outline: 'none',
};

export default function NominationsPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<Nomination[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!isAdminLoggedIn()) { navigate({ to: '/admin' }); return; }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase.from('nominations').select('*', { count: 'exact' }).order('created_at', { ascending: false });
      if (search) query = query.ilike('full_name', `%${search}%`);
      if (category) query = query.eq('category', category);
      if (status) query = query.eq('nomination_status', status);
      const { data: rows, error, count } = await query;
      if (error) throw error;
      setData(rows ?? []);
      setTotal(count ?? 0);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [search, category, status]);

  useEffect(() => {
    const id = setTimeout(fetchData, 400);
    return () => clearTimeout(id);
  }, [fetchData]);

  return (
    <AdminLayout title="All Nominations">
      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name..." style={{ ...inputStyle, paddingLeft: '34px', width: '100%', boxSizing: 'border-box' }} />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...inputStyle, minWidth: '160px' }}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
        <select value={status} onChange={e => setStatus(e.target.value)} style={{ ...inputStyle, minWidth: '140px' }}>
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
        </select>
        <div style={{ padding: '10px 16px', background: 'rgba(201,168,76,0.1)', borderRadius: '8px', border: '1px solid rgba(201,168,76,0.2)', fontFamily: "'Raleway', sans-serif", fontSize: '12px', color: '#C9A84C', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
          {total} total
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#1A1A1A', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '900px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(201,168,76,0.15)', background: 'rgba(201,168,76,0.04)' }}>
                {['Nom. ID', 'Name', 'Organisation', 'Category', 'Mobile', 'Email', 'Payment', 'Date', 'Status', ''].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 14px', fontFamily: "'Raleway', sans-serif", fontSize: '10px', color: '#666', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 700, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}><td colSpan={10} style={{ padding: '14px' }}>
                  <div style={{ height: '14px', background: '#252525', borderRadius: '4px', width: `${60 + (i % 4) * 10}%` }} />
                </td></tr>
              )) : data.length === 0 ? (
                <tr><td colSpan={10} style={{ textAlign: 'center', color: '#444', padding: '48px', fontSize: '14px' }}>No nominations found</td></tr>
              ) : data.map(row => (
                <tr key={row.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,168,76,0.03)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '13px 14px', color: '#C9A84C', fontFamily: 'monospace', fontSize: '11px', whiteSpace: 'nowrap' }}>{row.nomination_id}</td>
                  <td style={{ padding: '13px 14px', color: '#fff', whiteSpace: 'nowrap' }}>{row.full_name}</td>
                  <td style={{ padding: '13px 14px', color: '#888', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.organisation}</td>
                  <td style={{ padding: '13px 14px', color: '#888', whiteSpace: 'nowrap' }}>{row.category}</td>
                  <td style={{ padding: '13px 14px', color: '#888' }}>{row.mobile}</td>
                  <td style={{ padding: '13px 14px', color: '#888', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.email}</td>
                  <td style={{ padding: '13px 14px' }}><StatusBadge status={row.payment_status ?? 'pending'} /></td>
                  <td style={{ padding: '13px 14px', color: '#666', whiteSpace: 'nowrap' }}>{new Date(row.created_at).toLocaleDateString('en-IN')}</td>
                  <td style={{ padding: '13px 14px' }}><StatusBadge status={row.nomination_status ?? 'pending'} /></td>
                  <td style={{ padding: '13px 14px' }}>
                    <Link to="/admin/nominations/$id" params={{ id: row.id }}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C', textDecoration: 'none', fontFamily: "'Raleway', sans-serif", fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                      <Eye size={12} /> View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
