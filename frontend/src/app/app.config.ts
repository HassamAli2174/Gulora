import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  provideClientHydration,
  withEventReplay,
  withHttpTransferCacheOptions,
} from '@angular/platform-browser';
import {
  TitleStrategy,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';

import { routes } from './app.routes';
import { localApiInterceptor } from './core/api';
import { SeoTitleStrategy } from './core/seo-title.strategy';
import { SeoService } from './core/services/seo.service';
import { SettingsService } from './core/services/settings.service';
import { ThemeService } from './core/services/theme.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withFetch(), withInterceptors([localApiInterceptor])),
    // Pages are prerendered at build time; the browser reuses the prerendered
    // catalogue data, but always fetches fresh site settings.
    provideClientHydration(
      withEventReplay(),
      withHttpTransferCacheOptions({ filter: (req) => !req.url.endsWith('/settings') }),
    ),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
    ),
    { provide: TitleStrategy, useClass: SeoTitleStrategy },
    // Load site settings (WhatsApp number, store mode, theme...) before the app renders.
    provideAppInitializer(async () => {
      const settings = inject(SettingsService);
      const theme = inject(ThemeService);
      const seo = inject(SeoService);
      await settings.load();
      const s = settings.settings();
      theme.setTheme(s.defaultTheme);
      seo.setJsonLd('ld-org', {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: `${s.brandName} - ${s.tagline}`,
        url: seo.absolute('/'),
        logo: seo.absolute('/brand/generated/icon-512.png'),
        sameAs: [s.social.instagram, s.social.facebook].filter(Boolean),
        contactPoint: s.whatsappNumber
          ? { '@type': 'ContactPoint', telephone: `+${s.whatsappNumber}`, contactType: 'customer service' }
          : undefined,
      });
    }),
  ],
};
