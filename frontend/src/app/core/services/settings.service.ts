import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { catchError, firstValueFrom, of } from 'rxjs';
import { API_BASE } from '../api';
import { DEFAULT_SETTINGS, SiteSettings } from '../models/settings.model';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly http = inject(HttpClient);
  private readonly state = signal<SiteSettings>(DEFAULT_SETTINGS);

  readonly settings = this.state.asReadonly();
  readonly storeEnabled = computed(() => this.state().storeEnabled);
  readonly showPrices = computed(() => this.state().showPrices);

  /** Called once at startup (see app.config.ts). Never fails: falls back to defaults. */
  async load(): Promise<void> {
    const remote = await firstValueFrom(
      this.http.get<Partial<SiteSettings>>(`${API_BASE}/settings`).pipe(catchError(() => of({}))),
    );
    this.state.set({ ...DEFAULT_SETTINGS, ...remote });
  }
}
