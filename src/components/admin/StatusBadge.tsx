type Props = { status: string };

const map: Record<string, { bg: string; text: string; label: string }> = {
  pending:   { bg: 'rgba(251,191,36,0.15)',  text: '#FBD038', label: 'Pending' },
  verified:  { bg: 'rgba(34,197,94,0.15)',   text: '#22C55E', label: 'Verified' },
  rejected:  { bg: 'rgba(239,68,68,0.15)',   text: '#EF4444', label: 'Rejected' },
  paid:      { bg: 'rgba(34,197,94,0.15)',   text: '#22C55E', label: 'Paid' },
  disputed:  { bg: 'rgba(239,68,68,0.15)',   text: '#EF4444', label: 'Disputed' },
  refunded:  { bg: 'rgba(156,163,175,0.15)', text: '#9CA3AF', label: 'Refunded' },
};

export function StatusBadge({ status }: Props) {
  const s = map[status] ?? { bg: 'rgba(156,163,175,0.15)', text: '#9CA3AF', label: status };
  return (
    <span style={{
      background: s.bg, color: s.text,
      padding: '3px 10px', borderRadius: '50px',
      fontSize: '11px', fontWeight: 700,
      fontFamily: "'Raleway', sans-serif",
      letterSpacing: '1px', textTransform: 'uppercase',
      whiteSpace: 'nowrap',
    }}>
      {s.label}
    </span>
  );
}
