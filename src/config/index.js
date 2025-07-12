import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
  },
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  
  // API
  api: {
    version: process.env.API_VERSION || 'v1',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000'
  },
  
  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  },
  
  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log'
  }
};

// Validate required environment variables
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'JWT_SECRET'
];

export const validateConfig = () => {
  // Only validate in production or when explicitly required
  if (config.nodeEnv === 'production') {
    const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
    if (missing.length > 0) {
      console.error('❌ Missing required environment variables:', missing);
      console.error('📝 Please create a .env file with the following variables:');
      missing.forEach(envVar => {
        console.error(`   ${envVar}=your_${envVar.toLowerCase()}_here`);
      });
      console.error('\n🔗 Get your Supabase credentials from: https://app.supabase.com/project/YOUR_PROJECT/settings/api');
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  } else {
    console.log('🔧 Running in development mode - some env vars may use defaults');
  }
  
  // Validate Supabase URL format
  if (process.env.SUPABASE_URL && process.env.SUPABASE_URL !== 'your_supabase_url_here' && !process.env.SUPABASE_URL.startsWith('https://')) {
    throw new Error('SUPABASE_URL must start with https://');
  }
  
  console.log('✅ Environment configuration validated');
};