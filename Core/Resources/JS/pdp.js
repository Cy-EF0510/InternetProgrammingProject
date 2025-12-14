$(document).ready(function () {
  $("#footer-slot").html(FooterModel.createFooter());
  FooterModel.loadCategories();
  HeaderModel.createHeader();
  CartManagement.updateCartBadge();
  const id = getParam("id");

  if (!id) {
    showError("Missing product id in URL.");
    return;
  }

  loadProductById(id);
  setupQtyControls();
});

function getParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function showError(msg) {
  $("#pdp-status").text(msg);
  $("#pdp").addClass("hidden");
}

function showPdp() {
  $("#pdp-status").addClass("hidden");
  $("#pdp").removeClass("hidden");
}

function loadProductById(id) {
  $.getJSON("./Data/products.json")
    .done(function (products) {
      // products could be array, or {products:[...]} depending on your file
      const list = Array.isArray(products) ? products : (products.products || []);
      const product = list.find(p => String(p.id) === String(id));

      if (!product) {
        showError("Product not found.");
        return;
      }

      renderPdp(product);
      renderRelatedProducts(product, list);
      renderReviews(product);
      setupAddToCart(product);
      showPdp();
    })
    .fail(function () {
      showError("Failed to load products.json. Check the path.");
    });
}

function renderPdp(product) {
  const price = Number(product.price);
  const sku = product.sku ? product.sku : `SKU-${product.id}`;
  const inStock = product.availability !== undefined
    ? !!product.availability
    : (product.stock === undefined ? true : Number(product.stock) > 0);

  $("#pdp-title").text(product.name || product.title || "Untitled Product");
  $("#pdp-desc").text(product.description || "No description provided.");
  $("#pdp-price").text(isNaN(price) ? "" : `$${price.toFixed(2)}`);
  $("#pdp-sku").text(sku);

  $("#pdp-img")
    .attr("src", (product.image || "").toString())
    .attr("alt", product.name || product.title || "Product image");

  $("#pdp-availability")
    .text(inStock ? "In Stock" : "Out of Stock")
    .toggleClass("badge-ok", inStock)
    .toggleClass("badge-bad", !inStock);

  // Disable add to cart if out of stock
  $("#add-to-cart").prop("disabled", !inStock);
}

function setupQtyControls() {
  $("#qty-minus").on("click", function () {
    const v = clampQty(Number($("#qty-input").val()) - 1);
    $("#qty-input").val(v);
  });

  $("#qty-plus").on("click", function () {
    const v = clampQty(Number($("#qty-input").val()) + 1);
    $("#qty-input").val(v);
  });

  $("#qty-input").on("input", function () {
    $("#qty-input").val(clampQty(Number($("#qty-input").val())));
  });
}

function clampQty(n) {
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.floor(n);
}

/* ---------------- CART (localStorage) ----------------
Cart format:
[
  { id: "14", qty: 2 }
]
------------------------------------------------------ */
// function getCart() {
//   try {
//     return JSON.parse(localStorage.getItem("cart") || "[]");
//   } catch (e) {
//     return [];
//   }
// }

// function saveCart(cart) {
//   localStorage.setItem("cart", JSON.stringify(cart));
// }

function setupAddToCart(product) {
  $("#add-to-cart").off("click").on("click", function () {
    const qty = clampQty(Number($("#qty-input").val()));

    CartManagement.addToCart(product, qty);

    $("#cart-msg").text(`Added ${qty} to cart.`);
    setTimeout(() => $("#cart-msg").text(""), 1500);
  });
}


/* ---------------- RELATED PRODUCTS ---------------- */
const PDP_PAGE = "ProductDetailPage.html";

function renderRelatedProducts(current, allProducts) {
  const currentId = String(current.id);
  const currentCat = (current.category || "").toString().toLowerCase();

  let related = allProducts
    .filter(p => String(p.id) !== currentId)
    .filter(p => currentCat && (p.category || "").toString().toLowerCase() === currentCat);

  // Fallback: if no category matches, use random products
  if (related.length < 4) {
    const fallback = allProducts.filter(p => String(p.id) !== currentId);
    related = shuffle(fallback).slice(0, 6);
  } else {
    related = shuffle(related).slice(0, 6);
  }

  const $grid = $("#related-grid");
  $grid.empty();

  related.forEach(p => {
    const price = Number(p.price);
    const $card = $("<div/>").addClass("rel-card").css("cursor", "pointer");

    $card.on("click", function () {
      window.location.href = `${PDP_PAGE}?id=${p.id}`;
    });

    const $img = $("<img/>")
      .addClass("rel-img")
      .attr("src", (p.image || "").toString())
      .attr("alt", p.name || p.title || "");

    const $name = $("<div/>").addClass("rel-name").text(p.name || p.title || "Product");
    const $price = $("<div/>").addClass("rel-price").text(isNaN(price) ? "" : `$${price.toFixed(2)}`);

    $card.append($img, $name, $price);
    $grid.append($card);
  });
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------------- REVIEWS (mock) ---------------- */
function renderReviews(product) {
  const productId = String(product.id);

  $.getJSON("./Data/reviews.json")
    .done(function (data) {
      // data = [ { product_id:"1", reviews:[...] }, ... ]
      const entry = data.find(x => String(x.product_id) === productId);
      const reviews = entry ? (entry.reviews || []) : [];

      paintReviews(reviews);
    })
    .fail(function () {
      // If file path is wrong, you’ll see this
      paintReviews([]);
      console.log("Could not load ./Data/reviews.json");
    });
}


function paintReviews(reviews) {
  const $wrap = $("#reviews-wrap");
  $wrap.empty();

  if (!reviews || reviews.length === 0) {
    $wrap.append($("<div/>").addClass("review-empty").text("No reviews yet."));
    return;
  }

  reviews.forEach(r => {
    const stars = clampStars(Number(r.rating));

    const $card = $("<div/>").addClass("review-card");

    const $top = $("<div/>").addClass("review-top");
    const $left = $("<div/>");
    const $user = $("<div/>").addClass("review-name").text(r.user || "Anonymous");
    const $title = $("<div/>").addClass("review-title").text(r.title || "");
    $left.append($user, $title);

    const $stars = $("<div/>")
      .addClass("review-stars")
      .text("★".repeat(stars) + "☆".repeat(5 - stars));

    $top.append($left, $stars);

    const $text = $("<div/>").addClass("review-text").text(r.comment || "");

    $card.append($top, $text);
    $wrap.append($card);
  });
}

function clampStars(n) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(5, Math.floor(n)));
}


