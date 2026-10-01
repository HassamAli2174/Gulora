import { Pipe, PipeTransform, inject } from '@angular/core';
import { SettingsService } from '../core/services/settings.service';

/** Formats a price in the store currency. A price of 0 means "not priced yet". */
@Pipe({ name: 'price' })
export class PricePipe implements PipeTransform {
  private readonly settings = inject(SettingsService);

  transform(value: number | null | undefined): string {
    if (!value) return 'Price on request';
    const currency = this.settings.settings().currency;
    try {
      return new Intl.NumberFormat('en', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);
    } catch {
      return `${currency} ${value.toLocaleString()}`;
    }
  }
}
