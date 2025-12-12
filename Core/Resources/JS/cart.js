function getCartKey() {
  // Later you can switch to cart_user_<id/email>
  return "cart_guest";
}

function getCart() {
  return JSON.parse(localStorage.getItem(getCartKey())) || [];
}

function saveCart(cart) {
  localStorage.setItem(getCartKey(), JSON.stringify(cart));
}

function addToCart(product, qty = 1) {
  const cart = getCart();
  const productId = Number(product.id);

  const existing = cart.find(i => Number(i.id) === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: productId,
      name: product.name,
      price: Number(product.price),
      image: product.image,
      qty: qty
    });
  }

  saveCart(cart);
  updateCartBadge();
}

function clearCart() {
  localStorage.removeItem(getCartKey());
  updateCartBadge();
}

function updateCartBadge() {
  const cart = getCart();
  let count = 0;

  for (let i = 0; i < cart.length; i++) {
    const qty = Number(cart[i].qty);
    if (!Number.isNaN(qty)) count += qty;
  }

  $(".item-count-badge").text(count);
}
