import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WhatsAppService } from '../../core/services/whatsapp.service';
import { Icon, IconName } from '../../shared/icon/icon';

@Component({
  selector: 'app-about',
  imports: [RouterLink, Icon],
  templateUrl: './about.html',
  styleUrl: './about.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  protected readonly whatsapp = inject(WhatsAppService);

  protected readonly values: { icon: IconName; title: string; text: string }[] = [
    {
      icon: 'leaf',
      title: 'Herbs first',
      text: 'We build every formula around traditional herbs like amla, reetha and shikakai.',
    },
    {
      icon: 'hand',
      title: 'Small batches',
      text: 'Everything is made in small batches so each bottle and bar gets proper care.',
    },
    {
      icon: 'sparkle',
      title: 'Crafted like jewels',
      text: 'Thoughtful details, from pressed leaf motifs to packaging we are proud of.',
    },
  ];
}
