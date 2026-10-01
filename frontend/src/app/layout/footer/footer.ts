import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { CatalogService } from '../../core/services/catalog.service';
import { SettingsService } from '../../core/services/settings.service';
import { WhatsAppService } from '../../core/services/whatsapp.service';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, AsyncPipe, Icon],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  protected readonly settings = inject(SettingsService);
  protected readonly whatsapp = inject(WhatsAppService);
  protected readonly categories$ = inject(CatalogService)
    .getCategories()
    .pipe(catchError(() => of([])));
  protected readonly year = new Date().getFullYear();
}
