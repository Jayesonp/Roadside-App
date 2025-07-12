import { createClient } from '@supabase/supabase-js';
import { config } from './index.js';
import logger from '../utils/logger.js';

// Create Supabase client with service role for full access
const supabase = createClient(
  config.supabase.url || 'https://placeholder.supabase.co',
  config.supabase.serviceRoleKey || 'placeholder-service-role-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    db: {
      schema: 'public'
    }
  }
);

// Create client-side Supabase client for authentication
export const supabaseAuth = createClient(
  config.supabase.url || 'https://placeholder.supabase.co',
  config.supabase.anonKey || 'placeholder-anon-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true
    }
  }
);

// Test database connection
export const testConnection = async () => {
  try {
    logger.info('Testing Supabase connection...');
    
    if (!config.supabase.url || config.supabase.url === 'https://placeholder.supabase.co') {
      logger.warn('⚠️  Supabase not configured - please set up your credentials');
      return false;
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (error && error.code !== 'PGRST116') {
      logger.error('Supabase connection test failed:', error);
      throw error;
    }
    
    logger.info('✅ Supabase connection successful');
    return true;
  } catch (error) {
    logger.error('❌ Supabase connection failed:', {
      message: error.message,
      details: error.details || 'No additional details',
      hint: error.hint || 'Check your Supabase URL and service role key'
    });
    return false;
  }
};

// Helper function to bypass RLS for admin operations
export const supabaseAdmin = supabase;

export default supabase;
