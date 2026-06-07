import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { isAdminLoggedIn } from '@/lib/adminAuth';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase, type Testimonial } from '@/lib/supabase';
import { AdminModal } from '@/components/admin/AdminModal';
import { AdminImageUpload } from '@/components/admin/AdminImageUpload';
import { AdminFormField, adminInputStyle } from '@/components/admin/AdminFormField';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';

export const Route = createFileRoute('/admin/testimonials')({ component: TestimonialsPage });
const EMPTY = { name: '', designation: '', organisation: '', quote: '', photo_url: '', rating: 5, sort_order: 0, is_active: true };

export default function TestimonialsPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState('');

  useEffect(() => { if (!isAdminLoggedIn()) { navigate({ to: '/admin' }); return; } fetch(); }, []);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data: rows, error } = await supabase.from('testimonials').select('*').order('sort_order');
      if (error) throw error;
      setData(rows ?? []);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  const openAdd = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (r: Testimonial) => { setEditing(r); setForm({ name: r.name, designation: r.designation, organisation: r.organisation, quote: r.quote, photo_url: r.photo_url ?? '', rating: r.rating, sort_order: r.sort_order, is_active: r.is_active }); setModal(true); };

  const save = async () => {
    if (!form.name.trim() || !form.quote.trim()) { toast.error('Name and quote are required'); return; }
    setSaving(true);
    try {
      if (editing) {
        const { error } = await supabase.from('testimonials').update(form).eq('id', editing.id);
        if (error) throw error;
        toast.success('Updated');
      } else {
        const { error } = await supabase.from('testimonials').insert(form);
        if (error) throw error;
        toast.success('Added');
      }
      setModal(false); fetch();
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const del = async () => {
    try {
      await supabase.from('testimonials').delete().eq('id', deleteId);
      toast.success('Deleted'); fetch();
    } catch { toast.error('Delete failed'); }
    setDeleteId('');
  };

  const upd = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  return (
    <AdminLayout title="Testimonials">
      <Toaster toastOptions={{ style: { background: '#1A1A1A', color: '#fff', border: '1px solid rgba(201,168,76,0.3)' } }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>{data.length} testimonials</p>
        <button onClick={openAdd} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#BF953F,#C9A84C)', color: '#000', cursor: 'pointer', fontFamily: "'Raleway', sans-serif", fontSize: '12px', fontWeight: 700 }}>
          <Plus size={14} /> Add Testimonial
        </button>
      </div>

      <div style={{ background: '#1A1A1A', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '16px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead><tr style={{ background: 'rgba(201,168,76,0.04)', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
            {['Photo', 'Name', 'Designation', 'Quote Preview', 'Rating', 'Active', 'Actions'].map(h => (
              <th key={h} style={{ textAlign: 'left', padding: '12px 14px', fontFamily: "'Raleway', sans-serif", fontSize: '10px', color: '#666', letterSpacing: '1px', textTransform: 'uppercase' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading...</td></tr>
              : data.length === 0 ? <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#444' }}>No testimonials yet</td></tr>
                : data.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '12px 14px' }}>
                      {r.photo_url ? <img src={r.photo_url} alt={r.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%' }} />
                        : <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C9A84C', fontSize: '14px', fontWeight: 700 }}>{r.name[0]}</div>}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#fff', fontWeight: 600 }}>{r.name}</td>
                    <td style={{ padding: '12px 14px', color: '#888' }}>{r.designation}<br /><span style={{ fontSize: '11px' }}>{r.organisation}</span></td>
                    <td style={{ padding: '12px 14px', color: '#888', maxWidth: '220px' }}><span style={{ fontSize: '12px', fontStyle: 'italic' }}>"{r.quote.substring(0, 60)}..."</span></td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {Array.from({ length: 5 }, (_, i) => <Star key={i} size={12} fill={i < r.rating ? '#C9A84C' : 'none'} stroke="#C9A84C" />)}
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px' }}><span style={{ color: r.is_active ? '#22C55E' : '#EF4444', fontSize: '12px', fontWeight: 700 }}>{r.is_active ? 'Yes' : 'No'}</span></td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => openEdit(r)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C9A84C', padding: '4px' }}><Pencil size={14} /></button>
                        <button onClick={() => setDeleteId(r.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', padding: '4px' }}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      <AdminModal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Testimonial' : 'Add Testimonial'} size="md">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <AdminFormField label="Name" required><input value={form.name} onChange={e => upd('name', e.target.value)} style={adminInputStyle} /></AdminFormField>
          <AdminFormField label="Designation" required><input value={form.designation} onChange={e => upd('designation', e.target.value)} style={adminInputStyle} /></AdminFormField>
          <AdminFormField label="Organisation" required><input value={form.organisation} onChange={e => upd('organisation', e.target.value)} style={adminInputStyle} /></AdminFormField>
          <AdminFormField label="Sort Order"><input type="number" value={form.sort_order} onChange={e => upd('sort_order', Number(e.target.value))} style={adminInputStyle} /></AdminFormField>
        </div>
        <AdminFormField label={`Quote (${form.quote.length}/300)`} required>
          <textarea value={form.quote} onChange={e => upd('quote', e.target.value.slice(0, 300))} rows={4} style={{ ...adminInputStyle, resize: 'vertical', minHeight: '80px', fontFamily: "'Open Sans', sans-serif" } as any} />
        </AdminFormField>
        <AdminFormField label="Rating">
          <div style={{ display: 'flex', gap: '6px' }}>
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} onClick={() => upd('rating', n)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                <Star size={20} fill={n <= form.rating ? '#C9A84C' : 'none'} stroke="#C9A84C" />
              </button>
            ))}
          </div>
        </AdminFormField>
        <AdminFormField label="Photo">
          <AdminImageUpload bucket="testimonials" currentUrl={form.photo_url} onUpload={url => upd('photo_url', url)} label="Upload person photo (optional)" />
        </AdminFormField>
        <AdminFormField label="Active">
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.is_active} onChange={e => upd('is_active', e.target.checked)} />
            <span style={{ color: '#ccc', fontSize: '14px' }}>Visible on homepage</span>
          </label>
        </AdminFormField>
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <button onClick={() => setModal(false)} style={{ flex: 1, padding: '11px', borderRadius: '8px', border: '1px solid #333', background: 'transparent', color: '#fff', cursor: 'pointer' }}>Cancel</button>
          <button onClick={save} disabled={saving} style={{ flex: 1, padding: '11px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg,#BF953F,#C9A84C)', color: '#000', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 700, fontFamily: "'Raleway', sans-serif", fontSize: '13px' }}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </AdminModal>
      <ConfirmDialog isOpen={!!deleteId} title="Delete Testimonial" message="Remove this testimonial?" onConfirm={del} onCancel={() => setDeleteId('')} danger confirmLabel="Delete" />
    </AdminLayout>
  );
}
