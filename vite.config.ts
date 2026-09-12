import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, type Plugin } from 'vite'

let sharedMobileTelemetry: any = null;
let lastPhoneHeartbeat = 0;

function mobileRelayPlugin(): Plugin {
  return {
    name: 'mobile-telemetry-relay',
    configureServer(server) {
      server.middlewares.use('/api/sync-phone', (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }

        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              sharedMobileTelemetry = JSON.parse(body);
              lastPhoneHeartbeat = Date.now();
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({ ok: true, received: Date.now() }));
            } catch (e) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
          });
          return;
        }

        if (req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          const isAlive = (Date.now() - lastPhoneHeartbeat) < 5000;
          res.statusCode = 200;
          res.end(JSON.stringify({
            connected: isAlive && Boolean(sharedMobileTelemetry),
            telemetry: isAlive ? sharedMobileTelemetry : null,
            lastHeartbeat: lastPhoneHeartbeat,
          }));
          return;
        }

        res.statusCode = 404;
        res.end();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), mobileRelayPlugin()],
})

