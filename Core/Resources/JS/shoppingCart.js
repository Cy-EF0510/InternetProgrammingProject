$(document).ready(function () {
    HeaderModel.createHeader();
    $("#footer-slot").append(FooterModel.createFooter());

    CartManagement.updateCartBadge();
    renderCart();
});



/* ===================== RENDER CART ===================== */

function renderCart() {
  const cart = CartManagement.getCart();
  const $items = $("#cart-items");
  const $empty = $("#cart-empty");

  $items.empty();

  if (!cart.length) {
    $empty.removeClass("hidden");
    updateSummary(0);
    return;
  }

  $empty.addClass("hidden");

  let subtotal = 0;

  cart.forEach(item => {
    const itemSubtotal = item.price * item.qty;
    subtotal += itemSubtotal;

    const $row = $(`
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-name">${item.name}</div>
        <div class="cart-price">$${item.price.toFixed(2)}</div>

        <div class="qty-controls">
          <button class="qty-minus">−</button>
          <span>${item.qty}</span>
          <button class="qty-plus">+</button>
        </div>

        <div class="cart-subtotal">$${itemSubtotal.toFixed(2)}</div>
        <div class="remove-btn">✕</div>
      </div>
    `);

    // qty -
    $row.find(".qty-minus").on("click", () => {
      CartManagement.updateQty(item.id, item.qty - 1);
      renderCart();
    });

    // qty +
    $row.find(".qty-plus").on("click", () => {
      CartManagement.updateQty(item.id, item.qty + 1);
      renderCart();
    });

    // remove
    $row.find(".remove-btn").on("click", () => {
      CartManagement.removeItem(item.id);
      renderCart();
    });

    $items.append($row);
  });

  updateSummary(subtotal);
}

/* ===================== SUMMARY ===================== */

function updateSummary(subtotal) {
  $("#cart-subtotal").text(`$${subtotal.toFixed(2)}`);
  $("#cart-total").text(`$${subtotal.toFixed(2)}`);
}