# Gulora: Herbs & Jewels

The Gulora brand website. **Angular 20** frontend and a **Node.js + Express (TypeScript)** API.

Right now it is a **product showcase with WhatsApp ordering**. It is built so it can become a full online store
by switching one setting.

```
Gulora/
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
   ├─ uploads/products/  ← product images
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

## Deploying (Render)

The repo includes a `render.yaml` Blueprint, which sets up one free Node web service that hosts both the site and the API.

1. On [render.com](https://render.com), go to **New → Blueprint** and connect this GitHub repo.
2. Render reads `render.yaml`, builds, and gives you a URL like `https://gulora.onrender.com`.
3. Every push to `main` redeploys the site automatically.

To change settings in production (WhatsApp number, store mode...), edit the environment variables in the Render
dashboard. `backend/.env` is only used on your computer and is never committed.

> On Render's free plan the service sleeps after 15 minutes idle, so the first visit afterwards takes about 30 seconds.
> The free plan's disk is also temporary, so connect a database before you enable store mode.

## Everyday changes

| I want to…                   | Do this                                                                 |
| ---------------------------- | ----------------------------------------------------------------------- |
| Set the WhatsApp number      | `backend/.env` → `WHATSAPP_NUMBER=923001234567` (digits only, with country code) |
| Add or edit a product        | Edit `backend/src/data/products.json` and put images in `backend/uploads/products/` |
| Show prices                  | Fill in `price` for each variant, then set `SHOW_PRICES=true`            |
| Change the brand colours     | Edit `frontend/src/styles/_themes.scss`                                  |
| Switch theme                 | `DEFAULT_THEME=blush` or `herbal` in `backend/.env`                      |
| Add Instagram/email links    | `INSTAGRAM_URL`, `FACEBOOK_URL`, `CONTACT_EMAIL` in `backend/.env`       |
| Change WhatsApp message text | `frontend/src/app/core/services/whatsapp.service.ts`                    |

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
3. **Admin panel.** Protected routes to manage products, stock and orders, plus image uploads to `uploads/`.
4. **Stock.** The `stock` field on each variant is already in the data model.

## API

| Method | Path                     | Notes                                   |
| ------ | ------------------------ | --------------------------------------- |
| GET    | `/api/settings`          | Public site settings                    |
| GET    | `/api/categories`        |                                         |
| GET    | `/api/products`          | `?category=hair-care`, `?featured=true` |
| GET    | `/api/products/:slug`    |                                         |
| POST   | `/api/orders`            | Store mode only                         |
| GET    | `/uploads/...`           | Product images                          |
