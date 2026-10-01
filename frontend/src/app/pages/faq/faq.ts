import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WhatsAppService } from '../../core/services/whatsapp.service';
import { FAQ } from '../../content/help-content';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-faq',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: '../policy/policy.scss',
  template: `
    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">Help</span>
        <h1>Frequently asked questions</h1>
        <p>Quick answers about ordering, delivery and our products.</p>
      </div>
    </section>

    <section class="section">
      <div class="container narrow">
        @for (item of faq; track item.question; let first = $first) {
          <details class="accordion" [open]="first">
            <summary>{{ item.question }}</summary>
            <p>{{ item.answer }}</p>
          </details>
        }

        <div class="help-cta">
          <h2>Still have a question?</h2>
          <p>We're happy to help. See also our <a routerLink="/shipping-returns">shipping &amp; returns</a> policy.</p>
          <a class="btn btn--whatsapp" [href]="whatsapp.generalLink()" target="_blank" rel="noopener">
            <app-icon name="whatsapp" /> Ask us on WhatsApp
          </a>
        </div>
      </div>
    </section>
  `,
})
export class Faq {
  protected readonly faq = FAQ;
  protected readonly whatsapp = inject(WhatsAppService);
}
