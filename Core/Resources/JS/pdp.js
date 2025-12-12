$(document).ready(function () {
    $("#footer-slot").append(FooterModel.createFooter());
});

function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get("id"));
}

let currentProduct = null;

$(document).ready(function () {
  const productId = getProductIdFromUrl();
  if (!productId) return;

  $.getJSON("Data/products.json", function (products) {
    currentProduct = products.find(p => p.id === productId);
    if (!currentProduct) return;

    renderProduct(currentProduct);
    renderRelated(products, currentProduct);
    renderReviews();
  });
});

function renderProduct(p) {
  $("#pdpImage").attr("src", p.image + "?id=" + p.id);
  $("#pdpTitle").text(p.name);
  $("#pdpDesc").text(p.description);
  $("#pdpPrice").text(p.price.toFixed(2));
  $("#pdpSku").text(p.sku);
  $("#pdpStock").text(p.stock > 0 ? "In stock" : "Out of stock");
}


$("#addToCartBtn").on("click", function () {
  const qty = Number($("#qtyInput").val());
  if (qty < 1) return;

  addToCart(currentProduct.id, qty);
});


function addToCart(productId, qty = 1) {
  const cart = getCart();
  const product = currentProduct || allProducts.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: qty
    });
  }

  saveCart(cart);
  updateCartBadge();
}

function renderRelated(products, current) {
  const related = products
    .filter(p => p.category === current.category && p.id !== current.id)
    .slice(0, 4);

  for (let i = 0; i < related.length; i++) {
    $("#relatedProducts").append(createProductBox(related[i]));
  }
}


function renderReviews() {
  const reviews = [
    { user: "Alex", rating: 5, text: "Great product!" },
    { user: "Jamie", rating: 4, text: "Good value for money." }
  ];

  for (let i = 0; i < reviews.length; i++) {
    $("#reviews").append(`
      <div class="review">
        <strong>${reviews[i].user}</strong>
        ⭐ ${reviews[i].rating}/5
        <p>${reviews[i].text}</p>
      </div>
    `);
  }
}
