import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { SettingsService } from '../services/settings.service';

/** Store-only routes (cart, checkout...) redirect to the shop while in showcase mode. */
export const storeGuard: CanMatchFn = () =>
  inject(SettingsService).storeEnabled() || inject(Router).parseUrl('/shop');
