import { DOCUMENT } from '@angular/common';
import { Injectable, computed, effect, inject, signal } from '@angular/core';

export type ColorMode = 'light' | 'dark' | 'system';

/** Brand themes defined in src/styles/_themes.scss. */
export const THEMES = ['blush', 'herbal'] as const;
export type ThemeName = (typeof THEMES)[number];

const MODE_KEY = 'gulora-mode';
const THEME_KEY = 'gulora-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly media = this.document.defaultView?.matchMedia('(prefers-color-scheme: dark)');
  private readonly systemDark = signal(this.media?.matches ?? false);

  readonly mode = signal<ColorMode>(this.read(MODE_KEY, ['light', 'dark', 'system'], 'system'));
  readonly theme = signal<ThemeName>(this.read(THEME_KEY, THEMES, 'blush'));
  readonly isDark = computed(() => this.mode() === 'dark' || (this.mode() === 'system' && this.systemDark()));

  constructor() {
    this.media?.addEventListener('change', (e) => this.systemDark.set(e.matches));

    effect(() => {
      const root = this.document.documentElement;
      root.setAttribute('data-theme', this.theme());
      if (this.isDark()) {
        root.setAttribute('data-mode', 'dark');
      } else {
        root.removeAttribute('data-mode');
      }
      const bg = getComputedStyle(root).getPropertyValue('--color-bg').trim();
      this.document.querySelector('meta[name="theme-color"]')?.setAttribute('content', bg);
      this.write(MODE_KEY, this.mode());
      this.write(THEME_KEY, this.theme());
    });
  }

  toggleMode() {
    this.mode.set(this.isDark() ? 'light' : 'dark');
  }

  setTheme(name: string) {
    if ((THEMES as readonly string[]).includes(name)) {
      this.theme.set(name as ThemeName);
    }
  }

  private read<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
    try {
      const value = localStorage.getItem(key) as T | null;
      return value && allowed.includes(value) ? value : fallback;
    } catch {
      return fallback;
    }
  }

  private write(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* storage unavailable (private mode) */
    }
  }
}
