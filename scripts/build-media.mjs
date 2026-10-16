// Builds web-ready media from the originals in /media. Runs before dev and every build.
//
//   media/<folder>/<name>.jpg|jpeg|png  ->  /media/<folder>/<name>.<ext>              (original, as-is)
//                                       ->  /media/<folder>/<name>-{480,800,1200}.webp (responsive sizes)
//   media/products/<name>.*             ->  /media/products/og/<name>.jpg             (1200x630 link-preview image)
//   media/videos/<name>.mp4|mov|webm    ->  /media/videos/<name>.mp4                  (web-optimised, starts playing fast)
//                                       ->  /media/videos/<name>-poster.{jpg,webp}    (thumbnail)
//   media/brand/logo.png                ->  /brand/generated/*                        (favicons, logo sizes, og-default)
//
// Output goes to frontend/public (served by the dev server and copied into every build).
// Only files whose source changed are regenerated. Outputs are gitignored.
import { execFile } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mediaDir = path.join(root, 'media');
const outDir = path.join(root, 'frontend', 'public', 'media');
const brandOut = path.join(root, 'frontend', 'public', 'brand', 'generated');
const logoSrc = path.join(mediaDir, 'brand', 'logo.png');

/** Must match WIDTHS in frontend/src/app/shared/responsive-img.ts */
const WIDTHS = [480, 800, 1200];
const IMAGE = /\.(jpe?g|png)$/i;
const VIDEO = /\.(mp4|mov|m4v|webm)$/i;
const SKIP = new Set(['brand', 'private-originals']);
const BRAND_BG = { r: 251, g: 246, b: 243, alpha: 1 }; // --color-bg (blush light)

let generated = 0;

/** True when `out` is missing or older than `src`. */
const stale = (src, out) => !existsSync(out) || statSync(out).mtimeMs < statSync(src).mtimeMs;

async function write(src, out, pipeline) {
  if (!stale(src, out)) return;
  await pipeline(sharp(src)).toFile(out);
  generated++;
}

async function image(src, folder, name, ext) {
  const dir = path.join(outDir, folder);
  const original = path.join(dir, `${name}${ext}`);
  if (stale(src, original)) {
    copyFileSync(src, original);
    generated++;
  }
  for (const width of WIDTHS) {
    await write(src, path.join(dir, `${name}-${width}.webp`), (img) =>
      img.rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 78 }),
    );
  }
  if (folder === 'products') {
    mkdirSync(path.join(dir, 'og'), { recursive: true });
    await write(src, path.join(dir, 'og', `${name}.jpg`), (img) =>
      img.rotate().resize(1200, 630, { fit: 'cover', position: 'attention' }).jpeg({ quality: 82, mozjpeg: true }),
    );
  }
}

async function video(src, folder, name) {
  const ffmpeg = createRequire(import.meta.url)('ffmpeg-static');
  const run = promisify(execFile);
  const dir = path.join(outDir, folder);
  const out = path.join(dir, `${name}.mp4`);
  const poster = path.join(dir, `${name}-poster.jpg`);

  if (stale(src, out)) {
    // H.264/AAC, max 720px wide, moov atom first so playback starts before the download finishes.
    await run(ffmpeg, [
      '-y', '-loglevel', 'error', '-i', src,
      '-vf', "scale='min(720,iw)':-2", '-c:v', 'libx264', '-preset', 'slow', '-crf', '26',
      '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', out,
    ]);
    generated++;
  }
  if (stale(src, poster)) {
    await run(ffmpeg, ['-y', '-loglevel', 'error', '-ss', '0.5', '-i', src, '-frames:v', '1', '-q:v', '3', poster]);
    generated++;
  }
  await write(poster, path.join(dir, `${name}-poster.webp`), (img) => img.webp({ quality: 80 }));
}

async function media() {
  for (const folder of readdirSync(mediaDir)) {
    const srcDir = path.join(mediaDir, folder);
    if (SKIP.has(folder) || !statSync(srcDir).isDirectory()) continue;
    mkdirSync(path.join(outDir, folder), { recursive: true });

    for (const file of readdirSync(srcDir)) {
      const src = path.join(srcDir, file);
      const { name, ext } = path.parse(file);
      if (IMAGE.test(file)) await image(src, folder, name, ext.toLowerCase());
      else if (VIDEO.test(file)) await video(src, folder, name);
    }
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

await media();
await brand();
console.log(`[media] ${generated ? `generated ${generated} file(s)` : 'up to date'}`);
