# Gulora: Herbs & Jewels

The Gulora brand website. **Angular 20** frontend and a **Node.js + Express (TypeScript)** API.

Right now it is a **product showcase with WhatsApp ordering**. It is built so it can become a full online store
by switching one setting.

```
Gulora/
├─ media/               ← ALL photos & videos (originals): brand/, products/, reviews/, gallery/, videos/
├─ frontend/            Angular app
│  └─ src/
│     ├─ styles/_themes.scss   ← all colours (brand themes × light/dark)
│     └─ app/
│        ├─ core/        models, services (catalog, settings, theme, WhatsApp, cart, orders), guards
│        ├─ layout/      header, footer, floating WhatsApp button
│        ├─ shared/      product card, icons, price pipe, theme toggle
│        └─ pages/       home, shop, product detail, about, contact, cart (store mode)
└─ backend/             Express API
   ├─ .env               ← your settings (WhatsApp number, store mode...)
   ├─ src/data/          ← products.json & categories.json (edit to change products)
   └─ src/repositories/  ← storage layer (swap JSON for a database later)
```

## Run it

Requires Node.js 22.

```bash
npm run install:all   # first time only
npm run dev           # API on :3000 + website on http://localhost:4200
```

**Production:** run `npm run build`, then `npm start`. The API also serves the built website, so you deploy a single
Node app on port 3000.

## Deploying (Netlify)

`netlify.toml` configures everything:

- The Angular site is built and served as static files, including optimized photos and videos under `/media/...`.
- The Express API runs as a Netlify Function (`netlify/functions/api.ts`) at `/api/*`.

To deploy:

1. On [netlify.com](https://app.netlify.com), go to **Add new site → Import an existing project → GitHub** and pick this repo.
2. Leave the build settings Netlify detects from `netlify.toml` as they are, and click **Deploy**.
3. Every push to `main` redeploys the site automatically.

To change settings in production (store mode, prices, social links...), add environment variables under
**Site configuration → Environment variables**, then trigger a redeploy. The WhatsApp number defaults to the business
number. `backend/.env` is only used on your computer and is never committed.

> Netlify Functions have a read-only filesystem. Connect a database (see below) before you enable store mode.

The API is also a normal Node server (`npm run build && npm start`), so it can move to any Node host later.

## Everyday changes

| I want to…                   | Do this                                                                 |
| ---------------------------- | ----------------------------------------------------------------------- |
| Set the WhatsApp number      | `backend/.env` → `WHATSAPP_NUMBER=923001234567` (digits only, with country code) |
| Add or edit a product        | Put photos in `media/products/` (videos in `media/videos/`), then edit `backend/src/data/products.json` |
| Add a customer review        | Put the screenshot in `media/reviews/` and add an entry to `backend/src/data/reviews.json` |
| Show prices                  | Fill in `price` for each variant, then set `SHOW_PRICES=true`            |
| Change the brand colours     | Edit `frontend/src/styles/_themes.scss`                                  |
| Switch theme                 | `DEFAULT_THEME=blush` or `herbal` in `backend/.env`                      |
| Add Instagram/email links    | `INSTAGRAM_URL`, `FACEBOOK_URL`, `CONTACT_EMAIL` in `backend/.env`       |
| Change WhatsApp message text | `frontend/src/app/core/services/whatsapp.service.ts`                    |
| Edit FAQ, shipping or privacy text | `frontend/src/app/content/help-content.ts`                        |
| Change page titles / search descriptions | `title` and `data.description` in `frontend/src/app/app.routes.ts` |

## Images, SEO and link previews

- **Media:** every photo and video lives in `media/`. `npm run media` runs automatically before dev and every build:
  photos get WebP versions (480/800/1200 px), product photos also get 1200×630 share images, and videos are
  compressed for the web with a thumbnail. The output goes to `frontend/public/media/` and is not committed.
- **Privacy:** hide phone numbers, names, addresses and QR codes before adding a screenshot or photo.
  `media/private-originals/` is never committed or published.
- **Prerendering:** every page (home, shop, each product, about, contact, FAQ, policies) is rendered to static HTML at
  build time (`frontend/src/app/app.routes.server.ts`). WhatsApp, Instagram and Facebook link previews, and Google,
  see real content, titles and images. New products are prerendered automatically.
- **Structured data:** product pages include schema.org `Product` data (prices are added automatically once set), the
  FAQ includes `FAQPage`, and every page includes `Organization`. `sitemap.xml` and `robots.txt` are generated on build.
- **Your own domain:** once connected in Netlify, set a `SITE_URL` environment variable (for example
  `https://gulora.pk`) so share links and the sitemap use it.

Restart the backend after changing `.env`. Product JSON changes show up immediately.

## Themes and dark mode

- Every colour is a CSS variable in `_themes.scss`. Components never hard-code colours.
- Each brand theme (`blush`, `herbal`) has a light and a dark palette.
- Visitors toggle light/dark with the sun/moon button. The site follows their device setting until they choose, and
  remembers the choice.
- To add a theme: copy a `@mixin` pair, add the two `:root[data-theme=...]` selectors, and add the name to `THEMES`
  in `theme.service.ts`.

## Turning on the online store

Set `STORE_ENABLED=true` (and usually `SHOW_PRICES=true`) in `backend/.env`. That switches on:

- **Add to bag** buttons, the bag icon in the header, and the `/cart` checkout page
- `POST /api/orders`, which validates the items, **prices them on the server** from the catalogue, and saves the order
  (currently to `backend/src/data/orders.json`)
- After checkout, the customer confirms the order on WhatsApp using its order reference

Suggested next steps for a full store:

1. **Database.** Implement `CatalogRepository` / `OrderRepository` with MongoDB or PostgreSQL. The routes don't change.
2. **Payments.** Add a payment step in `pages/cart` and a webhook route in the backend (for example Stripe, or
   Safepay/JazzCash/Easypaisa in Pakistan).
3. **Admin panel.** Protected routes to manage products, stock and orders, plus uploads to `media/`.
4. **Stock.** The `stock` field on each variant is already in the data model.

## API

| Method | Path                     | Notes                                   |
| ------ | ------------------------ | --------------------------------------- |
| GET    | `/api/settings`          | Public site settings                    |
| GET    | `/api/categories`        |                                         |
| GET    | `/api/products`          | `?category=hair-care`, `?featured=true` |
| GET    | `/api/products/:slug`    |                                         |
| POST   | `/api/orders`            | Store mode only                         |
| GET    | `/api/reviews`           | `?product=<id>`, `?featured=true`       |
