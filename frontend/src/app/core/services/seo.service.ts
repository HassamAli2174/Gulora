import { DOCUMENT } from '@angular/common';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

/**
 * Public site origin used for absolute URLs in link previews (e.g. https://gulora.netlify.app).
 * In the browser it is the current origin; at build time it comes from the environment.
 */
export const SITE_URL = new InjectionToken<string>('SITE_URL', {
  providedIn: 'root',
  factory: () => inject(DOCUMENT).location?.origin ?? '',
});

export const DEFAULT_DESCRIPTION =
  'Gulora - Herbs & Jewels. Handcrafted herbal shampoo with 25+ herbs, skin care serum and handmade herbal soaps. Order easily on WhatsApp.';
export const DEFAULT_SHARE_IMAGE = '/brand/generated/og-default.jpg';

export interface PageMeta {
  title: string;
  description?: string;
  /** Site-relative or absolute image URL (ideally 1200x630). */
  image?: string;
  /** Site-relative path of the page, e.g. /product/herbal-shampoo */
  path?: string;
  type?: 'website' | 'product';
}

/** Sets the title, description, Open Graph / Twitter tags, canonical URL and JSON-LD. */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly siteUrl = inject(SITE_URL).replace(/\/$/, '');

  absolute(url: string): string {
    return /^https?:\/\//.test(url) ? url : `${this.siteUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  }

  update(page: PageMeta) {
    const description = page.description ?? DEFAULT_DESCRIPTION;
    const image = this.absolute(page.image ?? DEFAULT_SHARE_IMAGE);
    const url = this.absolute((page.path ?? '/').split(/[?#]/)[0]);

    this.title.setTitle(page.title);
    const tags: Record<string, string> = {
      description,
      'og:title': page.title,
      'og:description': description,
      'og:image': image,
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:url': url,
      'og:type': page.type === 'product' ? 'product' : 'website',
      'og:site_name': 'Gulora',
      'twitter:card': 'summary_large_image',
      'twitter:title': page.title,
      'twitter:description': description,
      'twitter:image': image,
    };
    for (const [key, content] of Object.entries(tags)) {
      const attr = key.startsWith('og:') ? 'property' : 'name';
      this.meta.updateTag({ [attr]: key, content }, `${attr}="${key}"`);
    }
    this.setCanonical(url);
  }

  /** Adds, replaces or (with `null`) removes a JSON-LD block identified by `id`. */
  setJsonLd(id: string, data: object | null) {
    let script = this.document.getElementById(id);
    if (!data) {
      script?.remove();
      return;
    }
    if (!script) {
      script = this.document.createElement('script');
      script.id = id;
      script.setAttribute('type', 'application/ld+json');
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data).replace(/</g, '\\u003c');
  }

  private setCanonical(url: string) {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
