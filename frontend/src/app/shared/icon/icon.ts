import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type IconName =
  | 'leaf'
  | 'root'
  | 'sparkle'
  | 'drop'
  | 'heart'
  | 'hand'
  | 'whatsapp'
  | 'sun'
  | 'moon'
  | 'bag'
  | 'menu'
  | 'close'
  | 'arrow-right'
  | 'instagram'
  | 'facebook'
  | 'mail'
  | 'plus'
  | 'minus'
  | 'trash'
  | 'check';

/** Lightweight inline SVG icon set: no icon font, inherits currentColor. */
@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  styles: `
    :host { display: inline-block; width: 1.25em; height: 1.25em; flex-shrink: 0; line-height: 0; }
    svg { width: 100%; height: 100%; }
  `,
  template: `
    @switch (name()) {
      @case ('whatsapp') {
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.5h-.01a9.46 9.46 0 0 1-4.82-1.32l-.35-.2-3.58.93.96-3.49-.23-.36a9.44 9.44 0 0 1-1.45-5.03c0-5.22 4.25-9.47 9.48-9.47a9.4 9.4 0 0 1 6.7 2.78 9.4 9.4 0 0 1 2.77 6.7c0 5.22-4.25 9.46-9.47 9.46zm8.06-17.53A11.32 11.32 0 0 0 12.05.64C5.77.64.66 5.75.66 12.03c0 2 .52 3.97 1.52 5.7L.56 23.64l6.04-1.58a11.4 11.4 0 0 0 5.45 1.39h.01c6.27 0 11.38-5.11 11.39-11.39 0-3.04-1.19-5.9-3.34-8.06z"/>
        </svg>
      }
      @default {
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          @switch (name()) {
            @case ('leaf') {
              <path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14"/><path d="M5 19c3-4 6-7 10-9"/>
            }
            @case ('root') {
              <path d="M12 3v9"/><path d="M12 12c-3 0-5 2-6 5"/><path d="M12 12c3 0 5 2 6 5"/><path d="M12 12v8"/><path d="M9 8c-2-1-3-2-3-4 2 0 3 1 3 4z"/><path d="M15 8c2-1 3-2 3-4-2 0-3 1-3 4z"/>
            }
            @case ('sparkle') {
              <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z"/>
            }
            @case ('drop') {
              <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5"/>
            }
            @case ('heart') {
              <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>
            }
            @case ('hand') {
              <path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11"/><path d="M11 10.5V4.5a1.5 1.5 0 0 1 3 0V11"/><path d="M14 10.5V6a1.5 1.5 0 0 1 3 0v7c0 4-2.5 7-6.5 7S5 17.5 4 15l-1-2.2a1.5 1.5 0 0 1 2.6-1.4L8 14"/>
            }
            @case ('sun') {
              <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>
            }
            @case ('moon') {
              <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>
            }
            @case ('bag') {
              <path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>
            }
            @case ('menu') {
              <path d="M4 7h16M4 12h16M4 17h10"/>
            }
            @case ('close') {
              <path d="M6 6l12 12M18 6L6 18"/>
            }
            @case ('arrow-right') {
              <path d="M5 12h14M13 6l6 6-6 6"/>
            }
            @case ('instagram') {
              <rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".6" fill="currentColor"/>
            }
            @case ('facebook') {
              <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"/>
            }
            @case ('mail') {
              <rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>
            }
            @case ('plus') {
              <path d="M12 5v14M5 12h14"/>
            }
            @case ('minus') {
              <path d="M5 12h14"/>
            }
            @case ('trash') {
              <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>
            }
            @case ('check') {
              <path d="M5 12.5l4.5 4.5L19 7.5"/>
            }
          }
        </svg>
      }
    }
  `,
})
export class Icon {
  readonly name = input.required<IconName>();
}
