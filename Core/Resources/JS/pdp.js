$(document).ready(function () {

  // Header / footer / cart badge
  HeaderModel.createHeader();
  FooterModel.buildFooter();

  CartManagement.updateCartBadge();

  // Get id from URL
  var productId = getParam("id");

  // Validate id
  if (productId === null || productId === "") {
    $("#pdp-status").text("Missing product id in URL.");
    $("#pdp").addClass("hidden");
    return;
  }

  // Setup qty buttons
  setupQtyControls();

  // Load product data
  loadProductById(productId);
});


function getParam(name) {
  var params = new URLSearchParams(window.location.search);
  var value = params.get(name);
  return value;
}


function loadProductById(id) {

  $("#pdp-status").removeClass("hidden");
  $("#pdp-status").text("Loading...");
  $("#pdp").addClass("hidden");

  $.getJSON("./Data/products.json")
    .done(function (data) {

      // products can be an array OR { products: [] }
      var products = [];

      if (Array.isArray(data)) {
        products = data;
      } else if (data && Array.isArray(data.products)) {
        products = data.products;
      }

      // Find product by id
      var foundProduct = null;

      for (var i = 0; i < products.length; i++) {
        var p = products[i];

        if (String(p.id) === String(id)) {
          foundProduct = p;
          break;
        }
      }

      // Not found
      if (foundProduct === null) {
        $("#pdp-status").text("Product not found.");
        $("#pdp").addClass("hidden");
        return;
      }

      // Render main product UI
      renderPdp(foundProduct);

      // Extra sections
      renderRelatedProducts(foundProduct, products);
      renderReviews(foundProduct);
      setupAddToCart(foundProduct);

      // Show page
      $("#pdp-status").addClass("hidden");
      $("#pdp").removeClass("hidden");
    })
    .fail(function () {
      $("#pdp-status").text("Failed to load products.json. Check the path.");
      $("#pdp").addClass("hidden");
    });
}


function renderPdp(product) {

  var rawPrice = product.price;
  var priceNumber = Number(rawPrice);

  var skuText = "";
  if (product.sku) {
    skuText = product.sku;
  } else {
    skuText = "SKU-" + product.id;
  }

  // Determine stock
  var inStock = true;

  if (product.availability !== undefined) {
    inStock = product.availability ? true : false;
  } else if (product.stock !== undefined) {
    inStock = Number(product.stock) > 0;
  }

  // Title + description
  var title = product.name || product.title || "Untitled Product";
  $("#pdp-title").text(title);

  var desc = product.description || "No description provided.";
  $("#pdp-desc").text(desc);

  // Price
  if (!isNaN(priceNumber)) {
    $("#pdp-price").text("$" + priceNumber.toFixed(2));
  } else {
    $("#pdp-price").text("");
  }

  // SKU
  $("#pdp-sku").text(skuText);

  // Image
  $("#pdp-img").attr("src", product.image || "");
  $("#pdp-img").attr("alt", title);

  // Availability badge
  $("#pdp-availability").text(inStock ? "In Stock" : "Out of Stock");
  $("#pdp-availability").toggleClass("badge-ok", inStock);
  $("#pdp-availability").toggleClass("badge-bad", !inStock);

  // Disable button if not in stock
  $("#add-to-cart").prop("disabled", !inStock);
}


function setupQtyControls() {

  $("#qty-minus").on("click", function () {
    var current = Number($("#qty-input").val());
    var next = current - 1;
    next = clampQty(next);
    $("#qty-input").val(next);
  });

  $("#qty-plus").on("click", function () {
    var current = Number($("#qty-input").val());
    var next = current + 1;
    next = clampQty(next);
    $("#qty-input").val(next);
  });

  $("#qty-input").on("input", function () {
    var current = Number($("#qty-input").val());
    var fixed = clampQty(current);
    $("#qty-input").val(fixed);
  });
}


function clampQty(n) {
  if (!Number.isFinite(n)) {
    return 1;
  }
  if (n < 1) {
    return 1;
  }
  return Math.floor(n);
}


function setupAddToCart(product) {

  // Remove old click handler then add new
  $("#add-to-cart").off("click");

  $("#add-to-cart").on("click", function () {

    var qtyInput = Number($("#qty-input").val());
    var qty = clampQty(qtyInput);

    CartManagement.addToCart(product, qty);

    $("#cart-msg").text("Added " + qty + " to cart.");

    setTimeout(function () {
      $("#cart-msg").text("");
    }, 1500);
  });
}


/* ---------------- RELATED PRODUCTS ---------------- */

var PDP_PAGE = "ProductDetailPage.html";

function renderRelatedProducts(current, allProducts) {

  var currentId = String(current.id);

  var currentCategory = "";
  if (current.category) {
    currentCategory = String(current.category).toLowerCase();
  }

  var related = [];

  // Pick same-category products first
  for (var i = 0; i < allProducts.length; i++) {

    var p = allProducts[i];

    if (String(p.id) === currentId) {
      continue;
    }

    var cat = "";
    if (p.category) {
      cat = String(p.category).toLowerCase();
    }

    if (currentCategory !== "" && cat === currentCategory) {
      related.push(p);
    }
  }

  // If not enough, fallback to random other items
  if (related.length < 4) {

    var fallback = [];

    for (var j = 0; j < allProducts.length; j++) {
      if (String(allProducts[j].id) !== currentId) {
        fallback.push(allProducts[j]);
      }
    }

    related = shuffle(fallback);
  } else {
    related = shuffle(related);
  }

  // Limit cards
  related = related.slice(0, 6);

  var grid = $("#related-grid");
  grid.empty();

  for (var k = 0; k < related.length; k++) {

    var item = related[k];

    var itemPriceNum = Number(item.price);

    var card = $("<div>");
    card.addClass("rel-card");
    card.css("cursor", "pointer");

    // Use a function wrapper so each card keeps its own id
    card.on("click", (function (pid) {
      return function () {
        window.location.href = PDP_PAGE + "?id=" + pid;
      };
    })(item.id));

    var img = $("<img>");
    img.addClass("rel-img");
    img.attr("src", item.image || "");
    img.attr("alt", item.name || item.title || "");

    var nameDiv = $("<div>");
    nameDiv.addClass("rel-name");
    nameDiv.text(item.name || item.title || "Product");

    var priceDiv = $("<div>");
    priceDiv.addClass("rel-price");

    if (!isNaN(itemPriceNum)) {
      priceDiv.text("$" + itemPriceNum.toFixed(2));
    } else {
      priceDiv.text("");
    }

    card.append(img);
    card.append(nameDiv);
    card.append(priceDiv);

    grid.append(card);
  }
}


function shuffle(arr) {
  var copy = arr.slice();

  for (var i = copy.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }

  return copy;
}


/* ---------------- REVIEWS (mock) ---------------- */

function renderReviews(product) {

  var productId = String(product.id);

  $.getJSON("./Data/reviews.json")
    .done(function (data) {

      var entry = null;

      for (var i = 0; i < data.length; i++) {
        if (String(data[i].product_id) === productId) {
          entry = data[i];
          break;
        }
      }

      var reviews = [];
      if (entry && entry.reviews) {
        reviews = entry.reviews;
      }

      paintReviews(reviews);
    })
    .fail(function () {
      paintReviews([]);
      console.log("Could not load ./Data/reviews.json");
    });
}


function paintReviews(reviews) {

  var wrap = $("#reviews-wrap");
  wrap.empty();

  if (!reviews || reviews.length === 0) {
    var empty = $("<div>");
    empty.addClass("review-empty");
    empty.text("No reviews yet.");
    wrap.append(empty);
    return;
  }

  for (var i = 0; i < reviews.length; i++) {

    var r = reviews[i];

    var ratingNumber = Number(r.rating);
    var starCount = clampStars(ratingNumber);

    var card = $("<div>");
    card.addClass("review-card");

    var top = $("<div>");
    top.addClass("review-top");

    var left = $("<div>");

    var user = $("<div>");
    user.addClass("review-name");
    user.text(r.user || "Anonymous");

    var title = $("<div>");
    title.addClass("review-title");
    title.text(r.title || "");

    left.append(user);
    left.append(title);

    var starsDiv = $("<div>");
    starsDiv.addClass("review-stars");
    starsDiv.text("★".repeat(starCount) + "☆".repeat(5 - starCount));

    top.append(left);
    top.append(starsDiv);

    var text = $("<div>");
    text.addClass("review-text");
    text.text(r.comment || "");

    card.append(top);
    card.append(text);

    wrap.append(card);
  }
}


function clampStars(n) {
  if (!Number.isFinite(n)) return 0;
  if (n < 0) return 0;
  if (n > 5) return 5;
  return Math.floor(n);
}
