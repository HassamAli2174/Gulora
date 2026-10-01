import { HttpParams } from '@angular/common/http';
// The backend's catalogue files are the single source of truth for products.
import categoriesData from '../../../../backend/src/data/categories.json';
import productsData from '../../../../backend/src/data/products.json';
import { LocalApiHandler } from '../core/api';
import { Category, Product } from '../core/models/catalog.model';
import { DEFAULT_SETTINGS, SiteSettings } from '../core/models/settings.model';

const categories = [...(categoriesData as Category[])].sort((a, b) => a.sortOrder - b.sortOrder);
export const products = (productsData as Product[]).filter((p) => p.active);

const env: Record<string, string | undefined> =
  (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env ?? {};
const flag = (value: string | undefined, fallback: boolean) =>
  value ? ['true', '1', 'yes'].includes(value.toLowerCase()) : fallback;

/** Mirrors backend/src/config.ts so prerendered pages match what the API returns. */
const settings: SiteSettings = {
  ...DEFAULT_SETTINGS,
  whatsappNumber: (env['WHATSAPP_NUMBER'] || DEFAULT_SETTINGS.whatsappNumber).replace(/\D/g, ''),
  storeEnabled: flag(env['STORE_ENABLED'], DEFAULT_SETTINGS.storeEnabled),
  showPrices: flag(env['SHOW_PRICES'], DEFAULT_SETTINGS.showPrices),
  currency: env['CURRENCY'] || DEFAULT_SETTINGS.currency,
  defaultTheme: env['DEFAULT_THEME'] || DEFAULT_SETTINGS.defaultTheme,
  social: {
    instagram: env['INSTAGRAM_URL'] || DEFAULT_SETTINGS.social.instagram,
    facebook: env['FACEBOOK_URL'] || DEFAULT_SETTINGS.social.facebook,
    email: env['CONTACT_EMAIL'] || DEFAULT_SETTINGS.social.email,
  },
};

/** Answers the same GET routes as the Express API, used while prerendering. */
export const localApi: LocalApiHandler = (path: string, params: HttpParams) => {
  if (path === '/settings') return settings;
  if (path === '/categories') return categories;
  if (path === '/products') {
    const category = params.get('category');
    const featured = params.get('featured');
    return products.filter(
      (p) =>
        (!category || p.categoryId === category) &&
        (featured === null || p.featured === (featured === 'true')),
    );
  }
  const slug = /^\/products\/([^/]+)$/.exec(path)?.[1];
  return slug ? products.find((p) => p.slug === decodeURIComponent(slug)) : undefined;
};

/** Public URL used for absolute links in share previews. Netlify sets URL at build time. */
export const siteUrl = env['SITE_URL'] || env['URL'] || 'https://gulora.netlify.app';
