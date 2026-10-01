import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { WhatsAppService } from '../../core/services/whatsapp.service';
import { PRIVACY, SHIPPING_RETURNS } from '../../content/help-content';
import { Icon } from '../../shared/icon/icon';

const PAGES = { shipping: SHIPPING_RETURNS, privacy: PRIVACY };

/** Renders a policy page from help-content.ts. The page is chosen by route data. */
@Component({
  selector: 'app-policy',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './policy.scss',
  template: `
    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">Help</span>
        <h1>{{ content().title }}</h1>
        <p>{{ content().intro }}</p>
      </div>
    </section>

    <section class="section">
      <div class="container narrow policy">
        <p class="updated">Last updated: {{ content().updated }}</p>
        @for (section of content().sections; track section.heading) {
          <h2>{{ section.heading }}</h2>
          @for (paragraph of section.paragraphs; track $index) {
            <p>{{ paragraph }}</p>
          }
        }

        <div class="help-cta">
          <h2>Questions?</h2>
          <p>Message us any time and we'll be glad to help.</p>
          <a class="btn btn--whatsapp" [href]="whatsapp.generalLink()" target="_blank" rel="noopener">
            <app-icon name="whatsapp" /> Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  `,
})
export class Policy {
  /** Bound from route data. */
  readonly page = input<keyof typeof PAGES>('shipping');

  protected readonly content = computed(() => PAGES[this.page()]);
  protected readonly whatsapp = inject(WhatsAppService);
}
