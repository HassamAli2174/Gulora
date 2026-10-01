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
if (existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

app.listen(config.port, () => {
  console.log(`Gulora API running on http://localhost:${config.port}`);
  console.log(`Store mode: ${config.site.storeEnabled ? 'ON' : 'OFF (showcase)'}`);
});
