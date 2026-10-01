import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { Product } from '../../core/models/catalog.model';
import { CatalogService } from '../../core/services/catalog.service';
import { ProductCard } from '../../shared/product-card/product-card';

type Load = { status: 'loading' } | { status: 'error' } | { status: 'ready'; products: Product[] };

@Component({
  selector: 'app-shop',
  imports: [RouterLink, ProductCard],
  templateUrl: './shop.html',
  styleUrl: './shop.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shop {
  private readonly catalog = inject(CatalogService);

  /** Bound from the ?category= query parameter. */
  readonly category = input<string | undefined>();

  protected readonly categories = toSignal(this.catalog.getCategories().pipe(catchError(() => of([]))), {
    initialValue: [],
  });

  protected readonly state = toSignal(
    toObservable(this.category).pipe(
      switchMap((category) =>
        this.catalog.getProducts({ category }).pipe(
          map((products): Load => ({ status: 'ready', products })),
          catchError(() => of<Load>({ status: 'error' })),
          startWith<Load>({ status: 'loading' }),
        ),
      ),
    ),
    { initialValue: { status: 'loading' } as Load },
  );

  protected readonly products = computed(() => {
    const state = this.state();
    return state.status === 'ready' ? state.products : [];
  });
  protected readonly activeCategory = computed(() => this.categories().find((c) => c.id === this.category()));
  protected readonly categoryName = computed(() => {
    const names = new Map(this.categories().map((c) => [c.id, c.name]));
    return (id: string) => names.get(id) ?? '';
  });
}
