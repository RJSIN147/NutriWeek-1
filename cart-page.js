/**
 * NutriWeek — Cart page
 *
 * Renders cart items from Cart module, handles quantity changes,
 * and provides a checkout flow via WhatsApp / phone modal.
 */

(function () {
  /* ——— Rendering ——— */

  function renderCart() {
    const list = document.getElementById("cart-list");
    const emptyEl = document.getElementById("cart-empty");
    const summaryEl = document.getElementById("cart-summary");
    const totalEl = document.getElementById("cart-total");
    if (!list) return;

    const items = Cart.getItems();

    if (items.length === 0) {
      list.innerHTML = "";
      if (emptyEl) emptyEl.hidden = false;
      if (summaryEl) summaryEl.hidden = true;
      return;
    }

    if (emptyEl) emptyEl.hidden = true;
    if (summaryEl) summaryEl.hidden = false;
    if (totalEl) totalEl.textContent = "₹" + Cart.getTotal();

    list.innerHTML = items
      .map(
        (item) => `
      <li class="cart-item" data-item-id="${escapeHtml(item.id)}">
        <div class="cart-item__media">
          <img src="${item.image}" alt="${escapeHtml(item.name)}"
               width="72" height="72" loading="lazy" />
        </div>
        <div class="cart-item__info">
          <p class="cart-item__name">${escapeHtml(item.name)}</p>
          <p class="cart-item__restaurant">${escapeHtml(item.restaurant)}</p>
          <span class="cart-item__price">₹${item.price * item.qty}</span>
        </div>
        <div class="qty-controls">
          <button class="qty-btn" data-action="dec" data-id="${escapeHtml(
            item.id
          )}" type="button" aria-label="Decrease quantity">−</button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn" data-action="inc" data-id="${escapeHtml(
            item.id
          )}" type="button" aria-label="Increase quantity">+</button>
        </div>
        <button class="cart-item__remove" data-action="remove" data-id="${escapeHtml(
          item.id
        )}" type="button" aria-label="Remove item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round"
               stroke-linejoin="round">
            <path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </li>`
      )
      .join("");

    wireItemButtons();
  }

  function wireItemButtons() {
    const list = document.getElementById("cart-list");
    if (!list) return;

    list.querySelectorAll("[data-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const action = btn.dataset.action;
        const items = Cart.getItems();
        const item = items.find((i) => i.id === id);
        if (!item) return;

        if (action === "inc") {
          Cart.updateQty(id, item.qty + 1);
        } else if (action === "dec") {
          Cart.updateQty(id, item.qty - 1);
        } else if (action === "remove") {
          Cart.removeItem(id);
        }

        renderCart();
      });
    });
  }

  /* ——— Checkout modal ——— */

  function buildCartWhatsAppUrl() {
    const items = Cart.getItems();
    const lines = items.map(
      (i) => `• ${i.name} ×${i.qty} — ₹${i.price * i.qty}`
    );
    const total = Cart.getTotal();
    const msg = `Hi, I'd like to order from NutriWeek:\n\n${lines.join(
      "\n"
    )}\n\nTotal: ₹${total}`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  }

  function openCheckoutModal() {
    const modal = document.getElementById("checkout-modal");
    const waLink = document.getElementById("whatsapp-link");
    if (!modal) return;
    if (waLink) waLink.href = buildCartWhatsAppUrl();
    modal.hidden = false;
  }

  function closeCheckoutModal() {
    const modal = document.getElementById("checkout-modal");
    if (modal) modal.hidden = true;
  }

  function wireCheckout() {
    const checkoutBtn = document.getElementById("btn-checkout");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        userSession.contacted = true;
        stamp("checkoutStarted");
        recordEvent("cart", { action: "checkout_clicked", total: Cart.getTotal() });
        logSession("Checkout started");
        openCheckoutModal();
      });
    }

    /* Close backdrop */
    document.querySelectorAll("[data-checkout-close]").forEach((el) => {
      el.addEventListener("click", () => closeCheckoutModal());
    });

    /* "I placed the order" */
    const orderBtn = document.getElementById("btn-order-placed");
    if (orderBtn) {
      orderBtn.addEventListener("click", () => {
        orderClickMs = Date.now();
        userSession.ordered = true;
        stamp("orderConfirmed");
        recordEvent("order", { action: "user_confirmed_placed", total: Cart.getTotal() });
        logSession("User marked: I placed the order (converted)");
        Cart.clear();
        closeCheckoutModal();
        renderCart();
        showToast("Order confirmed! Thank you 🎉", 3500);
      });
    }
  }

  /* ——— Init ——— */

  function cartInit() {
    renderCart();
    wireCheckout();

    stamp("cartPageLoaded");
    recordEvent("cart_page", { action: "viewed", itemCount: Cart.getCount() });
    logSession("Cart page loaded");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", cartInit);
  } else {
    cartInit();
  }
})();
