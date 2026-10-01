import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { Product } from '../../core/models/catalog.model';
import { CartService } from '../../core/services/cart.service';
import { CatalogService } from '../../core/services/catalog.service';
import { SeoService } from '../../core/services/seo.service';
import { SettingsService } from '../../core/services/settings.service';
import { WhatsAppService } from '../../core/services/whatsapp.service';
import { Icon } from '../../shared/icon/icon';
import { PricePipe } from '../../shared/price.pipe';
import { ProductCard } from '../../shared/product-card/product-card';
import { ResponsiveImg, ogImageUrl, optimizedUrl } from '../../shared/responsive-img';

type Load = { status: 'loading' } | { status: 'not-found' } | { status: 'ready'; product: Product };

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, Icon, PricePipe, ProductCard, ResponsiveImg],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetail {
  private readonly catalog = inject(CatalogService);
  private readonly cart = inject(CartService);
  private readonly whatsapp = inject(WhatsAppService);
  protected readonly settings = inject(SettingsService);

  /** Bound from the :slug route parameter. */
  readonly slug = input.required<string>();

  private readonly state = toSignal(
    toObservable(this.slug).pipe(
      switchMap((slug) =>
        this.catalog.getProduct(slug).pipe(
          map((product): Load => ({ status: 'ready', product })),
          catchError(() => of<Load>({ status: 'not-found' })),
          startWith<Load>({ status: 'loading' }),
        ),
      ),
    ),
    { initialValue: { status: 'loading' } as Load },
  );

  protected readonly status = computed(() => this.state().status);
  protected readonly product = computed(() => {
    const s = this.state();
    return s.status === 'ready' ? s.product : null;
  });

  protected readonly variantId = signal<string | null>(null);
  protected readonly quantity = signal(1);
  protected readonly activeImage = signal<string | null>(null);
  protected readonly added = signal(false);

  protected readonly variant = computed(() => {
    const p = this.product();
    return p?.variants.find((v) => v.id === this.variantId()) ?? p?.variants[0] ?? null;
  });
  protected readonly image = computed(() => this.activeImage() ?? this.variant()?.image ?? this.product()?.images[0]);
  protected readonly whatsappLink = computed(() => {
    const p = this.product();
    return p ? this.whatsapp.productLink(p, this.variant() ?? undefined, this.quantity()) : '';
  });

  private readonly allProducts = toSignal(this.catalog.getProducts().pipe(catchError(() => of([]))), {
    initialValue: [],
  });
  protected readonly related = computed(() => {
    const p = this.product();
    return p ? this.allProducts().filter((o) => o.id !== p.id).slice(0, 3) : [];
  });

  constructor() {
    const seo = inject(SeoService);
    const destroyRef = inject(DestroyRef);
    destroyRef.onDestroy(() => seo.setJsonLd('ld-page', null));

    // Reset selections and update SEO tags whenever the product changes.
    effect(() => {
      const p = this.product();
      this.variantId.set(null);
      this.activeImage.set(null);
      this.quantity.set(1);
      if (p) {
        const path = `/product/${p.slug}`;
        seo.update({
          title: `${p.name} - ${p.subtitle} | Gulora`,
          description: p.shortDescription,
          image: p.images[0] ? ogImageUrl(p.images[0]) : undefined,
          path,
          type: 'product',
        });
        seo.setJsonLd('ld-page', this.productJsonLd(p, seo.absolute(path), seo));
      } else if (this.status() === 'not-found') {
        seo.update({ title: 'Product not found | Gulora', path: `/product/${this.slug()}` });
      }
    });
  }

  /** schema.org Product data so search engines understand the page. Offers are included once prices are set. */
  private productJsonLd(p: Product, url: string, seo: SeoService) {
    const priced = p.variants.filter((v) => v.price > 0);
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: p.name,
      description: p.description,
      image: p.images.map((img) => seo.absolute(optimizedUrl(img, 1200))),
      brand: { '@type': 'Brand', name: 'Gulora' },
      sku: p.variants[0]?.sku,
      url,
      offers: priced.length
        ? priced.map((v) => ({
            '@type': 'Offer',
            sku: v.sku,
            name: v.label,
            price: v.price,
            priceCurrency: this.settings.settings().currency,
            availability: 'https://schema.org/InStock',
            url,
          }))
        : undefined,
    };
  }

  protected selectVariant(id: string) {
    this.variantId.set(id);
    this.activeImage.set(null);
  }

  protected changeQty(delta: number) {
    this.quantity.update((q) => Math.max(1, Math.min(99, q + delta)));
  }

  protected addToCart() {
    const p = this.product();
    const v = this.variant();
    if (!p || !v) return;
    this.cart.add(p, v, this.quantity());
    this.added.set(true);
    setTimeout(() => this.added.set(false), 2000);
  }
}
