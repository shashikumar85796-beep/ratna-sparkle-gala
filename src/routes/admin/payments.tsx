import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { isAdminLoggedIn } from '@/lib/adminAuth';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import { StatusBadge } from '@/components/admin/StatusBadge';
import toast, { Toaster } from 'react-hot-toast';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

export const Route = createFileRoute('/admin/payments')({ component: PaymentsPage });

export default function PaymentsPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState<{ id: string; action: string } | null>(null);

  useEffect(() => {
    if (!isAdminLoggedIn()) { navigate({ to: '/admin' }); return; }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: rows, error } = await supabase
        .from('nominations')
        .select('id,nomination_id,full_name,organisation,payment_method,transaction_ref,payment_amount,payment_status,nomination_status,created_at')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setData(rows ?? []);
    } catch (err) { console.error(err); toast.error('Failed to load payments'); }
    finally { setLoading(false); }
  };

  const updatePaymentStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from('nominations').update({ payment_status: status, updated_at: new Date().toISOString() }).eq('id', id);
      if (error) throw error;
      toast.success(`Payment marked as ${status}`);
      fetchData();
    } catch { toast.error('Update failed'); }
    setConfirm(null);
  };

  const total = data.reduce((sum, r) => sum + (r.payment_amount ?? 0), 0);
  const paid = data.filter(r => r.payment_status === 'paid').reduce((sum, r) => sum + (r.payment_amount ?? 0), 0);

  return (
    <AdminLayout title="Payments">
      <Toaster toastOptions={{ style: { background: '#1A1A1A', color: '#fff', border: '1px solid rgba(201,168,76,0.3)' } }} />
      <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
        {[
          { label: 'Total Nominations', value: `₹${total.toLocaleString()}` },
          { label: 'Collected (Paid)', value: `₹${paid.toLocaleString()}`, gold: true },
          { label: 'Pending Collection', value: `₹${(total - paid).toLocaleString()}` },
        ].map(s => (
          <div key={s.label} style={{ background: '#1A1A1A', border: `1px solid ${s.gold ? '#C9A84C' : 'rgba(201,168,76,0.15)'}`, borderRadius: '12px', padding: '16px 24px', flex: 1 }}>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: '11px', color: '#666', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 6px' }}>{s.label}</p>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: '26px', fontWeight: 800, color: s.gold ? '#C9A84C' : '#fff', margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ background: '#1A1A1A', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '800px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(201,168,76,0.15)', background: 'rgba(201,168,76,0.04)' }}>
                {['Nom. ID', 'Name', 'Organisation', 'Method', 'UTR / Ref', 'Amount', 'Pay Status', 'Nom. Status', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 14px', fontFamily: "'Raleway', sans-serif", fontSize: '10px', color: '#666', letterSpacing: '1px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading...</td></tr>
                : data.length === 0 ? <tr><td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: '#444' }}>No payment records</td></tr>
                  : data.map(row => (
                    <tr key={row.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '12px 14px', color: '#C9A84C', fontFamily: 'monospace', fontSize: '11px' }}>{row.nomination_id}</td>
                      <td style={{ padding: '12px 14px', color: '#fff' }}>{row.full_name}</td>
                      <td style={{ padding: '12px 14px', color: '#888' }}>{row.organisation}</td>
                      <td style={{ padding: '12px 14px', color: '#888' }}>{row.payment_method || '—'}</td>
                      <td style={{ padding: '12px 14px', color: '#888', fontFamily: 'monospace', fontSize: '12px' }}>{row.transaction_ref || '—'}</td>
                      <td style={{ padding: '12px 14px', color: '#C9A84C', fontWeight: 700 }}>₹{(row.payment_amount ?? 11800).toLocaleString()}</td>
                      <td style={{ padding: '12px 14px' }}><StatusBadge status={row.payment_status ?? 'pending'} /></td>
                      <td style={{ padding: '12px 14px' }}><StatusBadge status={row.nomination_status ?? 'pending'} /></td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => setConfirm({ id: row.id, action: 'paid' })}
                            style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #22C55E', background: 'transparent', color: '#22C55E', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}>
                            Mark Paid
                          </button>
                          <button onClick={() => setConfirm({ id: row.id, action: 'disputed' })}
                            style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #EF4444', background: 'transparent', color: '#EF4444', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}>
                            Dispute
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!confirm}
        title="Update Payment Status"
        message={`Mark payment as "${confirm?.action}"?`}
        onConfirm={() => confirm && updatePaymentStatus(confirm.id, confirm.action)}
        onCancel={() => setConfirm(null)}
      />
    </AdminLayout>
  );
}
