import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../core/models/catalog.model';
import { CartService } from '../../core/services/cart.service';
import { SettingsService } from '../../core/services/settings.service';
import { WhatsAppService } from '../../core/services/whatsapp.service';
import { Icon } from '../icon/icon';
import { PricePipe } from '../price.pipe';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, Icon, PricePipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCard {
  readonly product = input.required<Product>();
  readonly categoryName = input<string>('');

  protected readonly settings = inject(SettingsService);
  private readonly cart = inject(CartService);
  private readonly whatsapp = inject(WhatsAppService);

  protected readonly fromPrice = computed(() => {
    const prices = this.product().variants.map((v) => v.price).filter((p) => p > 0);
    return prices.length ? Math.min(...prices) : 0;
  });
  protected readonly sizes = computed(() => this.product().variants.map((v) => v.label).join(' · '));
  protected readonly whatsappLink = computed(() =>
    this.whatsapp.productLink(this.product(), this.product().variants[0]),
  );

  protected addToCart() {
    const variant = this.product().variants[0];
    if (variant) this.cart.add(this.product(), variant);
  }
}
