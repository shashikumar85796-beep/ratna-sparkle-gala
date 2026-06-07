import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MjUwMDAwMDAwMH0.placeholder-signature-for-dev-only';

const isConfigured = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { isConfigured };

export type NominationStatus = 'pending' | 'verified' | 'rejected';
export type PaymentStatus = 'pending' | 'paid' | 'disputed' | 'refunded';
export type PartnerTier = 'title' | 'associate' | 'other';
export type GallerySection = 'ceremony_glimpses' | 'past_events' | 'video_gallery';

export type Nomination = {
  id: string;
  nomination_id: string;
  full_name: string;
  designation: string;
  organisation: string;
  organisation_type: string;
  mobile: string;
  whatsapp: string;
  email: string;
  city: string;
  state: string;
  category: string;
  sub_categories: string[];
  bio: string;
  achievements: string;
  why_deserve: string;
  website: string;
  address: string;
  pin_code: string;
  gst: string;
  payment_method: string;
  transaction_ref: string;
  payment_amount: number;
  payment_status: PaymentStatus;
  nomination_status: NominationStatus;
  admin_notes: string;
  profile_photo_url: string;
  company_logo_url: string;
  payment_screenshot_url: string;
  created_at: string;
  updated_at: string;
};

export type GalleryImage = {
  id: string;
  section: GallerySection;
  year?: number;
  title?: string;
  caption?: string;
  image_url?: string;
  video_url?: string;
  video_thumbnail?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export type VipAttendee = {
  id: string;
  name: string;
  designation: string;
  organisation: string;
  attended_since: number;
  photo_url: string;
  linkedin_url?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export type Partner = {
  id: string;
  name: string;
  tier: PartnerTier;
  logo_url?: string;
  website_url?: string;
  sort_order: number;
  is_active: boolean;
  year: number;
  created_at: string;
};

export type Testimonial = {
  id: string;
  name: string;
  designation: string;
  organisation: string;
  quote: string;
  photo_url?: string;
  rating: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export type PastEvent = {
  id: string;
  year: number;
  edition: string;
  title?: string;
  venue?: string;
  event_date?: string;
  description?: string;
  total_awards?: number;
  total_attendees?: number;
  highlight_text?: string;
  cover_image_url?: string;
  is_active: boolean;
  created_at: string;
};

export type PastEventPhoto = {
  id: string;
  event_id: string;
  year: number;
  image_url: string;
  caption?: string;
  sort_order: number;
  created_at: string;
};

export type Winner = {
  id: string;
  name: string;
  designation?: string;
  organisation?: string;
  award_name: string;
  category: string;
  sub_category?: string;
  year: number;
  photo_url?: string;
  bio?: string;
  sort_order: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
};

export type SiteSetting = {
  id: string;
  key: string;
  value: string;
  updated_at: string;
};
