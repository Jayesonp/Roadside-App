import { createClient } from '@supabase/supabase-js';
import { config } from './index.js';
import logger from '../utils/logger.js';

// Validate Supabase configuration
if (!config.supabase.url || !config.supabase.serviceRoleKey || 
    config.supabase.url === 'your_supabase_url_here' || 
    config.supabase.serviceRoleKey === 'your_supabase_service_role_key_here') {
  console.warn('⚠️  Supabase not configured - using mock client for demo');
  // Create a mock client for demo purposes
  const mockSupabase = {
    from: () => ({
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
      insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: {}, error: null }) }) }),
      update: () => ({ eq: () => ({ select: () => ({ single: () => Promise.resolve({ data: {}, error: null }) }) }) }),
      delete: () => ({ eq: () => Promise.resolve({ error: null }) })
    })
  };
  
  export const testConnection = async () => {
    console.log('📍 Using mock Supabase client for demo');
    return true;
  };
  
  export default mockSupabase;
} else {
  // Create real Supabase client
  const supabase = createClient(
    config.supabase.url,
    config.supabase.serviceRoleKey,
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
  
  // Test database connection
  export const testConnection = async () => {
    try {
      logger.info('Testing Supabase connection...');
      
      const { data, error } = await supabase
        .from('pg_tables')
        .select('tablename')
        .eq('schemaname', 'public')
        .limit(1);
      
      if (error) {
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
  
  export default supabase;
}
