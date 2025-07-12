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
  
  // Disable caching for development
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  next();
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
  res.status(500).send('Internal Server Error');
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚗 RoadSide+ Emergency App running at http://localhost:${PORT}`);
  console.log(`📱 Preview available at: http://localhost:${PORT}`);
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