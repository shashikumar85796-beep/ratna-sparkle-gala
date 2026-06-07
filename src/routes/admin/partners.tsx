import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { isAdminLoggedIn } from '@/lib/adminAuth';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase, type Partner } from '@/lib/supabase';
import { AdminModal } from '@/components/admin/AdminModal';
import { AdminImageUpload } from '@/components/admin/AdminImageUpload';
import { AdminFormField, adminInputStyle, adminSelectStyle } from '@/components/admin/AdminFormField';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export const Route = createFileRoute('/admin/partners')({ component: PartnersPage });
const EMPTY = { name: '', tier: 'title' as const, logo_url: '', website_url: '', sort_order: 0, is_active: true, year: 2026 };

export default function PartnersPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'title' | 'associate' | 'other'>('title');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState('');

  useEffect(() => { if (!isAdminLoggedIn()) { navigate({ to: '/admin' }); return; } fetch(); }, []);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data: rows, error } = await supabase.from('partners').select('*').order('tier').order('sort_order');
      if (error) throw error;
      setData(rows ?? []);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  const openAdd = () => { setEditing(null); setForm({ ...EMPTY, tier: activeTab }); setModal(true); };
  const openEdit = (r: Partner) => { setEditing(r); setForm({ name: r.name, tier: r.tier, logo_url: r.logo_url ?? '', website_url: r.website_url ?? '', sort_order: r.sort_order, is_active: r.is_active, year: r.year }); setModal(true); };

  const save = async () => {
    if (!form.name.trim()) { toast.error('Name required'); return; }
    setSaving(true);
    try {
      if (editing) {
        const { error } = await supabase.from('partners').update(form).eq('id', editing.id);
        if (error) throw error;
        toast.success('Partner updated');
      } else {
        const { error } = await supabase.from('partners').insert(form);
        if (error) throw error;
        toast.success('Partner added');
      }
      setModal(false); fetch();
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const del = async () => {
    try {
      const { error } = await supabase.from('partners').delete().eq('id', deleteId);
      if (error) throw error;
      toast.success('Deleted'); fetch();
    } catch { toast.error('Delete failed'); }
    setDeleteId('');
  };

  const upd = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));
  const tabData = data.filter(d => d.tier === activeTab);

  const tabs: { key: 'title' | 'associate' | 'other'; label: string }[] = [
    { key: 'title', label: 'Title Partners' },
    { key: 'associate', label: 'Associate Partners' },
    { key: 'other', label: 'Other Partners' },
  ];

  return (
    <AdminLayout title="Partners & Sponsors">
      <Toaster toastOptions={{ style: { background: '#1A1A1A', color: '#fff', border: '1px solid rgba(201,168,76,0.3)' } }} />

      <div style={{ display: 'flex', gap: '2px', marginBottom: '24px', background: '#111', padding: '4px', borderRadius: '12px', width: 'fit-content' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: "'Raleway', sans-serif", fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', transition: 'all 0.2s', background: activeTab === t.key ? 'linear-gradient(135deg,#BF953F,#C9A84C)' : 'transparent', color: activeTab === t.key ? '#000' : '#666' }}>
            {t.label} ({data.filter(d => d.tier === t.key).length})
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button onClick={openAdd} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#BF953F,#C9A84C)', color: '#000', cursor: 'pointer', fontFamily: "'Raleway', sans-serif", fontSize: '12px', fontWeight: 700 }}>
          <Plus size={14} /> Add Partner
        </button>
      </div>

      {loading ? <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>Loading...</div>
        : tabData.length === 0 ? <div style={{ textAlign: 'center', padding: '60px', color: '#444' }}>No {activeTab} partners yet</div>
          : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {tabData.map(p => (
                <div key={p.id} style={{ background: '#1A1A1A', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                  {p.logo_url
                    ? <img src={p.logo_url} alt={p.name} style={{ maxWidth: '100%', height: '60px', objectFit: 'contain', marginBottom: '10px' }} />
                    : <div style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: '12px', marginBottom: '10px' }}>No Logo</div>
                  }
                  <p style={{ color: '#ccc', fontSize: '13px', fontWeight: 600, margin: '0 0 8px' }}>{p.name}</p>
                  <span style={{ fontSize: '11px', color: p.is_active ? '#22C55E' : '#EF4444' }}>{p.is_active ? 'Active' : 'Hidden'}</span>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '10px' }}>
                    <button onClick={() => openEdit(p)} style={{ background: 'none', border: '1px solid rgba(201,168,76,0.3)', cursor: 'pointer', color: '#C9A84C', padding: '5px 10px', borderRadius: '6px', fontSize: '11px' }}>Edit</button>
                    <button onClick={() => setDeleteId(p.id)} style={{ background: 'none', border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer', color: '#EF4444', padding: '5px 10px', borderRadius: '6px', fontSize: '11px' }}>Del</button>
                  </div>
                </div>
              ))}
            </div>
          )}

      <AdminModal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Partner' : 'Add Partner'} size="md">
        <AdminFormField label="Partner Name" required><input value={form.name} onChange={e => upd('name', e.target.value)} style={adminInputStyle} /></AdminFormField>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <AdminFormField label="Tier">
            <select value={form.tier} onChange={e => upd('tier', e.target.value)} style={adminSelectStyle}>
              <option value="title">Title Partner</option>
              <option value="associate">Associate Partner</option>
              <option value="other">Other Partner</option>
            </select>
          </AdminFormField>
          <AdminFormField label="Year"><input type="number" value={form.year} onChange={e => upd('year', Number(e.target.value))} style={adminInputStyle} /></AdminFormField>
        </div>
        <AdminFormField label="Website URL">
          <input value={form.website_url} onChange={e => upd('website_url', e.target.value)} style={adminInputStyle} placeholder="https://" />
        </AdminFormField>
        <AdminFormField label="Logo" helper="PNG with transparent background recommended, min 300x150px">
          <AdminImageUpload bucket="partners" currentUrl={form.logo_url} onUpload={url => upd('logo_url', url)} label="Upload partner logo" />
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
      <ConfirmDialog isOpen={!!deleteId} title="Delete Partner" message="Remove this partner?" onConfirm={del} onCancel={() => setDeleteId('')} danger confirmLabel="Delete" />
    </AdminLayout>
  );
}
