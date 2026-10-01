// Generates web-optimised images from the originals. Runs before dev and every build.
//
//   backend/uploads/products/*.jpeg|jpg|png  ->  backend/uploads/optimized/<name>-{480,800,1200}.webp
//                                            ->  backend/uploads/optimized/og/<name>.jpg   (1200x630 share image)
//   frontend/public/brand/logo.png           ->  frontend/public/brand/generated/*        (favicons, logo sizes, og-default)
//
// Only files whose source changed are regenerated. Outputs are gitignored.
import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const productsDir = path.join(root, 'backend', 'uploads', 'products');
const optimizedDir = path.join(root, 'backend', 'uploads', 'optimized');
const ogDir = path.join(optimizedDir, 'og');
const logoSrc = path.join(root, 'frontend', 'public', 'brand', 'logo.png');
const brandOut = path.join(root, 'frontend', 'public', 'brand', 'generated');

export const WIDTHS = [480, 800, 1200];
const BRAND_BG = { r: 251, g: 246, b: 243, alpha: 1 }; // --color-bg (blush light)

let generated = 0;

/** True when `out` is missing or older than `src`. */
const stale = (src, out) => !existsSync(out) || statSync(out).mtimeMs < statSync(src).mtimeMs;

async function write(src, out, pipeline) {
  if (!stale(src, out)) return;
  await pipeline(sharp(src)).toFile(out);
  generated++;
}

async function products() {
  mkdirSync(ogDir, { recursive: true });
  const files = readdirSync(productsDir).filter((f) => /\.(jpe?g|png)$/i.test(f));
  for (const file of files) {
    const src = path.join(productsDir, file);
    const name = path.parse(file).name;
    for (const width of WIDTHS) {
      await write(src, path.join(optimizedDir, `${name}-${width}.webp`), (img) =>
        img.rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 78 }),
      );
    }
    await write(src, path.join(ogDir, `${name}.jpg`), (img) =>
      img.rotate().resize(1200, 630, { fit: 'cover', position: 'attention' }).jpeg({ quality: 82, mozjpeg: true }),
    );
  }
}

async function brand() {
  mkdirSync(brandOut, { recursive: true });
  const out = (f) => path.join(brandOut, f);

  for (const size of [96, 192, 400]) {
    await write(logoSrc, out(`logo-${size}.webp`), (img) => img.resize(size, size).webp({ quality: 85 }));
  }
  await write(logoSrc, out('favicon-32.png'), (img) => img.resize(32, 32).png());
  await write(logoSrc, out('apple-touch-icon.png'), (img) =>
    img.resize(180, 180, { fit: 'contain', background: BRAND_BG }).flatten({ background: BRAND_BG }).png(),
  );
  await write(logoSrc, out('icon-192.png'), (img) => img.resize(192, 192).png());
  await write(logoSrc, out('icon-512.png'), (img) => img.resize(512, 512).png());

  // Default share image: logo centred on the brand background.
  const ogPath = out('og-default.jpg');
  if (stale(logoSrc, ogPath)) {
    const logo = await sharp(logoSrc).resize(520, 520).toBuffer();
    await sharp({ create: { width: 1200, height: 630, channels: 4, background: BRAND_BG } })
      .composite([{ input: logo, gravity: 'center' }])
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile(ogPath);
    generated++;
  }
}

await products();
await brand();
console.log(`[images] ${generated ? `generated ${generated} file(s)` : 'up to date'}`);
