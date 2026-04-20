# NutriWeek

**Healthy meals you can trust — without overthinking.**

NutriWeek is a product concept that helps urban professionals discover healthy weekday meals with verified nutrition info, inside a food-delivery marketplace experience. It reduces decision fatigue by surfacing calories, protein, and fat upfront on every dish, so users can choose in seconds rather than minutes.

> **Note:** This is a front-end prototype built for an academic capstone project. There is no backend server — all data is mock, analytics are logged to the browser console, and the order flow routes to WhatsApp / phone for restaurant contact.

---

## Pages

| Page | File | Description |
|---|---|---|
| **Homepage** | `index.html` | Hero carousel, "Recommended for You" meal rail, "Popular Near You" restaurant rail |
| **Search** | `search.html` | Filter chips (Healthy, Veg, Non-Veg, All), text search, vertical meal result cards with verified badges |
| **Meal Detail** | `meal.html` | Full meal view with breadcrumb, hero image, verified macro badges (calories, protein, fat), description, tags, sticky Add to Cart bar |
| **Cart** | `cart.html` | Simulated cart with quantity controls, order total, and checkout via WhatsApp / phone modal |
| **Profile** | `profile.html` | Placeholder profile page (coming soon) |

## User Flow

```
Homepage → Browse / Search → Meal Detail → Add to Cart → Cart → Proceed to Order → WhatsApp / Phone
```

## Tech Stack

- **HTML5** — semantic markup, ARIA attributes
- **Vanilla CSS** — custom properties design system, mobile-first, responsive
- **Vanilla JavaScript** — no frameworks, no build step
- **Google Fonts** — [Inter](https://fonts.google.com/specimen/Inter)
- **Unsplash** — placeholder food/restaurant imagery

## Project Structure

```
NutriWeek-1/
├── index.html          # Homepage
├── search.html         # Search results
├── meal.html           # Meal detail
├── cart.html           # Cart
├── profile.html        # Profile (placeholder)
├── styles.css          # All styles
├── data.js             # Centralised mock data (meals, restaurants, hero slides)
├── shared.js           # Navbar, cart state, analytics, exit-intent, utilities
├── home.js             # Homepage-specific logic
├── search.js           # Search filtering & rendering
├── meal.js             # Meal detail rendering & add-to-cart
├── cart-page.js        # Cart rendering & checkout flow
├── .gitignore
└── README.md
```

## Key Features

- **Verified Nutrition Badges** — every meal card and detail page shows verified calorie, protein, and fat data
- **Client-Side Search & Filtering** — filter by diet type (Veg/Non-Veg), health verification, and free-text search
- **Simulated Cart** — `localStorage`-backed cart that persists across page navigations with quantity controls
- **Session Analytics** — full funnel tracking logged to the browser console (page views, filter changes, add-to-cart, order confirmation, friction reasons)
- **Exit-Intent Survey** — modal triggered on mouse-top-leave, back-button, or internal navigation to capture non-ordering reasons
- **Inline Feedback** — non-blocking feedback buttons ("Too expensive", "Not enough options", etc.)

## Running Locally

No build step required. Open `index.html` in a browser:

```bash
# Using Python's built-in HTTP server
python3 -m http.server 8000

# Or using Node.js http-server
npx -y http-server -p 8000
```

Then navigate to `http://localhost:8000`.

## Analytics

Open your browser's DevTools Console to see session tracking events. All events are logged as structured JSON with timestamps.

## Problem Context

Urban professionals in Bengaluru want to eat healthier during weekdays but face friction in discovery, trust, and affordability. NutriWeek addresses this by:

1. **Reducing decision fatigue** — curated meals with clear macros
2. **Building trust** — verified nutrition badges, no vague "healthy" labels
3. **Narrowing the health premium** — meals starting at ₹120

---

*NutriWeek — Academic capstone prototype*
