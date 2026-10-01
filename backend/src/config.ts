import 'dotenv/config';

const bool = (value: string | undefined, fallback = false) =>
  value === undefined || value === '' ? fallback : ['true', '1', 'yes'].includes(value.toLowerCase());

export const config = {
  port: Number(process.env.PORT ?? 3000),
  corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:4200')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),

  site: {
    brandName: 'Gulora',
    tagline: 'Herbs & Jewels',
    // The public business number is the default so hosted deployments work without extra setup.
    whatsappNumber: (process.env.WHATSAPP_NUMBER || '923712331745').replace(/\D/g, ''),
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
