/**
 * NutriWeek — Homepage
 *
 * Renders:
 *   • Hero carousel (auto-advancing, dot navigation)
 *   • "Recommended for You" horizontal meal rail
 *   • "Popular Near You" horizontal restaurant rail
 */

(function () {
  /* ==========================================================
     HERO CAROUSEL
     ========================================================== */

  function renderCarousel() {
    const viewport = document.getElementById("carousel-viewport");
    const dotsWrap = document.getElementById("carousel-dots");
    if (!viewport || !dotsWrap) return;

    viewport.innerHTML = HERO_SLIDES.map(
      (slide, i) => `
      <div class="carousel-slide ${i === 0 ? "carousel-slide--active" : ""}"
           data-slide="${i}">
        <img src="${slide.image}" alt="" class="carousel-slide__bg"
             loading="${i === 0 ? "eager" : "lazy"}" />
        <div class="carousel-slide__overlay"></div>
        <div class="carousel-slide__content">
          <span class="carousel-slide__eyebrow">Verified weekday nutrition</span>
          <h2 class="carousel-slide__title">${escapeHtml(slide.title)}</h2>
          <p class="carousel-slide__subtitle">${escapeHtml(slide.subtitle)}</p>
          <div class="carousel-slide__stats">
            <span>Fresh picks daily</span>
            <span>Calories upfront</span>
            <span>Fast weekday ordering</span>
          </div>
          <a href="${slide.ctaLink}"
             class="btn btn-primary carousel-slide__cta">${escapeHtml(
               slide.ctaText
             )} ›</a>
        </div>
      </div>`
    ).join("");

    dotsWrap.innerHTML = HERO_SLIDES.map(
      (_, i) =>
        `<button class="carousel-dot ${
          i === 0 ? "carousel-dot--active" : ""
        }" data-slide="${i}" aria-label="Slide ${i + 1}"></button>`
    ).join("");

    let current = 0;
    const slides = viewport.querySelectorAll(".carousel-slide");
    const dots = dotsWrap.querySelectorAll(".carousel-dot");

    function goTo(idx) {
      slides[current].classList.remove("carousel-slide--active");
      dots[current].classList.remove("carousel-dot--active");
      current = idx;
      slides[current].classList.add("carousel-slide--active");
      dots[current].classList.add("carousel-dot--active");
    }

    dots.forEach((d) =>
      d.addEventListener("click", () => goTo(Number(d.dataset.slide)))
    );

    setInterval(() => goTo((current + 1) % HERO_SLIDES.length), 5000);
  }

  /* ==========================================================
     RECOMMENDED FOR YOU  (meal rail)
     ========================================================== */

  function renderRecommended() {
    const rail = document.getElementById("recommended-rail");
    if (!rail) return;

    const recommended = MEALS.slice(0, 5);

    rail.innerHTML = recommended
      .map(
        (meal) => `
      <a href="meal.html?id=${encodeURIComponent(
        meal.id
      )}" class="meal-card-sm">
        <figure class="meal-card-sm__media">
          <img src="${meal.image}"
               alt="${escapeHtml(meal.name)}"
               width="280" height="180" loading="lazy" />
        </figure>
        <div class="meal-card-sm__body">
          <span class="meal-card-sm__kicker">Chef-picked</span>
          <h3 class="meal-card-sm__name">${escapeHtml(meal.name)}</h3>
          <span class="meal-card-sm__price">₹${meal.price}</span>
          <span class="meal-card-sm__cal">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                 stroke="var(--verified)" stroke-width="3"
                 stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
            ${meal.calories} Calories
          </span>
        </div>
      </a>`
      )
      .join("");
  }

  /* ==========================================================
     POPULAR NEAR YOU  (restaurant rail)
     ========================================================== */

  function renderPopular() {
    const rail = document.getElementById("popular-rail");
    if (!rail) return;

    rail.innerHTML = RESTAURANTS.map(
      (r) => `
      <a href="search.html?restaurant=${encodeURIComponent(
        r.id
      )}" class="restaurant-card">
        <figure class="restaurant-card__media">
          <img src="${r.image}"
               alt="${escapeHtml(r.name)}"
               width="280" height="180" loading="lazy" />
        </figure>
        <div class="restaurant-card__body">
          <span class="restaurant-card__kicker">Healthy favourite</span>
          <h3 class="restaurant-card__name">${escapeHtml(r.name)}</h3>
          <span class="restaurant-card__meta">₹${r.avgPrice} · ${
        r.deliveryMins
      } mins</span>
        </div>
      </a>`
    ).join("");
  }

  /* ==========================================================
     INIT
     ========================================================== */

  function homeInit() {
    if (readFunnelStartMs() == null) {
      sessionStorage.setItem(FUNNEL_START_KEY, String(Date.now()));
    }
    renderCarousel();
    renderRecommended();
    renderPopular();

    stamp("homepageLoaded");
    recordEvent("homepage", { action: "viewed" });
    logSession("Homepage loaded");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", homeInit);
  } else {
    homeInit();
  }
})();
