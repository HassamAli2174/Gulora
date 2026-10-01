import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const bool = (value: string | undefined, fallback = false) =>
  value === undefined || value === '' ? fallback : ['true', '1', 'yes'].includes(value.toLowerCase());

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const config = {
  port: Number(process.env.PORT ?? 3000),
  corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:4200')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),

  paths: {
    root: rootDir,
    data: path.join(rootDir, 'src', 'data'),
    uploads: path.join(rootDir, 'uploads'),
    // When the Angular app is built, the API also serves it (single deployment).
    frontendDist: path.resolve(rootDir, '..', 'frontend', 'dist', 'frontend', 'browser'),
  },

  site: {
    brandName: 'Gulora',
    tagline: 'Herbs & Jewels',
    whatsappNumber: (process.env.WHATSAPP_NUMBER ?? '').replace(/\D/g, ''),
    storeEnabled: bool(process.env.STORE_ENABLED),
    showPrices: bool(process.env.SHOW_PRICES),
    currency: process.env.CURRENCY || 'PKR',
    defaultTheme: process.env.DEFAULT_THEME || 'blush',
    social: {
      instagram: process.env.INSTAGRAM_URL || '',
      facebook: process.env.FACEBOOK_URL || '',
      email: process.env.CONTACT_EMAIL || '',
    },
  },
};

export type SiteSettings = typeof config.site;
