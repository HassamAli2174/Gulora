import { Directive, computed, input } from '@angular/core';

/** Must match WIDTHS in scripts/build-media.mjs */
const WIDTHS = [480, 800, 1200];
/** Any original photo in the media folder, e.g. /media/products/shampoo.jpeg */
const MEDIA_IMAGE = /^\/media\/([^/]+)\/([^/]+)\.(?:jpe?g|png)$/i;

/** Maps an original media image URL to its generated WebP variant. */
export function optimizedUrl(url: string, width = 800): string {
  const match = MEDIA_IMAGE.exec(url);
  return match ? `/media/${match[1]}/${match[2]}-${width}.webp` : url;
}

/** Share image (1200x630 JPEG) for a product photo, used for link previews. */
export function ogImageUrl(url: string): string {
  const match = MEDIA_IMAGE.exec(url);
  return match?.[1] === 'products' ? `/media/products/og/${match[2]}.jpg` : url;
}

/** Thumbnail generated for a video, e.g. /media/videos/x.mp4 -> /media/videos/x-poster.webp */
export function videoPosterUrl(url: string): string {
  return url.replace(/\.[a-z0-9]+$/i, '-poster.webp');
}

/**
 * <img [appImg]="product.images[0]" sizes="(max-width: 600px) 100vw, 400px">
 * Serves optimised, responsive WebP versions of media photos.
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
    return MEDIA_IMAGE.test(url) ? WIDTHS.map((w) => `${optimizedUrl(url, w)} ${w}w`).join(', ') : null;
  });
}
