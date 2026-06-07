import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { isAdminLoggedIn } from '@/lib/adminAuth';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import { AdminModal } from '@/components/admin/AdminModal';
import { AdminImageUpload } from '@/components/admin/AdminImageUpload';
import { AdminFormField, adminInputStyle, adminTextareaStyle } from '@/components/admin/AdminFormField';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export const Route = createFileRoute('/admin/gallery')({ component: GalleryPage });

type Photo = { id: string; title?: string; caption?: string; image_url?: string; sort_order: number; is_active: boolean; year?: number; created_at: string; };
const EMPTY = { title: '', caption: '', image_url: '', sort_order: 0, is_active: true, year: undefined as number | undefined };

export default function GalleryPage() {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Photo | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState('');

  useEffect(() => { if (!isAdminLoggedIn()) { navigate({ to: '/admin' }); return; } fetch(); }, []);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('gallery_images').select('*').eq('section', 'ceremony_glimpses').order('sort_order');
      if (error) throw error;
      setPhotos(data ?? []);
    } catch { toast.error('Failed to load gallery'); }
    finally { setLoading(false); }
  };

  const openAdd = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (p: Photo) => { setEditing(p); setForm({ title: p.title ?? '', caption: p.caption ?? '', image_url: p.image_url ?? '', sort_order: p.sort_order, is_active: p.is_active, year: p.year }); setModal(true); };

  const save = async () => {
    if (!form.image_url) { toast.error('Please upload an image'); return; }
    setSaving(true);
    try {
      const payload = { ...form, section: 'ceremony_glimpses' };
      if (editing) {
        const { error } = await supabase.from('gallery_images').update(payload).eq('id', editing.id);
        if (error) throw error;
        toast.success('Photo updated');
      } else {
        const { error } = await supabase.from('gallery_images').insert(payload);
        if (error) throw error;
        toast.success('Photo added');
      }
      setModal(false);
      fetch();
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const del = async () => {
    try {
      const { error } = await supabase.from('gallery_images').delete().eq('id', deleteId);
      if (error) throw error;
      toast.success('Photo deleted');
      fetch();
    } catch { toast.error('Delete failed'); }
    setDeleteId('');
  };

  const btnGold: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#BF953F,#C9A84C)', color: '#000', cursor: 'pointer', fontFamily: "'Raleway', sans-serif", fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' };

  return (
    <AdminLayout title="Gallery — Ceremony Glimpses">
      <Toaster toastOptions={{ style: { background: '#1A1A1A', color: '#fff', border: '1px solid rgba(201,168,76,0.3)' } }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>{photos.length} photos in gallery</p>
        <button onClick={openAdd} style={btnGold}><Plus size={14} /> Add Photo</button>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ height: '180px', background: '#1A1A1A', borderRadius: '12px', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      ) : photos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px', color: '#444' }}>
          <p style={{ fontSize: '40px', marginBottom: '12px' }}>🖼</p>
          <p>No photos yet. Add your first photo.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {photos.map(p => (
            <div key={p.id} style={{ background: '#1A1A1A', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '12px', overflow: 'hidden' }}>
              <img src={p.image_url} alt={p.caption} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
              <div style={{ padding: '12px' }}>
                <p style={{ color: '#ccc', fontSize: '13px', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.caption || p.title || 'Untitled'}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                  <span style={{ fontSize: '11px', color: p.is_active ? '#22C55E' : '#EF4444' }}>{p.is_active ? 'Active' : 'Hidden'}</span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => openEdit(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C9A84C', padding: '4px' }}><Pencil size={14} /></button>
                    <button onClick={() => setDeleteId(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', padding: '4px' }}><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Photo' : 'Add Photo'}>
        <AdminFormField label="Photo" required>
          <AdminImageUpload bucket="gallery" folder="glimpses/" currentUrl={form.image_url} onUpload={url => setForm(f => ({ ...f, image_url: url }))} label="Drop photo here or click to browse" />
        </AdminFormField>
        <AdminFormField label="Title">
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={adminInputStyle} placeholder="Photo title" />
        </AdminFormField>
        <AdminFormField label="Caption">
          <input value={form.caption} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))} style={adminInputStyle} placeholder="Caption shown below photo" />
        </AdminFormField>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <AdminFormField label="Year (optional)">
            <input type="number" value={form.year ?? ''} onChange={e => setForm(f => ({ ...f, year: e.target.value ? Number(e.target.value) : undefined }))} style={adminInputStyle} placeholder="2024" />
          </AdminFormField>
          <AdminFormField label="Sort Order">
            <input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))} style={adminInputStyle} />
          </AdminFormField>
        </div>
        <AdminFormField label="Active">
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
            <span style={{ color: '#ccc', fontSize: '14px' }}>Visible on website</span>
          </label>
        </AdminFormField>
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <button onClick={() => setModal(false)} style={{ flex: 1, padding: '11px', borderRadius: '8px', border: '1px solid #333', background: 'transparent', color: '#fff', cursor: 'pointer' }}>Cancel</button>
          <button onClick={save} disabled={saving} style={{ flex: 1, padding: '11px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg,#BF953F,#C9A84C)', color: '#000', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 700, fontFamily: "'Raleway', sans-serif", fontSize: '13px' }}>
            {saving ? 'Saving...' : 'Save Photo'}
          </button>
        </div>
      </AdminModal>

      <ConfirmDialog isOpen={!!deleteId} title="Delete Photo" message="This will permanently delete the photo. Cannot be undone." onConfirm={del} onCancel={() => setDeleteId('')} danger confirmLabel="Delete" />
    </AdminLayout>
  );
}
