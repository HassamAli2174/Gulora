import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WhatsAppService } from '../../core/services/whatsapp.service';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-whatsapp-fab',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="fab" [href]="whatsapp.generalLink()" target="_blank" rel="noopener" aria-label="Chat with Gulora on WhatsApp">
      <app-icon name="whatsapp" />
      <span class="fab__label">Chat with us</span>
    </a>
  `,
  styles: `
    .fab {
      position: fixed;
      right: 20px;
      bottom: 20px;
      z-index: 60;
      display: flex;
      align-items: center;
      gap: 10px;
      height: 58px;
      padding: 0 17px;
      border-radius: 29px;
      background: var(--color-whatsapp);
      color: #fff;
      box-shadow: 0 10px 30px rgba(37, 211, 102, 0.4);
      transition: transform 0.3s var(--ease), background-color 0.2s ease;

      &::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        border: 2px solid var(--color-whatsapp);
        animation: pulse 2.4s ease-out infinite;
      }

      &:hover {
        transform: translateY(-3px);
        background: var(--color-whatsapp-hover);
      }

      app-icon {
        width: 26px;
        height: 26px;
      }
    }

    .fab__label {
      max-width: 0;
      overflow: hidden;
      white-space: nowrap;
      font-size: 0.85rem;
      font-weight: 500;
      transition: max-width 0.4s var(--ease);
    }

    .fab:hover .fab__label {
      max-width: 120px;
    }

    @keyframes pulse {
      0% { transform: scale(1); opacity: 0.7; }
      100% { transform: scale(1.35); opacity: 0; }
    }
  `,
})
export class WhatsAppFab {
  protected readonly whatsapp = inject(WhatsAppService);
}
