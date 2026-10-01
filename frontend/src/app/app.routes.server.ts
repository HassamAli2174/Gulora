import { RenderMode, ServerRoute } from '@angular/ssr';
import { products } from './server/local-api';

/**
 * Which pages are prerendered to static HTML at build time (fast, and link
 * previews / search engines see real content) and which render in the browser.
 */
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'shop', renderMode: RenderMode.Prerender },
  {
    path: 'product/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => products.map((p) => ({ slug: p.slug })),
  },
  { path: 'about', renderMode: RenderMode.Prerender },
  { path: 'contact', renderMode: RenderMode.Prerender },
  { path: 'faq', renderMode: RenderMode.Prerender },
  { path: 'shipping-returns', renderMode: RenderMode.Prerender },
  { path: 'privacy', renderMode: RenderMode.Prerender },
  // Personal / dynamic pages render in the browser only.
  { path: 'cart', renderMode: RenderMode.Client },
  { path: '**', renderMode: RenderMode.Client },
];
