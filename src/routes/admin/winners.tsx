import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { isAdminLoggedIn } from '@/lib/adminAuth';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase, type Winner } from '@/lib/supabase';
import { AdminModal } from '@/components/admin/AdminModal';
import { AdminImageUpload } from '@/components/admin/AdminImageUpload';
import { AdminFormField, adminInputStyle, adminSelectStyle, adminTextareaStyle } from '@/components/admin/AdminFormField';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { CATEGORIES } from '@/lib/categories';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export const Route = createFileRoute('/admin/winners')({ component: WinnersPage });
const EMPTY = { name: '', designation: '', organisation: '', award_name: '', category: '', sub_category: '', year: 2024, photo_url: '', bio: '', sort_order: 0, is_featured: false, is_active: true };

export default function WinnersPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Winner | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterCat, setFilterCat] = useState('');

  useEffect(() => { if (!isAdminLoggedIn()) { navigate({ to: '/admin' }); return; } fetch(); }, []);

  const fetch = async () => {
    setLoading(true);
    try {
      let q = supabase.from('winners').select('*').order('year', { ascending: false }).order('sort_order');
      if (filterYear) q = q.eq('year', Number(filterYear));
      if (filterCat) q = q.eq('category', filterCat);
      const { data: rows, error } = await q;
      if (error) throw error;
      setData(rows ?? []);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [filterYear, filterCat]);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (r: Winner) => { setEditing(r); setForm({ name: r.name, designation: r.designation ?? '', organisation: r.organisation ?? '', award_name: r.award_name, category: r.category, sub_category: r.sub_category ?? '', year: r.year, photo_url: r.photo_url ?? '', bio: r.bio ?? '', sort_order: r.sort_order, is_featured: r.is_featured, is_active: r.is_active }); setModal(true); };

  const save = async () => {
    if (!form.name.trim() || !form.award_name.trim()) { toast.error('Name and award are required'); return; }
    setSaving(true);
    try {
      if (editing) {
        const { error } = await supabase.from('winners').update(form).eq('id', editing.id);
        if (error) throw error;
        toast.success('Winner updated');
      } else {
        const { error } = await supabase.from('winners').insert(form);
        if (error) throw error;
        toast.success('Winner added');
      }
      setModal(false); fetch();
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const del = async () => {
    try {
      await supabase.from('winners').delete().eq('id', deleteId);
      toast.success('Deleted'); fetch();
    } catch { toast.error('Delete failed'); }
    setDeleteId('');
  };

  const upd = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));
  const inpStyle: React.CSSProperties = { ...adminInputStyle };

  return (
    <AdminLayout title="Winners — Hall of Fame">
      <Toaster toastOptions={{ style: { background: '#1A1A1A', color: '#fff', border: '1px solid rgba(201,168,76,0.3)' } }} />

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={filterYear} onChange={e => setFilterYear(e.target.value)} style={{ ...inpStyle, width: 'auto', minWidth: '120px' }}>
          <option value="">All Years</option>
          {Array.from({ length: 15 }, (_, i) => 2024 - i).map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ ...inpStyle, width: 'auto', minWidth: '160px' }}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
        <div style={{ flex: 1 }} />
        <button onClick={openAdd} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#BF953F,#C9A84C)', color: '#000', cursor: 'pointer', fontFamily: "'Raleway', sans-serif", fontSize: '12px', fontWeight: 700 }}>
          <Plus size={14} /> Add Winner
        </button>
      </div>

      <div style={{ background: '#1A1A1A', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '800px' }}>
            <thead><tr style={{ background: 'rgba(201,168,76,0.04)', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
              {['Photo', 'Name', 'Award', 'Category', 'Year', 'Featured', 'Active', 'Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '12px 14px', fontFamily: "'Raleway', sans-serif", fontSize: '10px', color: '#666', letterSpacing: '1px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading...</td></tr>
                : data.length === 0 ? <tr><td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#444' }}>No winners yet</td></tr>
                  : data.map(r => (
                    <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '12px 14px' }}>
                        {r.photo_url ? <img src={r.photo_url} alt={r.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%' }} />
                          : <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C9A84C', fontWeight: 700 }}>{r.name[0]}</div>}
                      </td>
                      <td style={{ padding: '12px 14px', color: '#fff', fontWeight: 600 }}>{r.name}<br /><span style={{ color: '#666', fontSize: '11px', fontWeight: 400 }}>{r.organisation}</span></td>
                      <td style={{ padding: '12px 14px', color: '#C9A84C', fontSize: '12px' }}>{r.award_name}</td>
                      <td style={{ padding: '12px 14px', color: '#888', fontSize: '12px' }}>{r.category}</td>
                      <td style={{ padding: '12px 14px', color: '#C9A84C', fontWeight: 700 }}>{r.year}</td>
                      <td style={{ padding: '12px 14px' }}><span style={{ color: r.is_featured ? '#C9A84C' : '#555', fontSize: '16px' }}>{r.is_featured ? '⭐' : '—'}</span></td>
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
      </div>

      <AdminModal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Winner' : 'Add Winner'} size="lg">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <AdminFormField label="Name" required><input value={form.name} onChange={e => upd('name', e.target.value)} style={inpStyle} /></AdminFormField>
          <AdminFormField label="Award Name" required><input value={form.award_name} onChange={e => upd('award_name', e.target.value)} style={inpStyle} /></AdminFormField>
          <AdminFormField label="Designation"><input value={form.designation} onChange={e => upd('designation', e.target.value)} style={inpStyle} /></AdminFormField>
          <AdminFormField label="Organisation"><input value={form.organisation} onChange={e => upd('organisation', e.target.value)} style={inpStyle} /></AdminFormField>
          <AdminFormField label="Category">
            <select value={form.category} onChange={e => upd('category', e.target.value)} style={adminSelectStyle}>
              <option value="">Select category</option>
              {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </AdminFormField>
          <AdminFormField label="Sub-Category"><input value={form.sub_category} onChange={e => upd('sub_category', e.target.value)} style={inpStyle} /></AdminFormField>
          <AdminFormField label="Year">
            <select value={form.year} onChange={e => upd('year', Number(e.target.value))} style={adminSelectStyle}>
              {Array.from({ length: 15 }, (_, i) => 2024 - i).map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </AdminFormField>
          <AdminFormField label="Sort Order"><input type="number" value={form.sort_order} onChange={e => upd('sort_order', Number(e.target.value))} style={inpStyle} /></AdminFormField>
        </div>
        <AdminFormField label="Bio (500 chars)">
          <textarea value={form.bio} onChange={e => upd('bio', e.target.value.slice(0, 500))} rows={3} style={{ ...adminInputStyle, resize: 'vertical', fontFamily: "'Open Sans', sans-serif" } as any} />
        </AdminFormField>
        <AdminFormField label="Photo">
          <AdminImageUpload bucket="winners" currentUrl={form.photo_url} onUpload={url => upd('photo_url', url)} />
        </AdminFormField>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#ccc', fontSize: '14px' }}>
            <input type="checkbox" checked={form.is_featured} onChange={e => upd('is_featured', e.target.checked)} />
            ⭐ Featured (spotlight section)
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#ccc', fontSize: '14px' }}>
            <input type="checkbox" checked={form.is_active} onChange={e => upd('is_active', e.target.checked)} />
            Active
          </label>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setModal(false)} style={{ flex: 1, padding: '11px', borderRadius: '8px', border: '1px solid #333', background: 'transparent', color: '#fff', cursor: 'pointer' }}>Cancel</button>
          <button onClick={save} disabled={saving} style={{ flex: 1, padding: '11px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg,#BF953F,#C9A84C)', color: '#000', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 700, fontFamily: "'Raleway', sans-serif", fontSize: '13px' }}>
            {saving ? 'Saving...' : 'Save Winner'}
          </button>
        </div>
      </AdminModal>

      <ConfirmDialog isOpen={!!deleteId} title="Delete Winner" message="Remove from Hall of Fame?" onConfirm={del} onCancel={() => setDeleteId('')} danger confirmLabel="Delete" />
    </AdminLayout>
  );
}
