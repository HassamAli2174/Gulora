import { Directive, computed, input } from '@angular/core';

/** Must match WIDTHS in scripts/optimize-images.mjs */
const WIDTHS = [480, 800, 1200];
const PRODUCT_IMAGE = /^\/uploads\/products\/([^/]+)\.(?:jpe?g|png)$/i;

/** Maps an original product image URL to its generated WebP variant. */
export function optimizedUrl(url: string, width = 800): string {
  const match = PRODUCT_IMAGE.exec(url);
  return match ? `/uploads/optimized/${match[1]}-${width}.webp` : url;
}

/** Share-image (1200x630 JPEG) for a product photo, used for link previews. */
export function ogImageUrl(url: string): string {
  const match = PRODUCT_IMAGE.exec(url);
  return match ? `/uploads/optimized/og/${match[1]}.jpg` : url;
}

/**
 * <img [appImg]="product.images[0]" sizes="(max-width: 600px) 100vw, 400px">
 * Serves optimised, responsive WebP versions of product photos.
 */
@Directive({
  selector: 'img[appImg]',
  host: {
    '[attr.src]': 'src()',
    '[attr.srcset]': 'srcset()',
    '[attr.sizes]': 'srcset() ? sizes() : null',
    '[attr.decoding]': '"async"',
  },
})
export class ResponsiveImg {
  readonly appImg = input.required<string | null | undefined>();
  readonly sizes = input('(max-width: 600px) 100vw, 400px');

  protected readonly src = computed(() => optimizedUrl(this.appImg() ?? ''));
  protected readonly srcset = computed(() => {
    const url = this.appImg() ?? '';
    return PRODUCT_IMAGE.test(url) ? WIDTHS.map((w) => `${optimizedUrl(url, w)} ${w}w`).join(', ') : null;
  });
}
