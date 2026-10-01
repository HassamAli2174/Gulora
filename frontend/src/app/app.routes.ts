import { Routes } from '@angular/router';
import { FAQ_JSON_LD } from './content/help-content';
import { storeGuard } from './core/guards/store.guard';

// `title` + `data.description` feed the page title, link previews and search results
// (see core/seo-title.strategy.ts). Product pages set their own from product data.
export const routes: Routes = [
  {
    path: '',
    title: 'Gulora | Herbs & Jewels - Herbal Hair, Skin & Body Care',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'shop',
    title: 'Shop Herbal Shampoo, Serum & Soap | Gulora',
    data: {
      description:
        'Shop the Gulora collection: Herbal Shampoo with 25+ herbs, Skin Care Serum and handmade herbal soaps. Order easily on WhatsApp.',
    },
    loadComponent: () => import('./pages/shop/shop').then((m) => m.Shop),
  },
  {
    path: 'product/:slug',
    loadComponent: () => import('./pages/product-detail/product-detail').then((m) => m.ProductDetail),
  },
  {
    path: 'about',
    title: 'Our Story | Gulora',
    data: {
      description:
        'Gulora blends traditional herbs like amla, reetha and shikakai into gentle, small-batch hair, skin and body care.',
    },
    loadComponent: () => import('./pages/about/about').then((m) => m.About),
  },
  {
    path: 'contact',
    title: 'Contact | Gulora',
    data: { description: 'Get in touch with Gulora on WhatsApp for orders, product advice and delivery questions.' },
    loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact),
  },
  {
    path: 'faq',
    title: 'FAQ | Gulora',
    data: {
      description: 'Answers to common questions about ordering, delivery, payment and Gulora products.',
      jsonLd: FAQ_JSON_LD,
    },
    loadComponent: () => import('./pages/faq/faq').then((m) => m.Faq),
  },
  {
    path: 'shipping-returns',
    title: 'Shipping & Returns | Gulora',
    data: { page: 'shipping', description: 'How Gulora orders are confirmed and delivered, and what to do if something is wrong.' },
    loadComponent: () => import('./pages/policy/policy').then((m) => m.Policy),
  },
  {
    path: 'privacy',
    title: 'Privacy Policy | Gulora',
    data: { page: 'privacy', description: 'How Gulora collects and uses your information.' },
    loadComponent: () => import('./pages/policy/policy').then((m) => m.Policy),
  },

  // ---- Store-only routes: enabled with STORE_ENABLED=true ----
  {
    path: 'cart',
    title: 'Your Bag | Gulora',
    canMatch: [storeGuard],
    loadComponent: () => import('./pages/cart/cart').then((m) => m.Cart),
  },

  {
    path: '**',
    title: 'Page not found | Gulora',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
