/**
 * NutriWeek — Centralised mock data
 *
 * All meals, restaurants, and hero-carousel slides live here so every
 * page can import a single source of truth.
 */

/* ================================================================
   MEALS
   ================================================================ */

const MEALS = [
  {
    id: "grilled-chicken-bowl",
    name: "Grilled Chicken Bowl",
    restaurant: "Green Bowl Kitchen",
    restaurantId: "green-bowl-kitchen",
    price: 150,
    calories: 520,
    protein: 32,
    fat: 18,
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop&q=80",
    description:
      "Tender grilled chicken breast served on a bed of steamed brown rice with sautéed seasonal vegetables, drizzled with a light lemon-herb dressing. A balanced meal packed with lean protein to keep you fuelled through the afternoon.",
    tags: ["non-veg", "high-protein"],
    verified: true,
  },
  {
    id: "quinoa-salad",
    name: "Mediterranean Quinoa Salad",
    restaurant: "The Salad Story",
    restaurantId: "the-salad-story",
    price: 130,
    calories: 380,
    protein: 14,
    fat: 12,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop&q=80",
    description:
      "Fluffy quinoa tossed with cherry tomatoes, cucumbers, Kalamata olives, red onion, and crumbled feta, finished with extra-virgin olive oil and fresh lemon juice. Light yet satisfying for a midday pick-me-up.",
    tags: ["veg", "low-carb"],
    verified: true,
  },
  {
    id: "tofu-stir-fry",
    name: "Tofu & Veg Stir-Fry",
    restaurant: "Clean Eats Café",
    restaurantId: "clean-eats-cafe",
    price: 120,
    calories: 440,
    protein: 22,
    fat: 14,
    image:
      "https://images.unsplash.com/photo-1644527199880-fcf2bb61b2b4?w=600&h=400&fit=crop&q=80",
    description:
      "Crispy pan-seared tofu with bell peppers, broccoli, snap peas, and mushrooms in a light soy-ginger glaze. Served with steamed jasmine rice. A wholesome plant-based option that doesn't compromise on taste.",
    tags: ["veg", "high-protein"],
    verified: true,
  },
  {
    id: "salmon-rice",
    name: "Baked Salmon & Brown Rice",
    restaurant: "FitMeal Co.",
    restaurantId: "fitmeal-co",
    price: 180,
    calories: 590,
    protein: 38,
    fat: 22,
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&h=400&fit=crop&q=80",
    description:
      "Oven-baked salmon fillet seasoned with herbs and served alongside fluffy brown rice and steamed asparagus. Rich in omega-3 fatty acids, this meal supports brain function and sustained energy.",
    tags: ["non-veg", "high-protein"],
    verified: true,
  },
  {
    id: "lentil-bowl",
    name: "Spiced Lentil Power Bowl",
    restaurant: "NutriBox Bengaluru",
    restaurantId: "nutribox-bengaluru",
    price: 125,
    calories: 460,
    protein: 20,
    fat: 10,
    image:
      "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&h=400&fit=crop&q=80",
    description:
      "Hearty spiced dal served over a base of cumin-scented basmati rice, topped with pickled onions, fresh coriander, and a squeeze of lime. Comforting, affordable, and packed with plant protein.",
    tags: ["veg", "high-protein", "low-carb"],
    verified: true,
  },
  {
    id: "egg-wrap",
    name: "Egg White & Avocado Wrap",
    restaurant: "Green Bowl Kitchen",
    restaurantId: "green-bowl-kitchen",
    price: 140,
    calories: 410,
    protein: 24,
    fat: 16,
    image:
      "https://plus.unsplash.com/premium_photo-1661722641653-b2d2c631bf26?w=600&h=400&fit=crop&q=80",
    description:
      "Fluffy egg whites scrambled with spinach and diced tomatoes, wrapped in a whole-wheat tortilla with creamy avocado slices and a hint of hot sauce. Perfect for a protein-rich, on-the-go lunch.",
    tags: ["non-veg", "high-protein"],
    verified: true,
  },
  {
    id: "paneer-tikka-bowl",
    name: "Paneer Tikka Rice Bowl",
    restaurant: "NutriBox Bengaluru",
    restaurantId: "nutribox-bengaluru",
    price: 155,
    calories: 510,
    protein: 26,
    fat: 20,
    image:
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop&q=80",
    description:
      "Smoky marinated paneer tikka pieces served on a bed of mint-coriander rice with raita, pickled onions, and a tangy green chutney. A flavourful vegetarian option that feels indulgent yet stays nutritious.",
    tags: ["veg", "high-protein"],
    verified: true,
  },
  {
    id: "chicken-caesar-salad",
    name: "Chicken Caesar Salad",
    restaurant: "The Salad Story",
    restaurantId: "the-salad-story",
    price: 165,
    calories: 480,
    protein: 34,
    fat: 19,
    image:
      "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600&h=400&fit=crop&q=80",
    description:
      "Crisp romaine lettuce with herb-grilled chicken breast, shaved parmesan, whole-grain croutons, and a light Caesar dressing. A classic reinvented with cleaner ingredients and verified macros.",
    tags: ["non-veg", "high-protein", "low-carb"],
    verified: true,
  },
  {
    id: "buddha-bowl",
    name: "Rainbow Buddha Bowl",
    restaurant: "Clean Eats Café",
    restaurantId: "clean-eats-cafe",
    price: 145,
    calories: 420,
    protein: 16,
    fat: 14,
    image:
      "https://images.unsplash.com/photo-1540914124281-342587941389?w=600&h=400&fit=crop&q=80",
    description:
      "A vibrant bowl of roasted sweet potato, chickpeas, shredded cabbage, edamame, avocado, and pickled carrots over brown rice, with a creamy tahini drizzle. Nourishing and photogenic.",
    tags: ["veg", "low-carb"],
    verified: true,
  },
  {
    id: "prawn-poke",
    name: "Prawn Poke Bowl",
    restaurant: "FitMeal Co.",
    restaurantId: "fitmeal-co",
    price: 195,
    calories: 470,
    protein: 30,
    fat: 15,
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop&q=80",
    description:
      "Marinated prawns on sushi rice with edamame, cucumber, mango, pickled ginger, and a soy-sesame dressing. A light, refreshing bowl inspired by Hawaiian poke tradition.",
    tags: ["non-veg", "high-protein"],
    verified: true,
  },
];

/* ================================================================
   RESTAURANTS
   ================================================================ */

const RESTAURANTS = [
  {
    id: "green-bowl-kitchen",
    name: "Green Bowl Kitchen",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop&q=80",
    avgPrice: 145,
    deliveryMins: 25,
  },
  {
    id: "fitmeal-co",
    name: "FitMeal Co.",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop&q=80",
    avgPrice: 188,
    deliveryMins: 30,
  },
  {
    id: "the-salad-story",
    name: "The Salad Story",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&q=80",
    avgPrice: 148,
    deliveryMins: 20,
  },
  {
    id: "nutribox-bengaluru",
    name: "NutriBox Bengaluru",
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop&q=80",
    avgPrice: 140,
    deliveryMins: 22,
  },
  {
    id: "clean-eats-cafe",
    name: "Clean Eats Café",
    image:
      "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=400&h=300&fit=crop&q=80",
    avgPrice: 133,
    deliveryMins: 28,
  },
];

/* ================================================================
   HERO CAROUSEL SLIDES
   ================================================================ */

const HERO_SLIDES = [
  {
    title: "Healthy Eating Made Easy",
    subtitle: "Quickly discover nutritious meals for busy weekdays",
    ctaText: "See All",
    ctaLink: "search.html",
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&h=500&fit=crop&q=80",
  },
  {
    title: "Verified Nutrition You Can Trust",
    subtitle:
      "Every calorie, every gram of protein — checked and displayed upfront",
    ctaText: "Browse Meals",
    ctaLink: "search.html",
    image:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200&h=500&fit=crop&q=80",
  },
  {
    title: "No More Health Premium",
    subtitle:
      "Nutritious meals starting at just ₹120 — same price as your usual order",
    ctaText: "Explore Menu",
    ctaLink: "search.html",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=500&fit=crop&q=80",
  },
];

/* ================================================================
   WHATSAPP CONFIG
   ================================================================ */

const WHATSAPP_NUMBER = "919876543210";
