import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, type Plugin } from 'vite'
import { handleApiRequest } from './server/routes/api.ts'

function cbamApiPlugin(): Plugin {
  return {
    name: 'cbam-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
        if (url.pathname.startsWith('/api/')) {
          let body: any = null;
          if (req.method === 'POST' || req.method === 'PATCH' || req.method === 'PUT') {
            try {
              const buffers: Buffer[] = [];
              for await (const chunk of req) {
                buffers.push(chunk);
              }
              const raw = Buffer.concat(buffers).toString();
              if (raw) body = JSON.parse(raw);
            } catch (err) {
              console.error('Failed to parse API body in Vite:', err);
            }
          }

          const response = await handleApiRequest(req.method || 'GET', url.pathname, body, url.searchParams);
          res.statusCode = response.status;
          if (response.headers) {
            for (const [k, v] of Object.entries(response.headers)) {
              res.setHeader(k, String(v));
            }
          }
          res.end(JSON.stringify(response.data));
          return;
        }
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react(), cbamApiPlugin()],
})


