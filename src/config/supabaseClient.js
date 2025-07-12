import { createClient } from '@supabase/supabase-js';
import { config } from './index.js';

// Create Supabase client for authentication
const supabaseUrl = config.supabase.url || process.env.SUPABASE_URL;
const supabaseAnonKey = config.supabase.anonKey || process.env.SUPABASE_ANON_KEY;

let supabaseClient = null;

if (supabaseUrl && supabaseAnonKey && 
    supabaseUrl !== 'your_supabase_url_here' && 
    supabaseAnonKey !== 'your_supabase_anon_key_here') {
  
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
  
  console.log('✅ Supabase Auth client initialized');
} else {
  console.log('🔧 Supabase Auth not configured - using demo mode');
}

export default supabaseClient;