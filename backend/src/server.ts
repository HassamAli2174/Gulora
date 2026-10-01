import { existsSync } from 'node:fs';
import path from 'node:path';
import cors from 'cors';
import express, { type ErrorRequestHandler } from 'express';
import { config } from './config.js';
import { catalogRouter } from './routes/catalog.routes.js';
import { orderRouter } from './routes/order.routes.js';

const app = express();

app.use(cors({ origin: config.corsOrigins }));
app.use(express.json({ limit: '100kb' }));

// Product images (later: uploaded from an admin panel or moved to a CDN).
app.use('/uploads', express.static(config.paths.uploads, { maxAge: '7d' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});
app.get('/api/settings', (_req, res) => {
  res.json(config.site);
});
app.use('/api', catalogRouter);
app.use('/api/orders', orderRouter);
app.use('/api', (_req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Serve the built Angular app when it exists, so one server can host everything.
if (existsSync(config.paths.frontendDist)) {
  app.use(express.static(config.paths.frontendDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(config.paths.frontendDist, 'index.html'));
  });
}

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong. Please try again.' });
};
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Gulora API running on http://localhost:${config.port}`);
  console.log(`Store mode: ${config.site.storeEnabled ? 'ON' : 'OFF (showcase)'}`);
  if (!config.site.whatsappNumber) {
    console.warn('WHATSAPP_NUMBER is not set - WhatsApp buttons will not work. See backend/.env.example');
  }
});
