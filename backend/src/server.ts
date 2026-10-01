import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { app } from './app.js';
import { config } from './config.js';

const backendDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const uploadsDir = path.join(backendDir, 'uploads');
const frontendDist = path.resolve(backendDir, '..', 'frontend', 'dist', 'frontend', 'browser');

// Product images (later: uploaded from an admin panel or moved to a CDN).
app.use('/uploads', express.static(uploadsDir, { maxAge: '7d' }));

// Serve the built Angular app when it exists, so one server can host everything.
// Prerendered pages are real files (e.g. /shop/index.html); other routes fall back to the app shell.
if (existsSync(frontendDist)) {
  const shell = ['index.csr.html', 'index.html']
    .map((f) => path.join(frontendDist, f))
    .find((f) => existsSync(f))!;
  app.use(express.static(frontendDist, { extensions: ['html'] }));
  app.get('*', (_req, res) => {
    res.sendFile(shell);
  });
}

app.listen(config.port, () => {
  console.log(`Gulora API running on http://localhost:${config.port}`);
  console.log(`Store mode: ${config.site.storeEnabled ? 'ON' : 'OFF (showcase)'}`);
});
