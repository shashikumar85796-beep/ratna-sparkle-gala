import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { isAdminLoggedIn } from '@/lib/adminAuth';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import { AdminFormField, adminInputStyle, adminTextareaStyle } from '@/components/admin/AdminFormField';
import toast, { Toaster } from 'react-hot-toast';
import { Save } from 'lucide-react';

export const Route = createFileRoute('/admin/settings')({ component: SettingsPage });

const DEFAULTS: Record<string, string> = {
  nominations_open: 'true', nomination_count_display: '0',
  event_date: '2026-06-30', event_edition: '16th',
  homepage_hero_title: 'BCS RATNA AWARD',
  homepage_hero_subtitle: 'Celebrating Excellence in Broadcasting, Digital Media & Technology',
  contact_phone: '+91-9811120650', contact_email: 'info@aavishkargroup.in',
  contact_address: 'B-263, Indra Nagar, Adarsh Nagar, New Delhi-110033',
  contact_whatsapp: '+91-9811120650',
  facebook_url: '', instagram_url: '', twitter_url: '', youtube_url: '', linkedin_url: '',
};

export default function SettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<Record<string, string>>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string>('');

  useEffect(() => { if (!isAdminLoggedIn()) { navigate({ to: '/admin' }); return; } fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from('site_settings').select('*');
      if (error) throw error;
      const map: Record<string, string> = { ...DEFAULTS };
      (data ?? []).forEach((r: any) => { map[r.key] = r.value; });
      setSettings(map);
    } catch { console.error('Settings fetch failed — table may not exist yet'); }
    finally { setLoading(false); }
  };

  const saveSection = async (keys: string[], sectionName: string) => {
    setSaving(sectionName);
    try {
      for (const key of keys) {
        await supabase.from('site_settings').upsert({ key, value: settings[key] ?? '', updated_at: new Date().toISOString() }, { onConflict: 'key' });
      }
      toast.success(`${sectionName} saved`);
    } catch { toast.error('Save failed'); }
    finally { setSaving(''); }
  };

  const upd = (key: string, value: string) => setSettings(s => ({ ...s, [key]: value }));

  const SaveBtn = ({ sectionKey, keys }: { sectionKey: string; keys: string[] }) => (
    <button onClick={() => saveSection(keys, sectionKey)} disabled={saving === sectionKey}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', border: 'none', background: saving === sectionKey ? '#555' : 'linear-gradient(135deg,#BF953F,#C9A84C)', color: '#000', cursor: saving === sectionKey ? 'not-allowed' : 'pointer', fontFamily: "'Raleway', sans-serif", fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginTop: '16px' }}>
      <Save size={14} /> {saving === sectionKey ? 'Saving...' : 'Save Section'}
    </button>
  );

  const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ background: '#1A1A1A', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
      <h3 style={{ fontFamily: "'Raleway', sans-serif", fontSize: '13px', color: '#C9A84C', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 20px', paddingBottom: '12px', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>{title}</h3>
      {children}
    </div>
  );

  if (loading) return <AdminLayout title="Site Settings"><div style={{ textAlign: 'center', padding: '80px', color: '#666' }}>Loading...</div></AdminLayout>;

  return (
    <AdminLayout title="Site Settings">
      <Toaster toastOptions={{ style: { background: '#1A1A1A', color: '#fff', border: '1px solid rgba(201,168,76,0.3)' } }} />

      <Card title="Nomination Control">
        <AdminFormField label="Nominations Status">
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '12px', background: '#111', borderRadius: '10px', border: '1px solid rgba(201,168,76,0.2)' }}>
            <div onClick={() => upd('nominations_open', settings.nominations_open === 'true' ? 'false' : 'true')}
              style={{ width: '44px', height: '24px', borderRadius: '12px', background: settings.nominations_open === 'true' ? '#22C55E' : '#444', position: 'relative', cursor: 'pointer', transition: 'background 0.3s', flexShrink: 0 }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '2px', left: settings.nominations_open === 'true' ? '22px' : '2px', transition: 'left 0.3s' }} />
            </div>
            <span style={{ color: settings.nominations_open === 'true' ? '#22C55E' : '#EF4444', fontFamily: "'Raleway', sans-serif", fontWeight: 700 }}>
              Nominations are {settings.nominations_open === 'true' ? 'OPEN' : 'CLOSED'}
            </span>
          </label>
        </AdminFormField>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <AdminFormField label="Event Date">
            <input type="date" value={settings.event_date} onChange={e => upd('event_date', e.target.value)} style={adminInputStyle} />
          </AdminFormField>
          <AdminFormField label="Event Edition">
            <input value={settings.event_edition} onChange={e => upd('event_edition', e.target.value)} style={adminInputStyle} placeholder="16th" />
          </AdminFormField>
        </div>
        <SaveBtn sectionKey="Nominations" keys={['nominations_open', 'event_date', 'event_edition']} />
      </Card>

      <Card title="Homepage Text">
        <AdminFormField label="Hero Title">
          <input value={settings.homepage_hero_title} onChange={e => upd('homepage_hero_title', e.target.value)} style={adminInputStyle} />
        </AdminFormField>
        <AdminFormField label="Hero Subtitle">
          <input value={settings.homepage_hero_subtitle} onChange={e => upd('homepage_hero_subtitle', e.target.value)} style={adminInputStyle} />
        </AdminFormField>
        <SaveBtn sectionKey="Hero" keys={['homepage_hero_title', 'homepage_hero_subtitle']} />
      </Card>

      <Card title="Contact Information">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <AdminFormField label="Phone"><input value={settings.contact_phone} onChange={e => upd('contact_phone', e.target.value)} style={adminInputStyle} /></AdminFormField>
          <AdminFormField label="WhatsApp"><input value={settings.contact_whatsapp} onChange={e => upd('contact_whatsapp', e.target.value)} style={adminInputStyle} /></AdminFormField>
          <AdminFormField label="Email"><input value={settings.contact_email} onChange={e => upd('contact_email', e.target.value)} style={adminInputStyle} /></AdminFormField>
        </div>
        <AdminFormField label="Address">
          <textarea value={settings.contact_address} onChange={e => upd('contact_address', e.target.value)} style={adminTextareaStyle} rows={2} />
        </AdminFormField>
        <SaveBtn sectionKey="Contact" keys={['contact_phone', 'contact_email', 'contact_whatsapp', 'contact_address']} />
      </Card>

      <Card title="Social Media Links">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[
            { key: 'facebook_url', label: 'Facebook URL' },
            { key: 'instagram_url', label: 'Instagram URL' },
            { key: 'twitter_url', label: 'Twitter / X URL' },
            { key: 'youtube_url', label: 'YouTube Channel URL' },
            { key: 'linkedin_url', label: 'LinkedIn URL' },
          ].map(({ key, label }) => (
            <AdminFormField key={key} label={label}>
              <input value={settings[key] ?? ''} onChange={e => upd(key, e.target.value)} style={adminInputStyle} placeholder="https://" />
            </AdminFormField>
          ))}
        </div>
        <SaveBtn sectionKey="Social" keys={['facebook_url', 'instagram_url', 'twitter_url', 'youtube_url', 'linkedin_url']} />
      </Card>
    </AdminLayout>
  );
}
