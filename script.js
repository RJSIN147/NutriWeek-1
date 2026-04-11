/**
 * NutriWeek — menu page: non-blocking order flow + exit / inline feedback (see console).
 */

const FUNNEL_START_KEY = "nutriweek_funnel_start";
const EXIT_MODAL_USED_KEY = "nutriweek_exit_modal_done";

const MENU_ITEMS = [
  {
    id: "grilled-chicken-bowl",
    name: "Grilled Chicken Bowl",
    price: 150,
    calories: 520,
    protein: 32,
    fat: 18,
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop&q=80",
  },
  {
    id: "quinoa-salad",
    name: "Mediterranean Quinoa Salad",
    price: 130,
    calories: 380,
    protein: 14,
    fat: 12,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop&q=80",
  },
  {
    id: "tofu-stir-fry",
    name: "Tofu & Veg Stir-Fry",
    price: 120,
    calories: 440,
    protein: 22,
    fat: 14,
    image:
      "https://images.unsplash.com/photo-1644527199880-fcf2bb61b2b4?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "salmon-rice",
    name: "Baked Salmon & Brown Rice",
    price: 180,
    calories: 590,
    protein: 38,
    fat: 22,
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&h=400&fit=crop&q=80",
  },
  {
    id: "lentil-bowl",
    name: "Spiced Lentil Power Bowl",
    price: 125,
    calories: 460,
    protein: 20,
    fat: 10,
    image:
      "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&h=400&fit=crop&q=80",
  },
  {
    id: "egg-wrap",
    name: "Egg White & Avocado Wrap",
    price: 140,
    calories: 410,
    protein: 24,
    fat: 16,
    image:
      "https://plus.unsplash.com/premium_photo-1661722641653-b2d2c631bf26?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const WHATSAPP_NUMBER = "919876543210";
const WHATSAPP_MESSAGE = "Hi, I want to order from NutriWeek";

let userSession = {
  viewedMenu: false,
  itemClicked: false,
  contacted: false,
  frictionReason: null,
  ordered: false,
  timestamps: {},
};

let trackingEvents = [];

let sessionStartMs = null;
let orderClickMs = null;

/** Same-origin navigation deferred while exit modal is open */
let pendingNavigationUrl = null;

function nowIso() {
  return new Date().toISOString();
}

function logSession(stepLabel) {
  const elapsedToOrderSec =
    sessionStartMs != null && orderClickMs != null
      ? ((orderClickMs - sessionStartMs) / 1000).toFixed(2)
      : null;

  const payload = {
    step: stepLabel,
    time: nowIso(),
    session: { ...userSession },
    trackingEvents: [...trackingEvents],
    secondsFromLandingToOrderConfirmed:
      elapsedToOrderSec != null ? Number(elapsedToOrderSec) : null,
  };

  console.log(
    "%c[NutriWeek session]",
    "color:#16a34a;font-weight:bold;",
    stepLabel
  );
  console.table(trackingEvents);
  console.log(JSON.stringify(payload, null, 2));
}

function stamp(key) {
  userSession.timestamps[key] = nowIso();
}

function recordEvent(type, detail) {
  trackingEvents.push({ type, detail, at: nowIso() });
}

function readFunnelStartMs() {
  const raw = sessionStorage.getItem(FUNNEL_START_KEY);
  if (raw == null || raw === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function exitModalAlreadyUsed() {
  return sessionStorage.getItem(EXIT_MODAL_USED_KEY) === "1";
}

function markExitModalUsed() {
  sessionStorage.setItem(EXIT_MODAL_USED_KEY, "1");
}

function showScreen(el) {
  document.querySelectorAll(".screen").forEach((s) => {
    s.classList.remove("screen--active");
    s.hidden = true;
  });
  el.hidden = false;
  el.classList.add("screen--active");
}

function buildWhatsAppUrl() {
  const text = encodeURIComponent(WHATSAPP_MESSAGE);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

function setFrictionReason(value, source) {
  userSession.frictionReason = value;
  stamp("frictionReasonSet");
  recordEvent("friction", { reason: value, source });
  console.log(
    "%c[NutriWeek feedback]",
    "color:#15803d;font-weight:bold;",
    "frictionReason:",
    value,
    "| source:",
    source
  );
  logSession("Feedback: " + source);
}

function syncExitRadioHighlight() {
  const form = document.getElementById("exit-form");
  if (!form) return;
  form.querySelectorAll(".radio-row").forEach((row) => {
    const input = row.querySelector('input[type="radio"]');
    row.classList.toggle("radio-row--checked", input && input.checked);
  });
}

function openExitModal() {
  const modal = document.getElementById("exit-modal");
  const form = document.getElementById("exit-form");
  if (!modal || !form) return;
  modal.hidden = false;
  form.reset();
  syncExitRadioHighlight();
}

function closeExitModal() {
  const modal = document.getElementById("exit-modal");
  if (modal) modal.hidden = true;
}

function finishExitModalFlow() {
  markExitModalUsed();
  closeExitModal();
  const url = pendingNavigationUrl;
  pendingNavigationUrl = null;
  if (url) {
    window.location.assign(url);
  }
}

/**
 * Exit survey: once per browser session; skipped if user already confirmed an order.
 * Custom UI cannot run during tab close; we use mouse-top leave, internal link leave, and popstate best-effort.
 */
function tryShowExitModal(trigger) {
  if (exitModalAlreadyUsed() || userSession.ordered) return;
  const modal = document.getElementById("exit-modal");
  if (!modal || modal.hidden === false) return;

  openExitModal();
  recordEvent("exit_modal", { action: "shown", trigger });
  console.log(
    "%c[NutriWeek exit intent]",
    "color:#ca8a04;font-weight:bold;",
    "modal opened | trigger:",
    trigger
  );
}

function renderMenu() {
  const list = document.getElementById("menu-list");
  if (!list) return;

  list.innerHTML = "";

  MENU_ITEMS.forEach((item) => {
    const li = document.createElement("li");
    li.className = "menu-item-card";
    const alt = escapeHtml(item.name);
    li.innerHTML = `
      <figure class="menu-item-card__media">
        <img src="${item.image}" alt="${alt}" width="600" height="400" loading="lazy" />
      </figure>
      <div class="menu-item-card__body">
        <div class="menu-item-card__row">
          <h3 class="menu-item-card__title">${escapeHtml(item.name)}</h3>
          <span class="price">₹${item.price}</span>
        </div>
        <span class="badge">Verified</span>
        <p class="nutrition">${item.calories} kcal · ${item.protein}g protein · ${item.fat}g fat</p>
        <button type="button" class="btn btn-primary order-btn" data-item-id="${escapeHtml(item.id)}">
          Order from Restaurant
        </button>
      </div>
    `;
    list.appendChild(li);
  });

  list.querySelectorAll(".order-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-item-id");
      const menuItem = MENU_ITEMS.find((m) => m.id === id);

      userSession.itemClicked = true;
      userSession.contacted = true;
      stamp("itemOrderClick");
      stamp("contactShown");

      recordEvent("item", {
        action: "order_from_restaurant",
        itemId: id,
        itemName: menuItem ? menuItem.name : null,
      });
      recordEvent("contact", { action: "section_shown" });

      logSession("Order from Restaurant → contact shown");
      showScreen(document.getElementById("contact"));
    });
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function wireInlineFeedback() {
  document.querySelectorAll("[data-feedback]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = btn.getAttribute("data-feedback");
      if (!value) return;
      setFrictionReason(value, "inline_feedback");
    });
  });
}

function wireExitModal() {
  const form = document.getElementById("exit-form");
  const skipBtn = document.getElementById("exit-btn-skip");
  if (!form || !skipBtn) return;

  form.addEventListener("change", syncExitRadioHighlight);
  form.addEventListener("input", syncExitRadioHighlight);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const selected = form.querySelector('input[name="exit_reason"]:checked');
    if (selected) {
      setFrictionReason(selected.value, "exit_modal_submit");
    } else {
      recordEvent("exit_modal", { action: "submit_without_selection" });
      logSession("Exit modal: submit (no option selected)");
    }
    finishExitModalFlow();
  });

  skipBtn.addEventListener("click", () => {
    recordEvent("exit_modal", { action: "skip" });
    logSession("Exit modal: skip");
    finishExitModalFlow();
  });

  document.querySelectorAll("[data-exit-close]").forEach((el) => {
    el.addEventListener("click", () => {
      recordEvent("exit_modal", { action: "dismiss_backdrop" });
      logSession("Exit modal: dismissed");
      finishExitModalFlow();
    });
  });
}

/** In-page navigation to another path on same origin → optional exit survey */
function wireInternalNavExitCapture() {
  document.addEventListener(
    "click",
    (e) => {
      const a = e.target.closest("a[href]");
      if (!a || a.target === "_blank") return;
      if (a.hasAttribute("download")) return;
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("javascript:")) return;

      let url;
      try {
        url = new URL(a.href, window.location.href);
      } catch {
        return;
      }
      if (url.protocol !== "http:" && url.protocol !== "https:") return;
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;

      if (exitModalAlreadyUsed() || userSession.ordered) return;

      e.preventDefault();
      pendingNavigationUrl = a.href;
      tryShowExitModal("internal_navigation");
    },
    true
  );
}

/** Desktop-style exit intent: pointer moving upward past the top edge */
function wireMouseTopExitIntent() {
  document.documentElement.addEventListener("mouseleave", (e) => {
    if (e.clientY > 0) return;
    if (!e.relatedTarget && e.clientY <= 0) {
      tryShowExitModal("mouse_top_leave");
    }
  });
}

/** Best-effort: back/forward in session history while staying on this document */
function wirePopStateExitIntent() {
  window.history.pushState({ nutriweekGuard: 1 }, "", window.location.href);
  window.addEventListener("popstate", () => {
    if (exitModalAlreadyUsed() || userSession.ordered) return;
    window.history.pushState({ nutriweekGuard: 1 }, "", window.location.href);
    tryShowExitModal("back_button");
  });
}

function wireBeforeUnloadHint() {
  window.addEventListener("beforeunload", () => {
    if (exitModalAlreadyUsed() || userSession.ordered) return;
    recordEvent("page_exit_attempt", { phase: "beforeunload" });
  });
}

function init() {
  const funnelStart = readFunnelStartMs();
  sessionStartMs = funnelStart != null ? funnelStart : Date.now();

  userSession.viewedMenu = true;
  stamp("menuPageLoaded");
  recordEvent("menu", {
    action: "viewed",
    via: funnelStart != null ? "from_landing" : "direct_or_no_timer",
  });
  logSession("Menu page loaded (menu viewed)");

  const wa = document.getElementById("whatsapp-link");
  if (wa) wa.href = buildWhatsAppUrl();

  const orderBtn = document.getElementById("btn-order-placed");
  if (orderBtn) {
    orderBtn.addEventListener("click", () => {
      orderClickMs = Date.now();
      userSession.ordered = true;
      stamp("orderConfirmed");
      recordEvent("order", { action: "user_confirmed_placed" });
      console.log("%c[NutriWeek] Full userSession (order confirmed)", "color:#16a34a;font-weight:bold;");
      console.log(JSON.stringify(userSession, null, 2));
      logSession("User marked: I placed the order (converted)");
    });
  }

  renderMenu();
  wireInlineFeedback();
  wireExitModal();
  wireInternalNavExitCapture();
  wireMouseTopExitIntent();
  wirePopStateExitIntent();
  wireBeforeUnloadHint();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
