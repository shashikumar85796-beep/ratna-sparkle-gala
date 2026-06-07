import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { isAdminLoggedIn } from '@/lib/adminAuth';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import toast, { Toaster } from 'react-hot-toast';
import { Download } from 'lucide-react';

export const Route = createFileRoute('/admin/export')({ component: ExportPage });

const dateStr = () => new Date().toISOString().slice(0, 10).replace(/-/g, '');

function downloadCSV(data: any[], filename: string) {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export default function ExportPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string>('');

  useEffect(() => { if (!isAdminLoggedIn()) { navigate({ to: '/admin' }); return; } }, []);

  const exportAll = async () => {
    setLoading('all');
    try {
      const { data, error } = await supabase.from('nominations').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      downloadCSV(data ?? [], `BCSRatna2026_All_Nominations_${dateStr()}.csv`);
      toast.success('Downloaded All Nominations CSV');
    } catch { toast.error('Export failed'); }
    finally { setLoading(''); }
  };

  const exportVerified = async () => {
    setLoading('verified');
    try {
      const { data, error } = await supabase.from('nominations').select('*').eq('nomination_status', 'verified').order('created_at', { ascending: false });
      if (error) throw error;
      downloadCSV(data ?? [], `BCSRatna2026_Verified_${dateStr()}.csv`);
      toast.success('Downloaded Verified Nominations CSV');
    } catch { toast.error('Export failed'); }
    finally { setLoading(''); }
  };

  const exportPayments = async () => {
    setLoading('payments');
    try {
      const { data, error } = await supabase.from('nominations').select('nomination_id,full_name,organisation,mobile,email,category,payment_method,transaction_ref,payment_amount,payment_status,created_at').order('created_at', { ascending: false });
      if (error) throw error;
      downloadCSV(data ?? [], `BCSRatna2026_Payments_${dateStr()}.csv`);
      toast.success('Downloaded Payments CSV');
    } catch { toast.error('Export failed'); }
    finally { setLoading(''); }
  };

  const exportXLSX = async () => {
    setLoading('xlsx');
    try {
      const [allRes, verRes, payRes] = await Promise.all([
        supabase.from('nominations').select('*').order('created_at', { ascending: false }),
        supabase.from('nominations').select('*').eq('nomination_status', 'verified'),
        supabase.from('nominations').select('nomination_id,full_name,organisation,payment_method,transaction_ref,payment_amount,payment_status,created_at'),
      ]);
      if (allRes.error) throw allRes.error;

      const allData = allRes.data ?? [];
      const catCounts: Record<string, number> = {};
      allData.forEach((r: any) => { catCounts[r.category] = (catCounts[r.category] ?? 0) + 1; });

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(allData), 'All Nominations');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(verRes.data ?? []), 'Verified Only');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(payRes.data ?? []), 'Payments Summary');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(Object.entries(catCounts).map(([category, count]) => ({ category, count }))), 'Category Wise');
      XLSX.writeFile(wb, `BCSRatna2026_Complete_${dateStr()}.xlsx`);
      toast.success('Downloaded Excel file');
    } catch { toast.error('Excel export failed'); }
    finally { setLoading(''); }
  };

  const cards = [
    { key: 'all', title: 'All Nominations CSV', desc: 'Every nomination with all fields', icon: '📋', action: exportAll, color: '#C9A84C' },
    { key: 'verified', title: 'Verified Only CSV', desc: 'Only verified nominations', icon: '✅', action: exportVerified, color: '#22C55E' },
    { key: 'payments', title: 'Payments CSV', desc: 'Payment details only', icon: '💰', action: exportPayments, color: '#3B82F6' },
    { key: 'xlsx', title: 'Complete Excel (XLSX)', desc: '4 sheets: All, Verified, Payments, Category-wise', icon: '📊', action: exportXLSX, color: '#8B5CF6' },
  ];

  return (
    <AdminLayout title="Export Data">
      <Toaster toastOptions={{ style: { background: '#1A1A1A', color: '#fff', border: '1px solid rgba(201,168,76,0.3)' } }} />
      <p style={{ color: '#666', fontSize: '13px', marginBottom: '28px' }}>
        Download nomination data for records, analysis, or certificate printing.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {cards.map(c => (
          <div key={c.key} style={{ background: '#1A1A1A', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '16px', padding: '28px' }}>
            <p style={{ fontSize: '36px', marginBottom: '12px' }}>{c.icon}</p>
            <h3 style={{ fontFamily: "'Raleway', sans-serif", fontSize: '15px', color: '#fff', margin: '0 0 6px', fontWeight: 700 }}>{c.title}</h3>
            <p style={{ color: '#666', fontSize: '13px', margin: '0 0 20px' }}>{c.desc}</p>
            <button
              onClick={c.action}
              disabled={loading === c.key}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '11px 20px', borderRadius: '10px', border: 'none',
                background: loading === c.key ? '#333' : c.color,
                color: '#000', cursor: loading === c.key ? 'not-allowed' : 'pointer',
                fontFamily: "'Raleway', sans-serif", fontSize: '12px',
                fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase',
              }}
            >
              <Download size={14} />
              {loading === c.key ? 'Exporting...' : 'Download'}
            </button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
