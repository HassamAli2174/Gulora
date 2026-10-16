// Runs after the Angular build for static hosting (Netlify):
//  - writes sitemap.xml and robots.txt
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'frontend', 'dist', 'frontend', 'browser');
const siteUrl = (process.env.SITE_URL || process.env.URL || 'https://gulora.netlify.app').replace(/\/$/, '');

const products = JSON.parse(readFileSync(path.join(root, 'backend', 'src', 'data', 'products.json'), 'utf8'));
const today = new Date().toISOString().slice(0, 10);
const pages = [
  { path: '/', priority: '1.0' },
  { path: '/shop', priority: '0.9' },
  ...products.filter((p) => p.active).map((p) => ({ path: `/product/${p.slug}`, priority: '0.8' })),
  { path: '/about', priority: '0.6' },
  { path: '/faq', priority: '0.5' },
  { path: '/contact', priority: '0.5' },
  { path: '/shipping-returns', priority: '0.4' },
  { path: '/privacy', priority: '0.2' },
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map((p) => `  <url><loc>${siteUrl}${p.path}</loc><lastmod>${today}</lastmod><priority>${p.priority}</priority></url>`)
  .join('\n')}
</urlset>
`;
writeFileSync(path.join(dist, 'sitemap.xml'), sitemap);
writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /cart\n\nSitemap: ${siteUrl}/sitemap.xml\n`);

console.log(`[postbuild] sitemap.xml written for ${siteUrl} (${pages.length} pages)`);
