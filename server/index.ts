// ==============================================================================
// CBAM-AuditTrace Standalone Backend API Server
// Express & HTTP Gateway for Vakh Engine, DB, and Deterministic Engine
// ==============================================================================

import http from 'http';
import { handleApiRequest } from './routes/api.ts';
import { runDatabaseSeed } from './seed_cbam_data.ts';

const PORT = process.env.PORT || 3001;

async function bootstrap() {
  await runDatabaseSeed();

  const server = http.createServer(async (req, res) => {
    // Set CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    const pathname = url.pathname;

    let body: any = null;
    if (req.method === 'POST' || req.method === 'PATCH' || req.method === 'PUT') {
      try {
        const buffers: Buffer[] = [];
        for await (const chunk of req) {
          buffers.push(chunk);
        }
        const rawBody = Buffer.concat(buffers).toString();
        if (rawBody) {
          body = JSON.parse(rawBody);
        }
      } catch (err) {
        console.error('Failed to parse JSON body:', err);
      }
    }

    if (pathname.startsWith('/api/')) {
      const response = await handleApiRequest(req.method || 'GET', pathname, body, url.searchParams);
      res.writeHead(response.status, response.headers || { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(response.data));
      return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  });

  server.listen(PORT, () => {
    console.log(`🚀 [CBAM-AuditTrace Backend] Running on http://localhost:${PORT}`);
    console.log(`📡 Endpoints active:`);
    console.log(`   - GET  /api/vakh/sync`);
    console.log(`   - GET  /api/metrics/:space_id`);
    console.log(`   - PATCH /api/metrics/:metric_id`);
    console.log(`   - POST /api/reports/generate`);
    console.log(`   - POST /api/seed`);
  });
}

bootstrap().catch(console.error);
