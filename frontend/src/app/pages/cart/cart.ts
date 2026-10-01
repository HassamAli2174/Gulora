import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Order } from '../../core/models/order.model';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { SettingsService } from '../../core/services/settings.service';
import { WhatsAppService } from '../../core/services/whatsapp.service';
import { Icon } from '../../shared/icon/icon';
import { PricePipe } from '../../shared/price.pipe';
import { ResponsiveImg } from '../../shared/responsive-img';

/**
 * Store-mode cart & checkout. Orders are saved via the API, then the customer
 * confirms on WhatsApp. Swap the confirmation step for a payment gateway later.
 */
@Component({
  selector: 'app-cart',
  imports: [RouterLink, ReactiveFormsModule, Icon, PricePipe, ResponsiveImg],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cart {
  protected readonly cart = inject(CartService);
  protected readonly settings = inject(SettingsService);
  private readonly orders = inject(OrderService);
  private readonly whatsapp = inject(WhatsAppService);

  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly placed = signal<{ order: Order; whatsappLink: string } | null>(null);

  protected readonly form = inject(NonNullableFormBuilder).group({
    name: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^[+\d\s-]{7,}$/)]],
    address: ['', Validators.required],
    city: ['', Validators.required],
    notes: [''],
  });

  protected checkout() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const items = this.cart.items();
    this.submitting.set(true);
    this.error.set(null);

    this.orders
      .placeOrder({
        customer: this.form.getRawValue(),
        items: items.map(({ productId, variantId, quantity }) => ({ productId, variantId, quantity })),
      })
      .subscribe({
        next: (order) => {
          this.placed.set({ order, whatsappLink: this.whatsapp.orderLink(items, order) });
          this.cart.clear();
          this.form.reset();
          this.submitting.set(false);
        },
        error: (err: HttpErrorResponse) => {
          this.error.set(err.error?.message ?? 'Could not place your order. Please try again.');
          this.submitting.set(false);
        },
      });
  }
}
