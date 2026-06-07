import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { isAdminLoggedIn } from '@/lib/adminAuth';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase, type Nomination } from '@/lib/supabase';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import toast, { Toaster } from 'react-hot-toast';
import { ArrowLeft, Save, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/nominations/$id')({ component: NominationDetailPage });

const fieldStyle: React.CSSProperties = {
  padding: '10px 14px', background: '#111', border: '1px solid rgba(201,168,76,0.15)',
  borderRadius: '8px', color: '#ccc', fontSize: '14px', lineHeight: '1.5',
  wordBreak: 'break-word',
};
const labelStyle: React.CSSProperties = {
  fontFamily: "'Raleway', sans-serif", fontSize: '11px', color: '#666',
  letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px', display: 'block',
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#1A1A1A', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
      <h3 style={{ fontFamily: "'Raleway', sans-serif", fontSize: '13px', color: '#C9A84C', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid rgba(201,168,76,0.1)', margin: 0 }}>{title}</h3>
      <div style={{ marginTop: '16px' }}>{children}</div>
    </div>
  );
}

function Grid2({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>{children}</div>;
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <span style={labelStyle}>{label}</span>
      <div style={fieldStyle}>{value || '—'}</div>
    </div>
  );
}

export default function NominationDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [nom, setNom] = useState<Nomination | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [confirm, setConfirm] = useState<{ action: string; label: string } | null>(null);
  const [lightbox, setLightbox] = useState('');

  useEffect(() => {
    if (!isAdminLoggedIn()) { navigate({ to: '/admin' }); return; }
    fetchNom();
  }, [id]);

  const fetchNom = async () => {
    try {
      const { data, error } = await supabase.from('nominations').select('*').eq('id', id).single();
      if (error) throw error;
      setNom(data);
      setNotes(data.admin_notes ?? '');
    } catch (err) {
      console.error(err);
      toast.error('Failed to load nomination');
    } finally { setLoading(false); }
  };

  const saveNotes = async () => {
    if (!nom) return;
    setSavingNotes(true);
    try {
      const { error } = await supabase.from('nominations').update({ admin_notes: notes, updated_at: new Date().toISOString() }).eq('id', id);
      if (error) throw error;
      toast.success('Notes saved');
    } catch { toast.error('Failed to save notes'); }
    finally { setSavingNotes(false); }
  };

  const updateStatus = async (status: string) => {
    try {
      const { error } = await supabase.from('nominations').update({ nomination_status: status, updated_at: new Date().toISOString() }).eq('id', id);
      if (error) throw error;
      toast.success(`Status updated to ${status}`);
      fetchNom();
    } catch { toast.error('Failed to update status'); }
    setConfirm(null);
  };

  const btnStyle = (color: string): React.CSSProperties => ({
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    padding: '11px 20px', borderRadius: '10px', border: 'none',
    background: color, color: '#fff', cursor: 'pointer',
    fontFamily: "'Raleway', sans-serif", fontSize: '12px', fontWeight: 700,
    letterSpacing: '1px', textTransform: 'uppercase', transition: 'all 0.2s',
  });

  if (loading) return (
    <AdminLayout title="Nomination Detail">
      <div style={{ textAlign: 'center', padding: '80px', color: '#666' }}>Loading...</div>
    </AdminLayout>
  );

  if (!nom) return (
    <AdminLayout title="Nomination Detail">
      <div style={{ textAlign: 'center', padding: '80px', color: '#666' }}>Nomination not found</div>
    </AdminLayout>
  );

  return (
    <AdminLayout title="Nomination Detail">
      <Toaster toastOptions={{ style: { background: '#1A1A1A', color: '#fff', border: '1px solid rgba(201,168,76,0.3)' } }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
        <Link to="/admin/nominations" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888', textDecoration: 'none', fontSize: '13px' }}>
          <ArrowLeft size={16} /> Back
        </Link>
        <code style={{ color: '#C9A84C', fontSize: '14px', background: 'rgba(201,168,76,0.1)', padding: '4px 12px', borderRadius: '6px' }}>{nom.nomination_id}</code>
        <StatusBadge status={nom.nomination_status} />
      </div>

      <Section title="Personal Information">
        <Grid2>
          <Field label="Full Name" value={nom.full_name} />
          <Field label="Designation" value={nom.designation} />
          <Field label="Organisation" value={nom.organisation} />
          <Field label="Organisation Type" value={nom.organisation_type} />
          <Field label="Mobile" value={nom.mobile} />
          <Field label="WhatsApp" value={nom.whatsapp} />
          <Field label="Email" value={nom.email} />
          <Field label="Website" value={nom.website} />
          <Field label="City" value={nom.city} />
          <Field label="State" value={nom.state} />
          <Field label="Address" value={nom.address} />
          <Field label="PIN Code" value={nom.pin_code} />
          <Field label="GST Number" value={nom.gst} />
        </Grid2>
      </Section>

      <Section title="Nomination Details">
        <div style={{ marginBottom: '16px' }}>
          <Grid2>
            <Field label="Category" value={nom.category} />
            <Field label="Sub-Categories" value={nom.sub_categories?.join(', ')} />
          </Grid2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div><span style={labelStyle}>Bio</span><div style={fieldStyle}>{nom.bio || '—'}</div></div>
          <div><span style={labelStyle}>Key Achievements</span><div style={fieldStyle}>{nom.achievements || '—'}</div></div>
          <div><span style={labelStyle}>Why Deserve This Award</span><div style={fieldStyle}>{nom.why_deserve || '—'}</div></div>
        </div>
      </Section>

      <Section title="Uploaded Files">
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {[
            { label: 'Profile Photo', url: nom.profile_photo_url },
            { label: 'Company Logo', url: nom.company_logo_url },
            { label: 'Payment Screenshot', url: nom.payment_screenshot_url },
          ].map(({ label, url }) => (
            <div key={label}>
              <span style={labelStyle}>{label}</span>
              {url ? (
                <img src={url} alt={label}
                  onClick={() => setLightbox(url)}
                  style={{ width: '140px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(201,168,76,0.3)', cursor: 'zoom-in' }}
                />
              ) : <div style={{ ...fieldStyle, width: '140px', textAlign: 'center', padding: '20px' }}>No file</div>}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Payment Information">
        <Grid2>
          <Field label="Method" value={nom.payment_method} />
          <Field label="Transaction Ref / UTR" value={nom.transaction_ref} />
          <Field label="Amount" value={`₹${nom.payment_amount?.toLocaleString()}`} />
          <div>
            <span style={labelStyle}>Payment Status</span>
            <div style={{ marginTop: '4px' }}><StatusBadge status={nom.payment_status} /></div>
          </div>
        </Grid2>
      </Section>

      <Section title="Admin Notes">
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={4}
          placeholder="Internal notes (not visible to nominee)..."
          style={{
            width: '100%', padding: '12px', borderRadius: '8px',
            border: '1px solid rgba(201,168,76,0.2)', background: '#111',
            color: '#ccc', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box',
            fontFamily: "'Open Sans', sans-serif",
          }}
        />
        <button onClick={saveNotes} disabled={savingNotes} style={{ ...btnStyle('#C9A84C'), color: '#000', marginTop: '12px' }}>
          <Save size={14} /> {savingNotes ? 'Saving...' : 'Save Notes'}
        </button>
      </Section>

      <Section title="Status Management">
        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: '12px', color: '#666' }}>Current Status:</span>
          <StatusBadge status={nom.nomination_status} />
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={() => setConfirm({ action: 'verified', label: 'Verify this nomination?' })} style={btnStyle('#22C55E')}>
            <CheckCircle size={14} /> Verify Nomination
          </button>
          <button onClick={() => setConfirm({ action: 'rejected', label: 'Reject this nomination?' })} style={btnStyle('#EF4444')}>
            <XCircle size={14} /> Reject
          </button>
          <button onClick={() => setConfirm({ action: 'pending', label: 'Reset to pending?' })} style={{ ...btnStyle('#555'), background: '#333' }}>
            <RotateCcw size={14} /> Reset to Pending
          </button>
        </div>
      </Section>

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox('')} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out' }}>
          <img src={lightbox} alt="full" style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: '8px' }} />
        </div>
      )}

      <ConfirmDialog
        isOpen={!!confirm}
        title="Confirm Action"
        message={confirm?.label ?? ''}
        onConfirm={() => confirm && updateStatus(confirm.action)}
        onCancel={() => setConfirm(null)}
        danger={confirm?.action === 'rejected'}
      />
    </AdminLayout>
  );
}
