import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="container nf">
        <span class="nf__mark">✦</span>
        <h1>Page not found</h1>
        <p>The page you're looking for has wandered off into the garden.</p>
        <a routerLink="/" class="btn btn--ink">Back home</a>
      </div>
    </section>
  `,
  styles: `
    .nf { text-align: center; padding-block: 60px; }
    .nf__mark { font-size: 3rem; color: var(--color-accent); }
    p { color: var(--color-text-muted); margin-bottom: 28px; }
  `,
})
export class NotFound {}
