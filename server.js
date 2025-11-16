const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all origins (adjust as needed for production)
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON bodies
app.use(express.json());

// Proxy all /api requests to the backend server
app.use('/api', createProxyMiddleware({
  target: 'http://212.220.105.29:8079',
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    // Log the proxied request
    console.log(`[PROXY] ${req.method} ${req.url} -> ${proxyReq.path}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    // Log the response
    console.log(`[RESPONSE] ${proxyRes.statusCode} ${req.url}`);
  },
  onError: (err, req, res) => {
    console.error('[PROXY ERROR]', err.message);
    res.status(500).json({ 
      error: 'Proxy error', 
      message: err.message 
    });
  }
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Proxy server is running',
    target: 'http://212.220.105.29:8079'
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Proxy server running on http://localhost:${PORT}`);
  console.log(`📡 Proxying requests to: http://212.220.105.29:8079`);
  console.log(`✅ CORS enabled for: http://localhost:3000\n`);
});
