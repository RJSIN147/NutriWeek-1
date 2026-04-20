/**
 * NutriWeek — Search results page
 *
 * Filters MEALS by:
 *   • Free-text query (?q=)
 *   • Restaurant (?restaurant=)
 *   • "Healthy" toggle (verified only)
 *   • Diet radio group (veg / non-veg / all)
 */

(function () {
  /* ——— State ——— */
  let healthyOn = true; // "Healthy" toggle (default: on)
  let dietFilter = "all"; // "veg" | "non-veg" | "all"

  const query = (getUrlParam("q") || "").trim();
  const restaurantParam = getUrlParam("restaurant") || "";

  /* ——— Filtering ——— */

  function matchesQuery(meal, q) {
    if (!q) return true;
    const lower = q.toLowerCase();
    return (
      meal.name.toLowerCase().includes(lower) ||
      meal.restaurant.toLowerCase().includes(lower) ||
      meal.description.toLowerCase().includes(lower) ||
      meal.tags.some((t) => t.toLowerCase().includes(lower))
    );
  }

  function matchesFilters(meal) {
    if (healthyOn && !meal.verified) return false;
    if (dietFilter === "veg" && !meal.tags.includes("veg")) return false;
    if (dietFilter === "non-veg" && !meal.tags.includes("non-veg"))
      return false;
    return true;
  }

  function matchesRestaurant(meal) {
    if (!restaurantParam) return true;
    return meal.restaurantId === restaurantParam;
  }

  function getFilteredMeals() {
    return MEALS.filter(
      (m) => matchesQuery(m, query) && matchesFilters(m) && matchesRestaurant(m)
    );
  }

  /* ——— Rendering ——— */

  function renderResults() {
    const list = document.getElementById("results-list");
    const empty = document.getElementById("empty-state");
    if (!list) return;

    const filtered = getFilteredMeals();

    if (filtered.length === 0) {
      list.innerHTML = "";
      if (empty) empty.hidden = false;
      return;
    }
    if (empty) empty.hidden = true;

    list.innerHTML = filtered
      .map(
        (meal) => `
      <li class="meal-result-card">
        <a href="meal.html?id=${encodeURIComponent(
          meal.id
        )}" class="meal-result-card__link">
          <figure class="meal-result-card__media">
            <img src="${meal.image}"
                 alt="${escapeHtml(meal.name)}"
                 width="120" height="120" loading="lazy" />
          </figure>
          <div class="meal-result-card__body">
            <h3 class="meal-result-card__name">${escapeHtml(meal.name)}</h3>
            <p class="meal-result-card__restaurant">${escapeHtml(
              meal.restaurant
            )}</p>
            <div class="meal-result-card__meta">
              <span class="price">₹${meal.price}</span>
              <span class="meal-result-card__cal">${
                meal.calories
              } Calories</span>
            </div>
            <p class="meal-result-card__desc">${escapeHtml(
              meal.description.substring(0, 90)
            )}…</p>
            ${
              meal.verified
                ? '<span class="badge badge--verified">✓ Verified</span>'
                : ""
            }
          </div>
        </a>
        <button class="heart-btn" aria-label="Add to favourites" type="button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5
                     5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78
                     1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </li>`
      )
      .join("");

    /* Heart buttons — decorative toggle only */
    list.querySelectorAll(".heart-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        btn.classList.toggle("heart-btn--active");
      });
    });
  }

  /* ——— Filter chip wiring ——— */

  function syncChipUI() {
    const bar = document.getElementById("filter-bar");
    if (!bar) return;
    bar.querySelectorAll(".chip").forEach((c) => {
      const f = c.dataset.filter;
      const group = c.dataset.group;
      if (group === "toggle") {
        c.classList.toggle("chip--active", f === "healthy" && healthyOn);
      } else {
        c.classList.toggle("chip--active", f === dietFilter);
      }
    });
  }

  function wireFilters() {
    const bar = document.getElementById("filter-bar");
    if (!bar) return;

    bar.querySelectorAll(".chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        const f = chip.dataset.filter;
        const group = chip.dataset.group;

        if (group === "toggle") {
          healthyOn = !healthyOn;
        } else {
          dietFilter = f;
        }

        syncChipUI();
        recordEvent("filter_change", { healthy: healthyOn, diet: dietFilter });
        renderResults();
      });
    });
  }

  /* ——— Init ——— */

  function searchInit() {
    wireFilters();
    syncChipUI();
    renderResults();

    userSession.viewedMenu = true;
    stamp("searchPageLoaded");
    recordEvent("search", {
      action: "viewed",
      query: query || null,
      restaurant: restaurantParam || null,
    });
    logSession("Search page loaded");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", searchInit);
  } else {
    searchInit();
  }
})();
