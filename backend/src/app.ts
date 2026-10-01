import cors from 'cors';
import express, { Router, type ErrorRequestHandler } from 'express';
import { config } from './config.js';
import { catalogRouter } from './routes/catalog.routes.js';
import { orderRouter } from './routes/order.routes.js';

/**
 * The API as a plain Express app. Used by server.ts (local / Node hosting) and
 * by netlify/functions/api.ts (serverless hosting).
 */
export const app = express();

app.use(cors({ origin: config.corsOrigins }));
app.use(express.json({ limit: '100kb' }));

const api = Router();
api.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});
api.get('/settings', (_req, res) => {
  res.json(config.site);
});
api.use('/orders', orderRouter);
api.use(catalogRouter);
api.use((_req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// On Netlify the function may see either the public path or its internal one.
app.use(['/api', '/.netlify/functions/api'], api);

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong. Please try again.' });
};
app.use(errorHandler);
