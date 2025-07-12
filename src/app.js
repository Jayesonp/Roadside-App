import express from 'express';
import compression from 'compression';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import configurations and middleware
import { config, validateConfig } from './config/index.js';
import { testConnection } from './config/database.js';
import logger from './utils/logger.js';

// Import middleware
import { rateLimiter, corsOptions, helmetConfig } from './middleware/security.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Import routes
import routes from './routes/index.js';
import { specs } from './docs/swagger.js';

// Validate configuration
validateConfig();

const app = express();

// Trust proxy (important for rate limiting and logging)
app.set('trust proxy', 1);

// Security middleware
app.use(helmetConfig);
app.use(corsOptions);
app.use(rateLimiter);

// Compression middleware
app.use(compression());

// Logging middleware
if (config.nodeEnv !== 'test') {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from root directory (for the frontend)
app.use(express.static(join(__dirname, '..')));

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Task Management API Documentation'
}));

// API routes
app.use(`/api/${config.api.version}`, routes);

// Serve index.html for frontend routes (SPA support)
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '..', 'index.html'));
});

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Test database connection on startup
testConnection();

export default app;