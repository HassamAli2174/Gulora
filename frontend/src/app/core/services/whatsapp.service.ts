import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Product, ProductVariant } from '../models/catalog.model';
import { CartItem, Order } from '../models/order.model';
import { SettingsService } from './settings.service';

/** Builds wa.me links. All WhatsApp copy lives here so it is easy to change. */
@Injectable({ providedIn: 'root' })
export class WhatsAppService {
  private readonly settings = inject(SettingsService);
  private readonly document = inject(DOCUMENT);

  link(message: string): string {
    const number = this.settings.settings().whatsappNumber;
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }

  generalLink(): string {
    return this.link(`Hi ${this.settings.settings().brandName}! I'd love to know more about your products.`);
  }

  productLink(product: Product, variant?: ProductVariant, quantity = 1): string {
    const size = variant ? ` (${variant.label})` : '';
    const qty = quantity > 1 ? ` x ${quantity}` : '';
    return this.link(
      `Hi ${this.settings.settings().brandName}! I'd like to order:\n\n` +
        `• *${product.name}*${size}${qty}\n\n` +
        `Please share the price and delivery details.`,
    );
  }

  orderLink(items: CartItem[], order?: Order): string {
    const lines = items.map((i) => `• ${i.name} (${i.variantLabel}) x ${i.quantity}`).join('\n');
    const ref = order ? `\n\nOrder ref: *${order.id}*` : '';
    return this.link(`Hi ${this.settings.settings().brandName}! I'd like to place this order:\n\n${lines}${ref}`);
  }

  open(url: string) {
    this.document.defaultView?.open(url, '_blank', 'noopener');
  }
}
