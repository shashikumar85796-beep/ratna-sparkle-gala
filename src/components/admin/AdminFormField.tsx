type Props = {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  helper?: string;
};

export function AdminFormField({ label, required, error, children, helper }: Props) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{
        display: 'block', marginBottom: '6px',
        fontFamily: "'Raleway', sans-serif", fontWeight: 600,
        fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase',
        color: error ? '#EF4444' : '#C9A84C',
      }}>
        {label}{required && <span style={{ color: '#EF4444', marginLeft: '4px' }}>*</span>}
      </label>
      {children}
      {helper && !error && (
        <p style={{ marginTop: '4px', fontSize: '12px', color: '#555' }}>{helper}</p>
      )}
      {error && (
        <p style={{ marginTop: '4px', fontSize: '12px', color: '#EF4444' }}>{error}</p>
      )}
    </div>
  );
}

export const adminInputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: '8px',
  border: '1px solid rgba(201,168,76,0.3)', background: 'rgba(255,255,255,0.04)',
  color: '#fff', fontFamily: "'Open Sans', sans-serif", fontSize: '14px',
  outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
};

export const adminTextareaStyle: React.CSSProperties = {
  ...adminInputStyle, resize: 'vertical', minHeight: '80px',
};

export const adminSelectStyle: React.CSSProperties = {
  ...adminInputStyle,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23C9A84C' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
  paddingRight: '32px', appearance: 'none', cursor: 'pointer',
  backgroundColor: '#1A1A1A',
};
