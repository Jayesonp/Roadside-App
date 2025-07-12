import { createClient } from '@supabase/supabase-js';
import { config } from './index.js';
import logger from '../utils/logger.js';

// Check if Supabase is configured
const isSupabaseConfigured = 
  config.supabase.url && 
  config.supabase.serviceRoleKey && 
  config.supabase.url !== 'your_supabase_url_here' && 
  config.supabase.serviceRoleKey !== 'your_supabase_service_role_key_here' &&
  config.supabase.url.startsWith('https://');
}

if (!isSupabaseConfigured) {
  console.log('🔧 Supabase not configured - using demo mode');
  console.log('📖 To connect to Supabase:');
  console.log('   1. Create a Supabase project at https://app.supabase.com');
  console.log('   2. Get your project URL and service role key');
  console.log('   3. Update the .env file with your credentials');
  console.log('   4. Restart the application');
  
  // Create a mock client for demo purposes
  const mockSupabase = {
    from: () => ({
      select: () => ({ 
        eq: () => ({ 
          single: () => Promise.resolve({ data: null, error: null }),
          range: () => Promise.resolve({ data: [], error: null, count: 0 })
        })
      }),
      insert: () => ({ 
        select: () => ({ 
          single: () => Promise.resolve({ data: { id: 'demo-id' }, error: null }) 
        }) 
      }),
      update: () => ({ 
        eq: () => ({ 
          select: () => ({ 
            single: () => Promise.resolve({ data: { id: 'demo-id' }, error: null }) 
          }) 
        }) 
      }),
      delete: () => ({ 
        eq: () => Promise.resolve({ error: null }) 
      })
    })
  };
  
  export const testConnection = async () => {
    console.log('📍 Running in demo mode - Supabase not connected');
    return false;
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
      logger.info('🔍 Testing Supabase connection...');
      
      const { data, error } = await supabase
        .from('pg_tables')
        .select('tablename')
        .eq('schemaname', 'public')
        .limit(1);
      
      if (error) {
        logger.error('❌ Supabase connection test failed:', error);
        console.log('💡 Connection troubleshooting:');
        console.log('   - Verify your Supabase URL starts with https://');
        console.log('   - Check your service role key is correct');
        console.log('   - Ensure your Supabase project is active');
        throw error;
      }
      
      logger.info('✅ Supabase connection successful!');
      console.log('🎉 Database connected and ready to use');
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