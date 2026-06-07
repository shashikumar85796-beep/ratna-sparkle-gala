import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { isAdminLoggedIn } from '@/lib/adminAuth';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase, type PastEvent, type PastEventPhoto } from '@/lib/supabase';
import { AdminModal } from '@/components/admin/AdminModal';
import { AdminImageUpload } from '@/components/admin/AdminImageUpload';
import { AdminFormField, adminInputStyle, adminTextareaStyle } from '@/components/admin/AdminFormField';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { uploadFile } from '@/lib/uploadFile';
import { useDropzone } from 'react-dropzone';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, Pencil, Trash2, Images, Upload } from 'lucide-react';

export const Route = createFileRoute('/admin/past-events')({ component: PastEventsPage });
const EMPTY_EVENT = { year: 2024, edition: '', title: '', venue: '', event_date: '', description: '', total_awards: 0, total_attendees: 0, highlight_text: '', cover_image_url: '', is_active: true };

export default function PastEventsPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<PastEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventModal, setEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<PastEvent | null>(null);
  const [eventForm, setEventForm] = useState(EMPTY_EVENT);
  const [savingEvent, setSavingEvent] = useState(false);
  const [deleteEventId, setDeleteEventId] = useState('');

  const [photosEventId, setPhotosEventId] = useState<string>('');
  const [photosEventYear, setPhotosEventYear] = useState<number>(2024);
  const [photos, setPhotos] = useState<PastEventPhoto[]>([]);
  const [photosModal, setPhotosModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<{ file: File; caption: string; progress: number; status: 'pending' | 'done' | 'error' }[]>([]);

  useEffect(() => { if (!isAdminLoggedIn()) { navigate({ to: '/admin' }); return; } fetchEvents(); }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('past_events').select('*').order('year', { ascending: false });
      if (error) throw error;
      setEvents(data ?? []);
    } catch { toast.error('Failed to load events'); }
    finally { setLoading(false); }
  };

  const openEventAdd = () => { setEditingEvent(null); setEventForm(EMPTY_EVENT); setEventModal(true); };
  const openEventEdit = (e: PastEvent) => {
    setEditingEvent(e);
    setEventForm({ year: e.year, edition: e.edition, title: e.title ?? '', venue: e.venue ?? '', event_date: e.event_date ?? '', description: e.description ?? '', total_awards: e.total_awards ?? 0, total_attendees: e.total_attendees ?? 0, highlight_text: e.highlight_text ?? '', cover_image_url: e.cover_image_url ?? '', is_active: e.is_active });
    setEventModal(true);
  };

  const saveEvent = async () => {
    if (!eventForm.year) { toast.error('Year required'); return; }
    setSavingEvent(true);
    try {
      if (editingEvent) {
        const { error } = await supabase.from('past_events').update(eventForm).eq('id', editingEvent.id);
        if (error) throw error;
        toast.success('Event updated');
      } else {
        const { error } = await supabase.from('past_events').insert(eventForm);
        if (error) throw error;
        toast.success('Event added');
      }
      setEventModal(false); fetchEvents();
    } catch { toast.error('Save failed'); }
    finally { setSavingEvent(false); }
  };

  const openPhotos = async (event: PastEvent) => {
    setPhotosEventId(event.id);
    setPhotosEventYear(event.year);
    setUploadQueue([]);
    try {
      const { data, error } = await supabase.from('past_event_photos').select('*').eq('event_id', event.id).order('sort_order');
      if (error) throw error;
      setPhotos(data ?? []);
    } catch { toast.error('Failed to load photos'); }
    setPhotosModal(true);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 50,
    onDrop: (files) => {
      setUploadQueue(files.map(f => ({ file: f, caption: '', progress: 0, status: 'pending' as const })));
    },
  });

  const runUpload = async () => {
    setUploading(true);
    for (let i = 0; i < uploadQueue.length; i++) {
      const item = uploadQueue[i];
      if (item.status === 'done') continue;
      try {
        setUploadQueue(q => q.map((it, idx) => idx === i ? { ...it, progress: 30 } : it));
        const url = await uploadFile('gallery', item.file, `events/${photosEventYear}/`);
        setUploadQueue(q => q.map((it, idx) => idx === i ? { ...it, progress: 70 } : it));
        await supabase.from('past_event_photos').insert({ event_id: photosEventId, year: photosEventYear, image_url: url, caption: item.caption, sort_order: photos.length + i });
        setUploadQueue(q => q.map((it, idx) => idx === i ? { ...it, progress: 100, status: 'done' } : it));
      } catch {
        setUploadQueue(q => q.map((it, idx) => idx === i ? { ...it, status: 'error' } : it));
      }
    }
    // Refresh photos
    const { data } = await supabase.from('past_event_photos').select('*').eq('event_id', photosEventId).order('sort_order');
    setPhotos(data ?? []);
    setUploading(false);
    toast.success('Upload complete');
  };

  const deletePhoto = async (id: string) => {
    try {
      await supabase.from('past_event_photos').delete().eq('id', id);
      setPhotos(p => p.filter(ph => ph.id !== id));
      toast.success('Photo deleted');
    } catch { toast.error('Delete failed'); }
  };

  const updEvent = (k: string, v: any) => setEventForm(f => ({ ...f, [k]: v }));

  return (
    <AdminLayout title="Past Events">
      <Toaster toastOptions={{ style: { background: '#1A1A1A', color: '#fff', border: '1px solid rgba(201,168,76,0.3)' } }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>{events.length} events</p>
        <button onClick={openEventAdd} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#BF953F,#C9A84C)', color: '#000', cursor: 'pointer', fontFamily: "'Raleway', sans-serif", fontSize: '12px', fontWeight: 700 }}>
          <Plus size={14} /> Add Event
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {loading ? Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ height: '200px', background: '#1A1A1A', borderRadius: '12px' }} />
        )) : events.map(e => (
          <div key={e.id} style={{ background: '#1A1A1A', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '12px', overflow: 'hidden' }}>
            {e.cover_image_url && <img src={e.cover_image_url} alt={`${e.year}`} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />}
            <div style={{ padding: '16px' }}>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 800, fontSize: '24px', color: '#C9A84C', margin: '0 0 4px' }}>{e.year}</p>
              <p style={{ color: '#888', fontSize: '12px', margin: '0 0 12px' }}>{e.edition}</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => openEventEdit(e)} style={{ flex: 1, padding: '7px', borderRadius: '6px', border: '1px solid rgba(201,168,76,0.3)', background: 'transparent', color: '#C9A84C', cursor: 'pointer', fontSize: '11px', fontFamily: "'Raleway', sans-serif", fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <Pencil size={12} /> Edit
                </button>
                <button onClick={() => openPhotos(e)} style={{ flex: 1, padding: '7px', borderRadius: '6px', border: '1px solid rgba(201,168,76,0.3)', background: 'transparent', color: '#C9A84C', cursor: 'pointer', fontSize: '11px', fontFamily: "'Raleway', sans-serif", fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <Images size={12} /> Photos
                </button>
                <button onClick={() => setDeleteEventId(e.id)} style={{ padding: '7px', borderRadius: '6px', border: '1px solid rgba(239,68,68,0.3)', background: 'transparent', color: '#EF4444', cursor: 'pointer' }}>
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Event Modal */}
      <AdminModal isOpen={eventModal} onClose={() => setEventModal(false)} title={editingEvent ? 'Edit Event' : 'Add Past Event'} size="lg">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <AdminFormField label="Year" required><input type="number" value={eventForm.year} onChange={e => updEvent('year', Number(e.target.value))} style={adminInputStyle} /></AdminFormField>
          <AdminFormField label="Edition (e.g. 12th Edition)"><input value={eventForm.edition} onChange={e => updEvent('edition', e.target.value)} style={adminInputStyle} /></AdminFormField>
          <AdminFormField label="Event Title"><input value={eventForm.title} onChange={e => updEvent('title', e.target.value)} style={adminInputStyle} /></AdminFormField>
          <AdminFormField label="Venue"><input value={eventForm.venue} onChange={e => updEvent('venue', e.target.value)} style={adminInputStyle} /></AdminFormField>
          <AdminFormField label="Event Date"><input value={eventForm.event_date} onChange={e => updEvent('event_date', e.target.value)} style={adminInputStyle} placeholder="30 June 2024" /></AdminFormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <AdminFormField label="Total Awards"><input type="number" value={eventForm.total_awards} onChange={e => updEvent('total_awards', Number(e.target.value))} style={adminInputStyle} /></AdminFormField>
            <AdminFormField label="Total Attendees"><input type="number" value={eventForm.total_attendees} onChange={e => updEvent('total_attendees', Number(e.target.value))} style={adminInputStyle} /></AdminFormField>
          </div>
        </div>
        <AdminFormField label="Description">
          <textarea value={eventForm.description} onChange={e => updEvent('description', e.target.value)} rows={3} style={{ ...adminInputStyle, resize: 'vertical', fontFamily: "'Open Sans', sans-serif" } as any} />
        </AdminFormField>
        <AdminFormField label="Cover Image">
          <AdminImageUpload bucket="gallery" folder="events/covers/" currentUrl={eventForm.cover_image_url} onUpload={url => updEvent('cover_image_url', url)} />
        </AdminFormField>
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <button onClick={() => setEventModal(false)} style={{ flex: 1, padding: '11px', borderRadius: '8px', border: '1px solid #333', background: 'transparent', color: '#fff', cursor: 'pointer' }}>Cancel</button>
          <button onClick={saveEvent} disabled={savingEvent} style={{ flex: 1, padding: '11px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg,#BF953F,#C9A84C)', color: '#000', cursor: savingEvent ? 'not-allowed' : 'pointer', fontWeight: 700, fontFamily: "'Raleway', sans-serif", fontSize: '13px' }}>
            {savingEvent ? 'Saving...' : 'Save Event'}
          </button>
        </div>
      </AdminModal>

      {/* Photos Modal */}
      <AdminModal isOpen={photosModal} onClose={() => setPhotosModal(false)} title={`${photosEventYear} Event Photos`} size="xl">
        {/* Existing photos */}
        {photos.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: '12px', color: '#C9A84C', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>Current Photos ({photos.length})</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {photos.map(p => (
                <div key={p.id} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden' }}>
                  <img src={p.image_url} alt={p.caption} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} />
                  <button onClick={() => deletePhoto(p.id)} style={{ position: 'absolute', top: '4px', right: '4px', width: '24px', height: '24px', borderRadius: '50%', background: '#EF4444', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Zone */}
        <div {...getRootProps()} style={{ border: '2px dashed rgba(201,168,76,0.3)', borderRadius: '12px', padding: '32px', textAlign: 'center', cursor: 'pointer', marginBottom: '16px' }}>
          <input {...getInputProps()} />
          <Upload size={32} style={{ color: '#C9A84C', margin: '0 auto 12px' }} />
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: '14px', color: '#888', margin: 0 }}>Drop photos here or click to select (up to 50)</p>
          <p style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>JPG, PNG or WebP</p>
        </div>

        {uploadQueue.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {uploadQueue.map((item, i) => (
                <div key={i} style={{ background: '#111', borderRadius: '8px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '12px', color: '#ccc', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.file.name}</span>
                  <input placeholder="Caption" value={item.caption} onChange={e => setUploadQueue(q => q.map((it, idx) => idx === i ? { ...it, caption: e.target.value } : it))}
                    style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #333', background: '#1A1A1A', color: '#fff', fontSize: '12px', width: '140px' }} />
                  {item.status === 'done' ? <span style={{ color: '#22C55E', fontSize: '16px' }}>✓</span>
                    : item.status === 'error' ? <span style={{ color: '#EF4444', fontSize: '16px' }}>✗</span>
                      : item.progress > 0 ? <div style={{ width: '60px', height: '4px', background: '#333', borderRadius: '2px' }}><div style={{ height: '100%', width: `${item.progress}%`, background: '#C9A84C', borderRadius: '2px' }} /></div>
                        : null}
                </div>
              ))}
            </div>
            <button onClick={runUpload} disabled={uploading} style={{ marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg,#BF953F,#C9A84C)', color: '#000', cursor: uploading ? 'not-allowed' : 'pointer', fontFamily: "'Raleway', sans-serif", fontSize: '12px', fontWeight: 700 }}>
              <Upload size={14} /> {uploading ? 'Uploading...' : `Upload ${uploadQueue.length} Photos`}
            </button>
          </div>
        )}
      </AdminModal>

      <ConfirmDialog isOpen={!!deleteEventId} title="Delete Event" message="Delete this event and all its photos?" onConfirm={async () => { await supabase.from('past_events').delete().eq('id', deleteEventId); toast.success('Deleted'); fetchEvents(); setDeleteEventId(''); }} onCancel={() => setDeleteEventId('')} danger confirmLabel="Delete Event" />
    </AdminLayout>
  );
}
