/**
 * NutriWeek — Shared module
 *
 * Loaded on EVERY page (after data.js). Provides:
 *   • Navbar rendering with search, cart badge, and profile link
 *   • Cart state management (localStorage-backed)
 *   • Session / funnel analytics (ported from original script.js)
 *   • Exit-intent modal (mouse-top, back-button, internal-nav)
 *   • Inline feedback wiring
 *   • Toast notifications
 *   • Generic utility functions
 */

/* ================================================================
   UTILITIES
   ================================================================ */

function escapeHtml(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

function nowIso() {
  return new Date().toISOString();
}

function getUrlParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

/* ================================================================
   CART MODULE  (localStorage-backed)
   ================================================================ */

const Cart = (() => {
  const KEY = "nutriweek_cart";

  function _read() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch {
      return [];
    }
  }

  function _write(items) {
    localStorage.setItem(KEY, JSON.stringify(items));
    _updateBadge();
  }

  function _updateBadge() {
    const badge = document.getElementById("cart-badge");
    if (!badge) return;
    const count = getCount();
    badge.textContent = count;
    badge.hidden = count === 0;
  }

  function getItems() {
    return _read();
  }

  function addItem(meal) {
    const items = _read();
    const existing = items.find((i) => i.id === meal.id);
    if (existing) {
      existing.qty += 1;
    } else {
      items.push({
        id: meal.id,
        name: meal.name,
        restaurant: meal.restaurant,
        price: meal.price,
        image: meal.image,
        qty: 1,
      });
    }
    _write(items);
    showToast(`${meal.name} added to cart`);
    recordEvent("cart", { action: "add_item", itemId: meal.id, itemName: meal.name });
  }

  function removeItem(mealId) {
    const items = _read().filter((i) => i.id !== mealId);
    _write(items);
  }

  function updateQty(mealId, qty) {
    if (qty <= 0) {
      removeItem(mealId);
      return;
    }
    const items = _read();
    const item = items.find((i) => i.id === mealId);
    if (!item) return;
    item.qty = qty;
    _write(items);
  }

  function getCount() {
    return _read().reduce((sum, i) => sum + i.qty, 0);
  }

  function getTotal() {
    return _read().reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  function clear() {
    _write([]);
  }

  return { getItems, addItem, removeItem, updateQty, getCount, getTotal, clear, updateBadge: _updateBadge };
})();

/* ================================================================
   TOAST NOTIFICATIONS
   ================================================================ */

function showToast(message, duration) {
  duration = duration || 2500;
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  container.appendChild(toast);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add("toast--visible"));
  });
  setTimeout(() => {
    toast.classList.remove("toast--visible");
    toast.addEventListener("transitionend", () => toast.remove(), { once: true });
  }, duration);
}

/* ================================================================
   NAVBAR
   ================================================================ */

function renderNavbar() {
  const el = document.getElementById("app-navbar");
  if (!el) return;

  const searchQuery = getUrlParam("q") || "";

  el.innerHTML = `
    <div class="navbar-inner">
      <a href="index.html" class="logo logo--link" aria-label="NutriWeek Home">
        <span class="logo-mark">N</span>
        <span class="logo-copy">
          <span class="logo-copy__name">NutriWeek</span>
          <span class="logo-copy__tag">Fresh weekday fuel</span>
        </span>
      </a>

      <form class="navbar-search" action="search.html" method="GET" role="search">
        <svg class="navbar-search__icon" width="16" height="16" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
        <input type="search" name="q" class="navbar-search__input"
               placeholder="Search healthy meals…"
               value="${escapeHtml(searchQuery)}" autocomplete="off" />
      </form>

      <div class="navbar-actions">
        <a href="cart.html" class="navbar-action" aria-label="Cart" id="navbar-cart-link">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <span class="cart-badge" id="cart-badge" hidden>0</span>
        </a>
        <a href="profile.html" class="navbar-action" aria-label="Profile">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </a>
      </div>
    </div>
  `;

  Cart.updateBadge();
}

/* ================================================================
   SESSION ANALYTICS  (ported from original script.js)
   ================================================================ */

const FUNNEL_START_KEY = "nutriweek_funnel_start";
const EXIT_MODAL_USED_KEY = "nutriweek_exit_modal_done";

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

/** Deferred navigation URL while exit modal is open */
function stamp(key) {
  userSession.timestamps[key] = nowIso();
}

function recordEvent(type, detail) {
  trackingEvents.push({ type, detail, at: nowIso() });
}

function logSession(stepLabel) {
  const elapsedSec =
    sessionStartMs != null && orderClickMs != null
      ? ((orderClickMs - sessionStartMs) / 1000).toFixed(2)
      : null;

  const payload = {
    step: stepLabel,
    time: nowIso(),
    session: { ...userSession },
    trackingEvents: [...trackingEvents],
    secondsFromLandingToOrderConfirmed:
      elapsedSec != null ? Number(elapsedSec) : null,
  };

  console.log(
    "%c[NutriWeek session]",
    "color:#16a34a;font-weight:bold;",
    stepLabel
  );
  console.table(trackingEvents);
  console.log(JSON.stringify(payload, null, 2));
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

/* ================================================================
   EXIT-INTENT MODAL  (ported from original script.js)
   ================================================================ */

function _exitModalHtml() {
  return `
  <div id="exit-modal" class="modal modal--exit" role="dialog"
       aria-modal="true" aria-labelledby="exit-modal-title" hidden>
    <div class="modal-backdrop" data-exit-close="backdrop"></div>
    <div class="modal-panel modal-panel--exit">
      <h3 id="exit-modal-title" class="modal-panel__title">
        Before you leave — what stopped you from ordering?
      </h3>
      <form id="exit-form">
        <fieldset class="friction-options exit-options">
          <label class="radio-row">
            <input type="radio" name="exit_reason" value="price_too_high" />
            <span>Price too high</span>
          </label>
          <label class="radio-row">
            <input type="radio" name="exit_reason" value="not_enough_variety" />
            <span>Not enough variety</span>
          </label>
          <label class="radio-row">
            <input type="radio" name="exit_reason" value="dont_trust_nutrition" />
            <span>Don't trust nutrition info</span>
          </label>
          <label class="radio-row">
            <input type="radio" name="exit_reason" value="just_browsing" />
            <span>Just browsing</span>
          </label>
        </fieldset>
        <div class="modal-actions modal-actions--exit">
          <button type="button" class="btn btn-ghost" id="exit-btn-skip">Skip</button>
          <button type="submit" class="btn btn-primary" id="exit-btn-submit">Submit</button>
        </div>
      </form>
    </div>
  </div>`;
}

function injectExitModal() {
  if (document.getElementById("exit-modal")) return;
  document.body.insertAdjacentHTML("beforeend", _exitModalHtml());
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
}

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

function wireMouseTopExitIntent() {
  document.documentElement.addEventListener("mouseleave", (e) => {
    if (e.clientY > 0) return;
    if (!e.relatedTarget && e.clientY <= 0) {
      tryShowExitModal("mouse_top_leave");
    }
  });
}

function wireBeforeUnloadHint() {
  window.addEventListener("beforeunload", () => {
    if (exitModalAlreadyUsed() || userSession.ordered) return;
    recordEvent("page_exit_attempt", { phase: "beforeunload" });
  });
}

/* ================================================================
   INLINE FEEDBACK
   ================================================================ */

function wireInlineFeedback() {
  document.querySelectorAll("[data-feedback]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = btn.getAttribute("data-feedback");
      if (!value) return;
      setFrictionReason(value, "inline_feedback");
      /* Visual confirmation */
      btn.style.borderColor = "var(--accent)";
      btn.style.color = "var(--accent)";
      btn.style.background = "var(--accent-soft)";
    });
  });
}

/* ================================================================
   SHARED INITIALISATION — runs on every page
   ================================================================ */

function sharedInit() {
  const funnelStart = readFunnelStartMs();
  sessionStartMs = funnelStart != null ? funnelStart : Date.now();

  renderNavbar();
  injectExitModal();
  wireExitModal();
  wireMouseTopExitIntent();
  wireBeforeUnloadHint();
  wireInlineFeedback();

  /* Record page view */
  const page = window.location.pathname.split("/").pop() || "index.html";
  recordEvent("page_view", { page });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", sharedInit);
} else {
  sharedInit();
}
