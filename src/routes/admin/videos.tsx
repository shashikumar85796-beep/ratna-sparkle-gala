import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { isAdminLoggedIn } from '@/lib/adminAuth';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import { AdminModal } from '@/components/admin/AdminModal';
import { AdminFormField, adminInputStyle } from '@/components/admin/AdminFormField';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { getYouTubeId } from '@/lib/uploadFile';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, Pencil, Trash2, Play } from 'lucide-react';

export const Route = createFileRoute('/admin/videos')({ component: VideosPage });
const EMPTY = { title: '', video_url: '', video_thumbnail: '', sort_order: 0, is_active: true };

export default function VideosPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [autoThumb, setAutoThumb] = useState('');

  useEffect(() => { if (!isAdminLoggedIn()) { navigate({ to: '/admin' }); return; } fetch(); }, []);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data: rows, error } = await supabase.from('gallery_images').select('*').eq('section', 'video_gallery').order('sort_order');
      if (error) throw error;
      setData(rows ?? []);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  const openAdd = () => { setEditing(null); setForm(EMPTY); setAutoThumb(''); setModal(true); };
  const openEdit = (r: any) => { setEditing(r); setForm({ title: r.title ?? '', video_url: r.video_url ?? '', video_thumbnail: r.video_thumbnail ?? '', sort_order: r.sort_order, is_active: r.is_active }); const id = getYouTubeId(r.video_url ?? ''); setAutoThumb(id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : ''); setModal(true); };

  const handleUrlChange = (url: string) => {
    setForm(f => ({ ...f, video_url: url }));
    const id = getYouTubeId(url);
    setAutoThumb(id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : '');
  };

  const save = async () => {
    if (!form.title.trim() || !form.video_url.trim()) { toast.error('Title and URL required'); return; }
    if (!getYouTubeId(form.video_url)) { toast.error('Invalid YouTube URL'); return; }
    setSaving(true);
    try {
      const payload = { ...form, section: 'video_gallery', video_thumbnail: form.video_thumbnail || autoThumb };
      if (editing) {
        const { error } = await supabase.from('gallery_images').update(payload).eq('id', editing.id);
        if (error) throw error;
        toast.success('Video updated');
      } else {
        const { error } = await supabase.from('gallery_images').insert(payload);
        if (error) throw error;
        toast.success('Video added');
      }
      setModal(false); fetch();
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const del = async () => {
    try {
      await supabase.from('gallery_images').delete().eq('id', deleteId);
      toast.success('Deleted'); fetch();
    } catch { toast.error('Delete failed'); }
    setDeleteId('');
  };

  const upd = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));
  const thumbSrc = form.video_thumbnail || autoThumb;

  return (
    <AdminLayout title="Video Gallery">
      <Toaster toastOptions={{ style: { background: '#1A1A1A', color: '#fff', border: '1px solid rgba(201,168,76,0.3)' } }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>{data.length} videos</p>
        <button onClick={openAdd} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#BF953F,#C9A84C)', color: '#000', cursor: 'pointer', fontFamily: "'Raleway', sans-serif", fontSize: '12px', fontWeight: 700 }}>
          <Plus size={14} /> Add Video
        </button>
      </div>

      {loading ? <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>Loading...</div>
        : data.length === 0 ? <div style={{ textAlign: 'center', padding: '60px', color: '#444' }}><p style={{ fontSize: '40px' }}>🎬</p><p>No videos yet.</p></div>
          : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {data.map(v => {
                const ytId = getYouTubeId(v.video_url ?? '');
                const thumb = v.video_thumbnail || (ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : '');
                return (
                  <div key={v.id} style={{ background: '#1A1A1A', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '12px', overflow: 'hidden' }}>
                    <div style={{ position: 'relative', aspectRatio: '16/9', background: '#111' }}>
                      {thumb && <img src={thumb} alt={v.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(201,168,76,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Play size={18} fill="#000" stroke="#000" style={{ marginLeft: '2px' }} />
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: '12px 14px' }}>
                      <p style={{ color: '#ccc', fontSize: '13px', margin: '0 0 6px', fontWeight: 600 }}>{v.title}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', color: v.is_active ? '#22C55E' : '#EF4444' }}>{v.is_active ? 'Active' : 'Hidden'}</span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => openEdit(v)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C9A84C', padding: '4px' }}><Pencil size={14} /></button>
                          <button onClick={() => setDeleteId(v.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', padding: '4px' }}><Trash2 size={14} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

      <AdminModal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Video' : 'Add Video'} size="md">
        <AdminFormField label="Video Title" required><input value={form.title} onChange={e => upd('title', e.target.value)} style={adminInputStyle} placeholder="BCS Ratna 2024 Highlights" /></AdminFormField>
        <AdminFormField label="YouTube URL" required helper="Supports youtube.com/watch?v= and youtu.be/ formats">
          <input value={form.video_url} onChange={e => handleUrlChange(e.target.value)} style={adminInputStyle} placeholder="https://www.youtube.com/watch?v=..." />
        </AdminFormField>
        {thumbSrc && (
          <div style={{ marginBottom: '12px' }}>
            <p style={{ fontSize: '11px', color: '#666', marginBottom: '6px', fontFamily: "'Raleway', sans-serif", textTransform: 'uppercase', letterSpacing: '1px' }}>Auto-fetched Thumbnail</p>
            <img src={thumbSrc} alt="thumbnail" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(201,168,76,0.3)' }} />
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <AdminFormField label="Sort Order"><input type="number" value={form.sort_order} onChange={e => upd('sort_order', Number(e.target.value))} style={adminInputStyle} /></AdminFormField>
        </div>
        <AdminFormField label="Active">
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.is_active} onChange={e => upd('is_active', e.target.checked)} />
            <span style={{ color: '#ccc', fontSize: '14px' }}>Visible on homepage</span>
          </label>
        </AdminFormField>
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <button onClick={() => setModal(false)} style={{ flex: 1, padding: '11px', borderRadius: '8px', border: '1px solid #333', background: 'transparent', color: '#fff', cursor: 'pointer' }}>Cancel</button>
          <button onClick={save} disabled={saving} style={{ flex: 1, padding: '11px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg,#BF953F,#C9A84C)', color: '#000', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 700, fontFamily: "'Raleway', sans-serif", fontSize: '13px' }}>
            {saving ? 'Saving...' : 'Save Video'}
          </button>
        </div>
      </AdminModal>
      <ConfirmDialog isOpen={!!deleteId} title="Delete Video" message="Remove this video?" onConfirm={del} onCancel={() => setDeleteId('')} danger confirmLabel="Delete" />
    </AdminLayout>
  );
}
