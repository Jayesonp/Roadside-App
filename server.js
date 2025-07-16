import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for proper content types
app.use((req, res, next) => {
  // Set proper content types
  if (req.path.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css');
  } else if (req.path.endsWith('.js')) {
    res.setHeader('Content-Type', 'application/javascript');
  }
  
  // Enable CORS for bolt.new
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  
  next();
});

// Parse JSON bodies
app.use(express.json());

// Mock API endpoints for demo purposes
app.use('/api/v1', (req, res, next) => {
  // Simple mock responses for development
  if (req.path === '/health') {
    return res.json({
      success: true,
      message: 'API is healthy (mock)',
      data: {
        timestamp: new Date().toISOString(),
        environment: 'bolt.new-demo'
      }
    });
  }
  
  if (req.path.startsWith('/auth/')) {
    // Mock auth responses
    if (req.method === 'POST' && req.path === '/auth/login') {
      return res.json({
        success: true,
        message: 'Login successful (mock)',
        data: {
          user: {
            id: 'demo-user-id',
            email: req.body.email || 'demo@example.com',
            firstName: 'Demo',
            lastName: 'User',
            role: 'user'
          },
          token: 'mock-jwt-token'
        }
      });
    }
    
    if (req.method === 'POST' && req.path === '/auth/register') {
      return res.json({
        success: true,
        message: 'Registration successful (mock)',
        data: {
          user: {
            id: 'demo-user-id',
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            role: 'user'
          },
          token: 'mock-jwt-token'
        }
      });
    }
  }
  
  // Default mock response for other API calls
  res.json({
    success: true,
    message: 'Mock API response',
    data: {
      endpoint: req.path,
      method: req.method,
      note: 'This is a mock response for bolt.new demo'
    }
  });
});

// Serve static files from current directory
app.use(express.static(__dirname, {
  extensions: ['html', 'htm'],
  index: ['index.html']
}));

// Main route
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

// Handle all other routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚗 RoadSide+ Emergency App (Bolt.new Demo) running at http://localhost:${PORT}`);
  console.log(`📱 Preview available at: http://localhost:${PORT}`);
  console.log(`🔧 Environment: bolt.new development`);
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is busy, trying port ${PORT + 1}...`);
    const newPort = PORT + 1;
    server.listen(newPort, () => {
      console.log(`🚗 RoadSide+ Emergency App running at http://localhost:${newPort}`);
    });
  } else {
    console.error('Server error:', err);
  }
});

export default app;