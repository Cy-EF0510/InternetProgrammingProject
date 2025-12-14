const TaxRate = 0.15;

$(document).ready(function () {
    AuthModel.requireLogin();
    
    HeaderModel.createHeader();
    $("#footer-slot").append(FooterModel.createFooter());
    FooterModel.loadCategories();


    CartManagement.updateCartBadge();
    renderCart();

    $(".checkout-btn").on("click", function () {
        window.location.href = "CheckoutPage.html";
    });

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

    
    const $row = $("<div/>").addClass("cart-item");

    const $img = $("<img/>").attr({
      src: item.image,
      alt: item.name
    });

    const $name = $("<div/>").addClass("cart-name").text(item.name);

    const $price = $("<div/>")
      .addClass("cart-price")
      .text("$" + Number(item.price).toFixed(2));

    const $qtyControls = $("<div/>").addClass("qty-controls");

    const $minus = $("<button/>")
      .addClass("qty-minus")
      .attr("type", "button")
      .text("−");

    const $qty = $("<span/>").text(item.qty);

    const $plus = $("<button/>")
      .addClass("qty-plus")
      .attr("type", "button")
      .text("+");

    $qtyControls.append($minus, $qty, $plus);

    const $subtotal = $("<div/>")
      .addClass("cart-subtotal")
      .text("$" + Number(itemSubtotal).toFixed(2));

    const $remove = $("<div/>")
      .addClass("remove-btn")
      .text("✕");

    // assemble row
    $row.append(
      $img,
      $name,
      $price,
      $qtyControls,
      $subtotal,
      $remove
    );

    

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
  const tax = subtotal * TaxRate;
  const total = subtotal + tax;

  $("#cart-subtotal").text(`$${subtotal.toFixed(2)}`);
  $("#cart-tax").text(`$${tax.toFixed(2)}`);
  $("#cart-total").text(`$${total.toFixed(2)}`);
}
