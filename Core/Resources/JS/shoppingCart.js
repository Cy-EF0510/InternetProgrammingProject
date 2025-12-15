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
  function createCartRow(item) {
    var row = $("<div/>");
    row.addClass("cart-item");

    var img = $("<img/>");
    img.attr("src", item.image);
    img.attr("alt", item.name);

    var name = $("<div/>");
    name.addClass("cart-name");
    name.text(item.name);

    var price = $("<div/>");
    price.addClass("cart-price");
    price.text("$" + Number(item.price).toFixed(2));

    var qtyControls = $("<div/>");
    qtyControls.addClass("qty-controls");

    var minus = $("<button/>");
    minus.addClass("qty-minus");
    minus.attr("type", "button");
    minus.text("−");

    var qty = $("<span/>");
    qty.text(item.qty);

    var plus = $("<button/>");
    plus.addClass("qty-plus");
    plus.attr("type", "button");
    plus.text("+");

    qtyControls.append(minus);
    qtyControls.append(qty);
    qtyControls.append(plus);

    var lineSubtotal = $("<div/>");
    lineSubtotal.addClass("cart-subtotal");
    lineSubtotal.text(
      "$" + (Number(item.price) * Number(item.qty)).toFixed(2)
    );

    var remove = $("<div/>");
    remove.addClass("remove-btn");
    remove.text("✕");

    row.append(img);
    row.append(name);
    row.append(price);
    row.append(qtyControls);
    row.append(lineSubtotal);
    row.append(remove);

    // minus
    minus.on("click", function () {
      CartManagement.updateQty(item.id, item.qty - 1);
      renderCart();
      CartManagement.updateCartBadge();
    });

    // plus
    plus.on("click", function () {
      CartManagement.updateQty(item.id, item.qty + 1);
      renderCart();
      CartManagement.updateCartBadge();
    });

    // remove
    remove.on("click", function () {
      CartManagement.removeItem(item.id);
      renderCart();
      CartManagement.updateCartBadge();
    });

    return row;
  }

  function renderCart() {
    var cart = CartManagement.getCart();
    var items = $("#cart-items");
    var empty = $("#cart-empty");

    items.empty();

    if (!cart || cart.length === 0) {
      empty.removeClass("hidden");
      updateSummary(0);
      return;
    }

    empty.addClass("hidden");

    var subtotal = 0;

    for (var i = 0; i < cart.length; i++) {
      var item = cart[i];

      subtotal = subtotal + (Number(item.price) * Number(item.qty));

      var row = createCartRow(item); 
      items.append(row);
    }

    updateSummary(subtotal);
  }

/* ===================== SUMMARY ===================== */

function updateSummary(subtotal) {

  var tax = subtotal * TaxRate;
  var total = subtotal + tax;

  var subtotalText = "$" + subtotal.toFixed(2);
  var taxText = "$" + tax.toFixed(2);
  var totalText = "$" + total.toFixed(2);

  $("#cart-subtotal").text(subtotalText);
  $("#cart-tax").text(taxText);
  $("#cart-total").text(totalText);
}

