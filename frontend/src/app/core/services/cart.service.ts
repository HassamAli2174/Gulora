import { Injectable, computed, effect, signal } from '@angular/core';
import { Product, ProductVariant } from '../models/catalog.model';
import { CartItem } from '../models/order.model';

const CART_KEY = 'gulora-cart';

/** Client-side cart. Only surfaced in the UI when store mode is enabled. */
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly state = signal<CartItem[]>(this.restore());

  readonly items = this.state.asReadonly();
  readonly count = computed(() => this.state().reduce((n, i) => n + i.quantity, 0));
  readonly subtotal = computed(() => this.state().reduce((sum, i) => sum + i.unitPrice * i.quantity, 0));
  readonly isEmpty = computed(() => this.state().length === 0);

  constructor() {
    effect(() => {
      try {
        localStorage.setItem(CART_KEY, JSON.stringify(this.state()));
      } catch {
        /* storage unavailable */
      }
    });
  }

  add(product: Product, variant: ProductVariant, quantity = 1) {
    this.state.update((items) => {
      const existing = items.find((i) => i.variantId === variant.id);
      if (existing) {
        return items.map((i) => (i === existing ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [
        ...items,
        {
          productId: product.id,
          variantId: variant.id,
          slug: product.slug,
          name: product.name,
          variantLabel: variant.label,
          image: variant.image ?? product.images[0],
          unitPrice: variant.price,
          quantity,
        },
      ];
    });
  }

  setQuantity(variantId: string, quantity: number) {
    if (quantity < 1) {
      this.remove(variantId);
      return;
    }
    this.state.update((items) => items.map((i) => (i.variantId === variantId ? { ...i, quantity } : i)));
  }

  remove(variantId: string) {
    this.state.update((items) => items.filter((i) => i.variantId !== variantId));
  }

  clear() {
    this.state.set([]);
  }

  private restore(): CartItem[] {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) ?? '[]') as CartItem[];
    } catch {
      return [];
    }
  }
}
