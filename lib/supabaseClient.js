import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = globalThis.SUPABASE_URL || globalThis.__SUPABASE_URL__ || import.meta.env?.SUPABASE_URL;
const SUPABASE_ANON_KEY = globalThis.SUPABASE_ANON_KEY || globalThis.__SUPABASE_ANON_KEY__ || import.meta.env?.SUPABASE_ANON_KEY;

export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;
