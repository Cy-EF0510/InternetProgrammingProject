$(document).ready(function () {

  // header / footer / cart badge
  HeaderModel.createHeader();
  $("#footer-slot").html(FooterModel.createFooter());
  FooterModel.loadCategories();
  CartManagement.updateCartBadge();

  // get id from url
  var id = getParam("id");

  if (id == null || id === "") {
    $("#pdp-status").text("Missing product id in URL.");
    $("#pdp").addClass("hidden");
    return;
  }

  // setup buttons
  setupQtyControls();

  // load product
  loadProductById(id);
});

function getParam(name) {
  var params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function loadProductById(id) {
  $("#pdp-status").removeClass("hidden").text("Loading...");
  $("#pdp").addClass("hidden");

  $.getJSON("./Data/products.json")
    .done(function (data) {

      // data might be array or {products:[]}
      var products = [];
      if (Array.isArray(data)) {
        products = data;
      } else if (data && Array.isArray(data.products)) {
        products = data.products;
      }

      var product = null;
      for (var i = 0; i < products.length; i++) {
        if (String(products[i].id) === String(id)) {
          product = products[i];
          break;
        }
      }

      if (!product) {
        $("#pdp-status").text("Product not found.");
        $("#pdp").addClass("hidden");
        return;
      }

      renderPdp(product);

      // extra sections
      renderRelatedProducts(product, products);
      renderReviews(product);
      setupAddToCart(product);

      // show page
      $("#pdp-status").addClass("hidden");
      $("#pdp").removeClass("hidden");
    })
    .fail(function () {
      $("#pdp-status").text("Failed to load products.json. Check the path.");
      $("#pdp").addClass("hidden");
    });
}

function renderPdp(product) {
  var price = Number(product.price);
  var sku = product.sku ? product.sku : ("SKU-" + product.id);

  var inStock = true;
  if (product.availability !== undefined) {
    inStock = !!product.availability;
  } else if (product.stock !== undefined) {
    inStock = Number(product.stock) > 0;
  }

  $("#pdp-title").text(product.name || product.title || "Untitled Product");
  $("#pdp-desc").text(product.description || "No description provided.");

  if (!isNaN(price)) {
    $("#pdp-price").text("$" + price.toFixed(2));
  } else {
    $("#pdp-price").text("");
  }

  $("#pdp-sku").text(sku);

  $("#pdp-img").attr("src", product.image || "");
  $("#pdp-img").attr("alt", product.name || product.title || "Product image");

  $("#pdp-availability").text(inStock ? "In Stock" : "Out of Stock");
  $("#pdp-availability").toggleClass("badge-ok", inStock);
  $("#pdp-availability").toggleClass("badge-bad", !inStock);

  $("#add-to-cart").prop("disabled", !inStock);
}

function setupQtyControls() {
  $("#qty-minus").on("click", function () {
    var v = Number($("#qty-input").val());
    v = v - 1;
    v = clampQty(v);
    $("#qty-input").val(v);
  });

  $("#qty-plus").on("click", function () {
    var v = Number($("#qty-input").val());
    v = v + 1;
    v = clampQty(v);
    $("#qty-input").val(v);
  });

  $("#qty-input").on("input", function () {
    var v = Number($("#qty-input").val());
    $("#qty-input").val(clampQty(v));
  });
}

function clampQty(n) {
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.floor(n);
}

function setupAddToCart(product) {
  $("#add-to-cart").off("click").on("click", function () {
    var qty = clampQty(Number($("#qty-input").val()));

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
  var currentCat = (current.category || "").toString().toLowerCase();

  var related = [];

  // same category first
  for (var i = 0; i < allProducts.length; i++) {
    var p = allProducts[i];
    if (String(p.id) === currentId) continue;

    var cat = (p.category || "").toString().toLowerCase();
    if (currentCat && cat === currentCat) {
      related.push(p);
    }
  }

  // fallback random if not enough
  if (related.length < 4) {
    var fallback = [];
    for (var j = 0; j < allProducts.length; j++) {
      if (String(allProducts[j].id) !== currentId) fallback.push(allProducts[j]);
    }
    related = shuffle(fallback);
  } else {
    related = shuffle(related);
  }

  related = related.slice(0, 6);

  var grid = $("#related-grid");
  grid.empty();

  for (var k = 0; k < related.length; k++) {
    var item = related[k];
    var price = Number(item.price);

    var card = $("<div/>").addClass("rel-card").css("cursor", "pointer");

    card.on("click", (function (pid) {
      return function () {
        window.location.href = PDP_PAGE + "?id=" + pid;
      };
    })(item.id));

    var img = $("<img/>").addClass("rel-img").attr({
      src: item.image || "",
      alt: item.name || item.title || ""
    });

    var name = $("<div/>").addClass("rel-name").text(item.name || item.title || "Product");
    var price = $("<div/>").addClass("rel-price");
    price.text(isNaN(price) ? "" : ("$" + price.toFixed(2)));

    card.append(img, name, price);
    grid.append(card);
  }
}

function shuffle(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a;
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
      if (entry && entry.reviews) reviews = entry.reviews;

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
    wrap.append(
      $("<div/>").addClass("review-empty").text("No reviews yet.")
    );
    return;
  }

  for (var i = 0; i < reviews.length; i++) {
    var r = reviews[i];
    var stars = clampStars(Number(r.rating));

    var card = $("<div/>").addClass("review-card");
    var top = $("<div/>").addClass("review-top");

    var left = $("<div/>");
    var user = $("<div/>").addClass("review-name").text(r.user || "Anonymous");
    var title = $("<div/>").addClass("review-title").text(r.title || "");
    left.append(user, title);

    var stars = $("<div/>")
      .addClass("review-stars")
      .text("★".repeat(stars) + "☆".repeat(5 - stars));

    top.append(left, stars);

    var text = $("<div/>").addClass("review-text").text(r.comment || "");

    card.append(top, text);
    wrap.append(card);
  }
}

function clampStars(n) {
  if (!Number.isFinite(n)) return 0;
  if (n < 0) return 0;
  if (n > 5) return 5;
  return Math.floor(n);
}
