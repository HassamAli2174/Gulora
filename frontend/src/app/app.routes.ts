import { Routes } from '@angular/router';
import { storeGuard } from './core/guards/store.guard';

export const routes: Routes = [
  {
    path: '',
    title: 'Gulora | Herbs & Jewels',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'shop',
    title: 'Shop | Gulora',
    loadComponent: () => import('./pages/shop/shop').then((m) => m.Shop),
  },
  {
    path: 'product/:slug',
    loadComponent: () => import('./pages/product-detail/product-detail').then((m) => m.ProductDetail),
  },
  {
    path: 'about',
    title: 'Our Story | Gulora',
    loadComponent: () => import('./pages/about/about').then((m) => m.About),
  },
  {
    path: 'contact',
    title: 'Contact | Gulora',
    loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact),
  },

  // ---- Store-only routes: enabled with STORE_ENABLED=true in backend/.env ----
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
