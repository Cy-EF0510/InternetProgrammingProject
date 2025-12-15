// totals we keep for the order
var checkoutTotals = {
  subtotal: 0,
  tax: 0,
  shipping: 0,
  total: 0
};

var TaxRate = 0.15;

var ShippingPrices = {
  standard: 0,
  express: 9.99
};

$(document).ready(function () {

  // must be logged in
  AuthModel.requireLogin();

  // header + footer
  HeaderModel.createHeader();
  $("#footer-slot").append(FooterModel.createFooter());
  FooterModel.loadCategories();

  // cart badge
  CartManagement.updateCartBadge();

  // live validation
  ValidatorModel.bindLive();

  // first render
  renderCheckoutSummary();

  // submit checkout
  $("#checkoutForm").on("submit", function (e) {
    e.preventDefault();

    var paymentMethod = $("input[name='payment']:checked").val();

    var checkoutValid = ValidatorModel.checkCheckout();
    var cardValid = true;

    if (paymentMethod === "card") {
      cardValid = ValidatorModel.validateCard();
    }

    if (!(checkoutValid && cardValid)) {
      return;
    }

    var orderData = buildOrderData();

    saveLastOrderCookie(orderData);

    // fake place order
    CartManagement.clearCart();
    window.location.href = "OrderConfirmationPage.html";
  });

  // delivery changes shipping
  $("input[name='delivery']").on("change", function () {
    renderCheckoutSummary();
  });

  // payment changes card fields
  $("input[name='payment']").on("change", function () {
    togglePaymentUI();
  });

  // run once so UI is correct on load
  togglePaymentUI();
});


/* =========================
   HELPERS
========================= */

function buildOrderData() {
  var orderNumber = makeOrderNumber();

  return {
    orderNumber: orderNumber,
    items: CartManagement.getCart(),
    subtotal: checkoutTotals.subtotal,
    tax: checkoutTotals.tax,
    shipping: checkoutTotals.shipping,
    total: checkoutTotals.total
  };
}

function makeOrderNumber() {
  var num = Math.floor(100000 + Math.random() * 900000);
  return "RM-" + num;
}

function saveLastOrderCookie(orderData) {
  document.cookie =
    "lastOrder=" + encodeURIComponent(JSON.stringify(orderData)) +
    "; path=/; max-age=300"; // 5 minutes
}

function togglePaymentUI() {
  var method = $("input[name='payment']:checked").val();

  if (method === "paypal") {
    $(".card-fields").addClass("hidden");
    $(".paypal-message").removeClass("hidden");
  } else {
    $(".card-fields").removeClass("hidden");
    $(".paypal-message").addClass("hidden");
  }
}


/* =========================
   RENDER SUMMARY
========================= */

function renderCheckoutSummary() {
  var cart = CartManagement.getCart();
  var items = $("#checkout-items");

  items.empty();

  var subtotal = 0;

  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];

    var itemTotal = Number(item.price) * Number(item.qty);
    subtotal = subtotal + itemTotal;

    var line =
      "<div class='summary-item'>" +
      item.name + " × " + item.qty +
      "<span>$" + itemTotal.toFixed(2) + "</span>" +
      "</div>";

    items.append(line);
  }

  var deliveryType = $("input[name='delivery']:checked").val();
  var shipping = ShippingPrices[deliveryType];

  if (shipping === undefined || shipping === null) {
    shipping = 0;
  }

  var tax = subtotal * TaxRate;
  var total = subtotal + tax + shipping;

  // save totals
  checkoutTotals.subtotal = subtotal;
  checkoutTotals.tax = tax;
  checkoutTotals.shipping = shipping;
  checkoutTotals.total = total;

  // update UI
  $("#co-subtotal").text("$" + subtotal.toFixed(2));
  $("#co-tax").text("$" + tax.toFixed(2));
  $("#co-shipping").text("$" + shipping.toFixed(2));
  $("#co-total").text("$" + total.toFixed(2));
}
