import { AdminModal } from './AdminModal';

type Props = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  danger?: boolean;
};

export function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, confirmLabel = 'Confirm', danger = false }: Props) {
  return (
    <AdminModal isOpen={isOpen} onClose={onCancel} title={title} size="sm">
      <p style={{ color: '#aaa', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>{message}</p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button onClick={onCancel} style={{
          padding: '10px 20px', borderRadius: '8px',
          border: '1px solid #333', background: 'transparent',
          color: '#fff', cursor: 'pointer', fontFamily: "'Raleway', sans-serif",
          fontWeight: 600, fontSize: '13px',
        }}>
          Cancel
        </button>
        <button onClick={onConfirm} style={{
          padding: '10px 20px', borderRadius: '8px', border: 'none',
          background: danger ? '#EF4444' : 'linear-gradient(135deg, #BF953F, #C9A84C)',
          color: danger ? '#fff' : '#000', cursor: 'pointer',
          fontFamily: "'Raleway', sans-serif", fontWeight: 700, fontSize: '13px',
        }}>
          {confirmLabel}
        </button>
      </div>
    </AdminModal>
  );
}
