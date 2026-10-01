import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { CatalogService } from '../../core/services/catalog.service';
import { WhatsAppService } from '../../core/services/whatsapp.service';
import { Icon, IconName } from '../../shared/icon/icon';
import { ProductCard } from '../../shared/product-card/product-card';

@Component({
  selector: 'app-home',
  imports: [RouterLink, Icon, ProductCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private readonly catalog = inject(CatalogService);
  protected readonly whatsapp = inject(WhatsAppService);

  protected readonly products = toSignal(
    this.catalog.getProducts({ featured: true }).pipe(catchError(() => of(null))),
  );
  protected readonly categories = toSignal(this.catalog.getCategories().pipe(catchError(() => of([]))), {
    initialValue: [],
  });
  protected readonly categoryName = computed(() => {
    const map = new Map(this.categories().map((c) => [c.id, c.name]));
    return (id: string) => map.get(id) ?? '';
  });

  /** WhatsApp link for the shampoo tester, if it exists in the catalogue. */
  protected readonly testerLink = computed(() => {
    const shampoo = this.products()?.find((p) => p.slug === 'herbal-shampoo');
    const tester = shampoo?.variants.find((v) => v.label.toLowerCase().includes('tester'));
    return shampoo && tester ? this.whatsapp.productLink(shampoo, tester) : this.whatsapp.generalLink();
  });

  protected readonly promises: { icon: IconName; title: string; text: string }[] = [
    { icon: 'leaf', title: '25+ Herbs', text: 'Amla, reetha, shikakai and more in every bottle.' },
    { icon: 'hand', title: 'Handmade', text: 'Crafted in small batches with care.' },
    { icon: 'heart', title: 'Gentle Daily', text: 'Kind enough for everyday rituals.' },
    { icon: 'whatsapp', title: 'Easy Ordering', text: 'Just send us a message on WhatsApp.' },
  ];
}
