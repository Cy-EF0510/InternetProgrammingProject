
var CartManagement = {

  
  /* =============================
     INTERNAL KEY
  ============================= */
  getCartKey: function () {
    return "rogueMarketCart";
  },

  /* =============================
     BASIC STORAGE
  ============================= */
  getCart: function () {
    return JSON.parse(localStorage.getItem(this.getCartKey())) || [];
  },

  saveCart: function (cart) {
    localStorage.setItem(this.getCartKey(), JSON.stringify(cart));
  },

  clearCart: function () {
    localStorage.removeItem(this.getCartKey());
    this.updateCartBadge();
  },

  /* =============================
     CART ACTIONS
  ============================= */
  addToCart: function (product, qty = 1) {
    const cart = this.getCart();
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

    this.saveCart(cart);
    this.updateCartBadge();
  },

  /* =============================
     UI HELPERS
  ============================= */
  getItemCount: function () {
    const cart = this.getCart();
    let count = 0;

    cart.forEach(item => {
      const qty = Number(item.qty);
      if (!Number.isNaN(qty)) {
        count += qty;
      }
    });

    return count;
  },

  updateCartBadge: function () {
    const count = this.getItemCount();
    $(".item-count-badge").text(count);
  },

  updateQty(id, qty) {
    const cart = this.getCart();

    const item = cart.find(i => Number(i.id) === Number(id));
    if (!item) return;

    if (qty <= 0) {
      this.removeItem(id);
      return;
    }

    item.qty = qty;
    this.saveCart(cart);
    this.updateCartBadge();
  },

  removeItem: function (id) {
    let cart = this.getCart();
    cart = cart.filter(i => Number(i.id) !== Number(id));
    this.saveCart(cart);
    this.updateCartBadge();
  }




}
