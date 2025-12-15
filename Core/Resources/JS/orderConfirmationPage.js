$(document).ready(function () {

  // Force login first
  AuthModel.requireLogin();

  // Build header
  HeaderModel.createHeader();

  // Build footer
  var footer = FooterModel.createFooter();
  $("#footer-slot").append(footer);

  // Load footer categories
  FooterModel.loadCategories();

  // Update cart badge
  CartManagement.updateCartBadge();

  // Load order info
  loadOrderConfirmation();
});


function loadOrderConfirmation() {

  var order = getOrderFromCookie();

  // No order found
  if (order === null) {
    $(".order-summary").html("<p>No order found.</p>");
    return;
  }

  // Order number
  $("#order-number").text(order.orderNumber);

  var itemsContainer = $("#order-items");
  itemsContainer.empty();

  // Loop through items
  for (var i = 0; i < order.items.length; i++) {

    var item = order.items[i];

    var row = $("<div>");
    row.addClass("item");

    var img = $("<img>");
    img.addClass("item-image");
    img.attr("src", item.image);
    img.attr("alt", item.name);

    var details = $("<div>");
    details.addClass("item-details");

    var name = $("<div>");
    name.addClass("item-name");
    name.text(item.name + " x " + item.qty);

    details.append(name);

    var totalPrice = Number(item.price) * Number(item.qty);

    var price = $("<div>");
    price.addClass("item-price");
    price.text("$" + totalPrice.toFixed(2));

    row.append(img);
    row.append(details);
    row.append(price);

    itemsContainer.append(row);
  }

  // Totals
  $("#order-subtotal").text("$" + order.subtotal.toFixed(2));
  $("#order-tax").text("$" + order.tax.toFixed(2));
  $("#order-shipping").text("$" + order.shipping.toFixed(2));
  $("#order-total").text("$" + order.total.toFixed(2));
}


function getOrderFromCookie() {

  var cookieMatch = document.cookie.match(/(^| )lastOrder=([^;]+)/);

  if (!cookieMatch) {
    return null;
  }

  try {
    var decoded = decodeURIComponent(cookieMatch[2]);
    var orderObject = JSON.parse(decoded);
    return orderObject;
  } catch (e) {
    return null;
  }
}
