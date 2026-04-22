# NutriWeek

Healthy weekday meal discovery with verified nutrition, built as a no-backend frontend prototype.

NutriWeek helps users discover meals with calorie/protein/fat visibility before ordering. The app uses a marketplace-style flow with mock data, local cart storage, and console-based funnel analytics.

## Current State

- Frontend-only prototype (no backend, no auth, no payments)
- Multi-page vanilla app (`index/search/meal/cart/profile`)
- Refreshed visual system (editorial layout, warm healthy-food theme)
- Asset versioning in HTML (`styles.css?v=2`, `*.js?v=2`) to reduce stale-cache issues during local iteration

## Pages

| Page | File | What it does |
|---|---|---|
| Home | `index.html` + `home.js` | Masthead, hero carousel, recommended meals rail, restaurant rail |
| Search | `search.html` + `search.js` | Query + restaurant filtering, diet chips, results list, inline feedback |
| Meal Detail | `meal.html` + `meal.js` | Meal showcase, nutrition summary, description/tags, sticky action bar |
| Cart | `cart.html` + `cart-page.js` | Cart rendering, qty controls, checkout modal, WhatsApp handoff |
| Profile | `profile.html` | Placeholder profile screen |

## User Flow

`Home -> Search -> Meal Detail -> Add to Cart -> Cart -> Checkout Modal -> WhatsApp`

## Tech Stack

- HTML5
- Vanilla CSS (`styles.css`)
- Vanilla JavaScript (`data.js`, `shared.js`, page scripts)
- Google Fonts: `Fraunces`, `Manrope`
- Unsplash placeholder imagery

## Project Structure

```text
NutriWeek-1/
├── index.html
├── search.html
├── meal.html
├── cart.html
├── profile.html
├── styles.css
├── data.js
├── shared.js
├── home.js
├── search.js
├── meal.js
├── cart-page.js
├── vercel.json
└── README.md
```

## Key Behaviors

- **Nutrition-first UI**: meals show calories/protein/fat in both list and detail views.
- **Client-side filtering**: text + diet chips + restaurant param (`?restaurant=<id>`).
- **Local cart**: cart persists via `localStorage` key `nutriweek_cart`.
- **Checkout gating**: "I placed the order" is enabled only after WhatsApp link click.
- **Session analytics**: events are logged in DevTools console via `recordEvent` / `logSession`.
- **Exit intent modal**: shown on mouse-top leave (not internal-link/back-button hijacking).

## Running Locally

No build step is required.

```bash
# Python
python3 -m http.server 8000

# or Node
npx -y http-server -p 8000
```

Open `http://localhost:8000`.

## Deployment

`vercel.json` is configured for:

- clean URLs
- no trailing slash
- security headers (`X-Content-Type-Options`, `X-Frame-Options`)

## Notes

- This repo is designed for product/prototype iteration, not production hardening.
- Analytics are local/console-only and not sent to any external service.
