import { createClient } from '@supabase/supabase-js';
import { config } from './index.js';
import logger from '../utils/logger.js';

// Validate Supabase configuration
if (!config.supabase.url || !config.supabase.serviceRoleKey) {
  logger.error('Missing Supabase configuration. Please check your environment variables.');
  throw new Error('Supabase configuration is incomplete');
}

// Create Supabase client
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