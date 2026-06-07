import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { uploadFile } from '@/lib/uploadFile';

type Props = {
  bucket: string;
  folder?: string;
  currentUrl?: string;
  onUpload: (url: string) => void;
  label?: string;
};

export function AdminImageUpload({ bucket, folder = '', currentUrl, onUpload, label = 'Upload Image' }: Props) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(currentUrl ?? '');

  const onDrop = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setError('');
    setUploading(true);
    setProgress(20);
    try {
      setProgress(50);
      const url = await uploadFile(bucket, file, folder);
      setProgress(100);
      setPreview(url);
      onUpload(url);
    } catch (err: any) {
      setError(err.message ?? 'Upload failed');
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 800);
    }
  }, [bucket, folder, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }, maxFiles: 1,
  });

  return (
    <div>
      {preview ? (
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '12px' }}>
          <img src={preview} alt="preview" style={{
            width: '120px', height: '90px', objectFit: 'cover',
            borderRadius: '8px', border: '1px solid rgba(201,168,76,0.3)',
          }} />
          <button
            onClick={() => { setPreview(''); onUpload(''); }}
            style={{
              position: 'absolute', top: '-6px', right: '-6px',
              width: '22px', height: '22px', borderRadius: '50%',
              background: '#EF4444', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff',
            }}
          >
            <X size={12} />
          </button>
        </div>
      ) : null}

      <div
        {...getRootProps()}
        style={{
          border: `2px dashed ${isDragActive ? '#C9A84C' : 'rgba(201,168,76,0.3)'}`,
          borderRadius: '10px', padding: '24px', textAlign: 'center',
          cursor: 'pointer', transition: 'all 0.2s',
          background: isDragActive ? 'rgba(201,168,76,0.05)' : 'transparent',
        }}
      >
        <input {...getInputProps()} />
        <Upload size={24} style={{ color: '#C9A84C', margin: '0 auto 8px' }} />
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: '12px', color: '#888', margin: 0 }}>
          {isDragActive ? 'Drop image here' : label}
        </p>
        <p style={{ fontSize: '11px', color: '#555', marginTop: '4px' }}>
          JPG, PNG or WebP · Max 10MB
        </p>
      </div>

      {uploading && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ height: '4px', background: '#222', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${progress}%`,
              background: 'linear-gradient(90deg, #BF953F, #C9A84C)',
              transition: 'width 0.3s ease', borderRadius: '2px',
            }} />
          </div>
          <p style={{ fontSize: '11px', color: '#C9A84C', marginTop: '4px' }}>Uploading...</p>
        </div>
      )}
      {error && <p style={{ fontSize: '12px', color: '#EF4444', marginTop: '6px' }}>{error}</p>}
    </div>
  );
}
