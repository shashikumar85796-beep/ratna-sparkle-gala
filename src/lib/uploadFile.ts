import { supabase } from './supabase';

export async function uploadFile(
  bucket: string,
  file: File,
  folder: string = ''
): Promise<string> {
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File size must be under 10MB');
  }
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowed.includes(file.type)) {
    throw new Error('Please upload JPG, PNG or WebP only');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, { cacheControl: '3600', upsert: false });

  if (error) throw new Error('Upload failed. Check connection and retry.');

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return urlData.publicUrl;
}

export function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : null;
}
