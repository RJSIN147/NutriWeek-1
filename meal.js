/**
 * NutriWeek — Meal detail page
 *
 * Reads ?id= from URL, finds the meal in MEALS[], and renders:
 *   • Breadcrumb (Home > Restaurant)
 *   • Hero image
 *   • Meal name & restaurant
 *   • Verified macro badges (calories, protein, fat)
 *   • Meta row (favourite, rating, delivery estimate)
 *   • Full description with "Read more" toggle
 *   • Tags (Veg/Non-Veg, High Protein, Low Carb)
 *   • Sticky bottom action bar (price, Add to Cart, Go Back)
 */

(function () {
  const mealId = getUrlParam("id");
  const meal = MEALS.find((m) => m.id === mealId);

  function renderNotFound(container) {
    container.innerHTML = `
      <div class="empty-state" style="padding-top:4rem">
        <p>Meal not found.</p>
        <a href="search.html" class="btn btn-primary" style="margin-top:1rem">Browse Meals</a>
      </div>`;
  }

  function formatTags(tags) {
    const labels = {
      veg: "Veg",
      "non-veg": "Non-Veg",
      "high-protein": "High Protein",
      "low-carb": "Low Carb",
    };
    return tags.map((t) => labels[t] || t);
  }

  function render() {
    const container = document.getElementById("meal-content");
    if (!container) return;

    if (!meal) {
      renderNotFound(container);
      return;
    }

    /* Update page title */
    document.title = `${meal.name} — NutriWeek`;

    const tagLabels = formatTags(meal.tags);

    container.innerHTML = `
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="index.html">Home</a>
        <span class="breadcrumb__sep">›</span>
        <a href="search.html?restaurant=${encodeURIComponent(
          meal.restaurantId
        )}">${escapeHtml(meal.restaurant)}</a>
      </nav>

      <section class="meal-showcase">
        <figure class="meal-hero">
          <img src="${meal.image}"
               alt="${escapeHtml(meal.name)}"
               width="800" height="500" loading="eager" />
          <div class="meal-hero__badge">Nutrition verified</div>
        </figure>

        <aside class="meal-sidecard">
          <p class="meal-sidecard__eyebrow">At a glance</p>
          <div class="meal-sidecard__grid">
            <div class="meal-sidecard__stat">
              <span class="meal-sidecard__value">${meal.calories}</span>
              <span class="meal-sidecard__label">Calories</span>
            </div>
            <div class="meal-sidecard__stat">
              <span class="meal-sidecard__value">${meal.protein}g</span>
              <span class="meal-sidecard__label">Protein</span>
            </div>
            <div class="meal-sidecard__stat">
              <span class="meal-sidecard__value">${meal.fat}g</span>
              <span class="meal-sidecard__label">Fat</span>
            </div>
            <div class="meal-sidecard__stat">
              <span class="meal-sidecard__value">₹${meal.price}</span>
              <span class="meal-sidecard__label">Price</span>
            </div>
          </div>
          <p class="meal-sidecard__note">Built for weekday ordering with transparent nutrition and a restaurant-style presentation.</p>
        </aside>
      </section>

      <div class="meal-story">
        <div class="meal-info">
          <span class="meal-info__eyebrow">Healthy weekday pick</span>
          <h1 class="meal-info__name">${escapeHtml(meal.name)}</h1>
          <p class="meal-info__restaurant">${escapeHtml(meal.restaurant)}</p>

          <div class="macro-badges">
            <span class="macro-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="3"
                   stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 6 9 17l-5-5"/>
              </svg>
              ${meal.calories} Calories
            </span>
            <span class="macro-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="3"
                   stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 6 9 17l-5-5"/>
              </svg>
              ${meal.protein}g Protein
            </span>
            <span class="macro-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="3"
                   stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 6 9 17l-5-5"/>
              </svg>
              ${meal.fat}g Fat
            </span>
          </div>

          <div class="meal-meta">
            <span class="meal-meta__item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5
                         5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78
                         1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              Favourite
            </span>
            <span class="meal-meta__item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              4.5
            </span>
            <span class="meal-meta__item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
              </svg>
              25 min
            </span>
          </div>
        </div>

        <div class="meal-description">
          <h2 class="meal-description__title">${escapeHtml(meal.name)}</h2>
          <p class="meal-description__restaurant">${escapeHtml(
            meal.restaurant
          )}</p>
          <p class="meal-description__intro">A balanced plate designed for convenience, flavour, and clear nutrition.</p>
          <p class="meal-description__text meal-description__text--truncated" id="meal-desc-text">
            ${escapeHtml(meal.description)}
          </p>
          <button class="read-more-btn" id="read-more-btn" type="button">Read more ›</button>
        </div>

        <div class="meal-tags">
          ${tagLabels
            .map((label) => `<span class="tag">${escapeHtml(label)}</span>`)
            .join("")}
        </div>
      </div>

      <div class="meal-action-bar">
        <span class="price-lg">₹${meal.price}</span>
        <button class="btn btn-primary" id="btn-add-cart" type="button">Add to Cart</button>
        <button class="btn btn-outline" id="btn-go-back" type="button">Go Back</button>
      </div>
    `;

    wireInteractions();
  }

  function wireInteractions() {
    /* Read more toggle */
    const descText = document.getElementById("meal-desc-text");
    const readMoreBtn = document.getElementById("read-more-btn");
    if (descText && readMoreBtn) {
      readMoreBtn.addEventListener("click", () => {
        const isTruncated = descText.classList.toggle(
          "meal-description__text--truncated"
        );
        readMoreBtn.textContent = isTruncated ? "Read more ›" : "Show less ‹";
      });
    }

    /* Add to Cart */
    const addCartBtn = document.getElementById("btn-add-cart");
    if (addCartBtn && meal) {
      addCartBtn.addEventListener("click", () => {
        Cart.addItem(meal);
        userSession.itemClicked = true;
        stamp("itemAddedToCart");
        recordEvent("item", {
          action: "add_to_cart",
          itemId: meal.id,
          itemName: meal.name,
        });
        logSession("Item added to cart");
      });
    }

    /* Go Back */
    const backBtn = document.getElementById("btn-go-back");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.href = "search.html";
        }
      });
    }
  }

  /* ——— Init ——— */

  function mealInit() {
    render();
    stamp("mealDetailLoaded");
    recordEvent("meal_detail", {
      action: "viewed",
      itemId: mealId,
      itemName: meal ? meal.name : null,
    });
    logSession("Meal detail page loaded");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mealInit);
  } else {
    mealInit();
  }
})();
