import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { Product } from '../../core/models/catalog.model';
import { CartService } from '../../core/services/cart.service';
import { CatalogService } from '../../core/services/catalog.service';
import { SettingsService } from '../../core/services/settings.service';
import { WhatsAppService } from '../../core/services/whatsapp.service';
import { Icon } from '../../shared/icon/icon';
import { PricePipe } from '../../shared/price.pipe';
import { ProductCard } from '../../shared/product-card/product-card';

type Load = { status: 'loading' } | { status: 'not-found' } | { status: 'ready'; product: Product };

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, Icon, PricePipe, ProductCard],
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
    const title = inject(Title);
    const meta = inject(Meta);

    // Reset selections and update the page title whenever the product changes.
    effect(() => {
      const p = this.product();
      this.variantId.set(null);
      this.activeImage.set(null);
      this.quantity.set(1);
      if (p) {
        title.setTitle(`${p.name} | Gulora`);
        meta.updateTag({ name: 'description', content: p.shortDescription });
      } else if (this.status() === 'not-found') {
        title.setTitle('Product not found | Gulora');
      }
    });
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
