$(document).ready(function() {
  
        AuthModel.requireLogin();

        HeaderModel.createHeader();
        $("#footer-slot").append(FooterModel.createFooter());
        FooterModel.loadCategories();
        CartManagement.updateCartBadge();
        loadOrderConfirmation();
});


function loadOrderConfirmation() {
  const order = getOrderFromCookie();

  if (!order) {
    $(".order-summary").html("<p>No order found.</p>");
    return;
  }

  $("#order-number").text(order.orderNumber);

  const items = $("#order-items");
  items.empty();

  for (var i = 0; i < order.items.length; i++) {
    var item = order.items[i];

    var row = $("<div/>").addClass("item");

    var img = $("<img/>")
      .addClass("item-image")
      .attr("src", item.image)
      .attr("alt", item.name);

    var details = $("<div/>").addClass("item-details");
    details.append(
      $("<div/>").addClass("item-name").text(item.name + " × " + item.qty)
    );

    var total = Number(item.price) * Number(item.qty);
    var price = $("<div/>")
      .addClass("item-price")
      .text("$" + total.toFixed(2));

    row.append(img, details, price);
    items.append(row);
    
  }

  $("#order-subtotal").text("$" + order.subtotal.toFixed(2));
  $("#order-tax").text("$" + order.tax.toFixed(2));
  $("#order-shipping").text("$" + order.shipping.toFixed(2));
  $("#order-total").text("$" + order.total.toFixed(2));
}


function getOrderFromCookie() {
  const match = document.cookie.match(/(^| )lastOrder=([^;]+)/);
  if (!match) return null;

  try {
    return JSON.parse(decodeURIComponent(match[2]));
  } catch {
    return null;
  }
}

