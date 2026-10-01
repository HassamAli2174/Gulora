import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SettingsService } from '../../core/services/settings.service';
import { WhatsAppService } from '../../core/services/whatsapp.service';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, Icon],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact {
  protected readonly settings = inject(SettingsService);
  protected readonly whatsapp = inject(WhatsAppService);

  protected readonly form = inject(NonNullableFormBuilder).group({
    name: ['', Validators.required],
    topic: ['Placing an order'],
    message: ['', Validators.required],
  });

  protected readonly topics = ['Placing an order', 'Product question', 'Wholesale / bulk', 'Something else'];

  /** Sends the form as a pre-filled WhatsApp message (no backend needed). */
  protected send() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { name, topic, message } = this.form.getRawValue();
    this.whatsapp.open(this.whatsapp.link(`Hi Gulora! I'm ${name}.\n*${topic}*\n\n${message}`));
  }
}
