let allProducts = [];
let viewProducts = [];   // filtered + sorted + searched
let page = 1;
const pageSize = 8;
let isLoading = false;
let hasMore = true;

$(document).ready(function () {
  getProducts();
  updateCartBadge();

  // Infinite scroll (vertical)
  $(window).on("scroll", function () {
    if (
      !isLoading &&
      hasMore &&
      $(window).scrollTop() + $(window).height() >=
        $(document).height() - 300
    ) {
      appendNextPage();
    }
  });

});

/* =======================
   PRODUCTS
======================= */

function getProducts() {
  $.getJSON("Data/products.json")
    .done(function (products) {
      allProducts = products;
      page = 1;
      hasMore = true;

      $("#dealsRow").empty();
      appendNextPage();
    })
    .fail(function (xhr) {
      console.error("Failed to load products:", xhr.status);
    });
}

function appendNextPage() {
  if (isLoading || !hasMore) return;
  isLoading = true;

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const slice = allProducts.slice(start, end);

  if (slice.length === 0) {
    hasMore = false;
    isLoading = false;
    return;
  }

  for (let i = 0; i < slice.length; i++) {
    $("#dealsRow").append(createProductBox(slice[i]));
  }

  page++;
  if (slice.length < pageSize) hasMore = false;
  isLoading = false;
}

/* =======================
   PRODUCT CARD (jQuery)
======================= */
function createProductBox(product) {
  const price = Number(product.price);

  const card = $("<div/>")
    .addClass("product-card")
    .attr("data-id", product.id)
    .css("cursor", "pointer");

  card.on("click", function () {
    window.location.href = `ProductDetailsPage.html?id=${product.id}`;
  });

  const imgWrap = $("<div/>").addClass("product-img-wrap");

  const img = $("<img/>")
    .addClass("product-img")
    .attr("src", product.image + "?id=" + product.id)
    .attr("alt", product.name);

  imgWrap.append(img);

  const priceRow = $("<div/>").addClass("price-row");
  priceRow.append(
    $("<div/>").addClass("price").text(`$${price.toFixed(2)}`),
    $("<div/>").addClass("stock").text(`Stock: ${product.stock}`)
  );

  card.append(
    imgWrap,
    priceRow,
    $("<div/>").addClass("title").text(product.name),
    $("<div/>").addClass("cat").text(product.category)
  );

  return card;
}

/* =======================
CART (localStorage)
======================= */

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}


function updateCartBadge() {
  const cart = getCart();
  let count = 0;

  for (let i = 0; i < cart.length; i++) {
    const qty = Number(cart[i].qty);
    if (!Number.isNaN(qty)) {
      count += qty;
    }
  }

  $(".item-count-badge").text(count);
}
