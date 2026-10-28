import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.error(
    '[portfolio] Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. The public site falls back to mock data; admin and contact form will not work.',
  );
}

// Throwing here would blank the whole site, mock fallback included. Callers
// that hit the network check isSupabaseConfigured first (assertSupabase).
export function assertSupabase() {
  if (!isSupabaseConfigured) {
    throw new Error('This feature is not configured on this deployment.');
  }
}

export const supabase = createClient(
  supabaseUrl || 'https://not-configured.supabase.co',
  supabaseAnonKey || 'not-configured',
);
