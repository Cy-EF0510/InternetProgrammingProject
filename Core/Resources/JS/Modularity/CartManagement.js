
var CartManagement = {

  /* =============================
    COOKIE HELPERS
  ============================= */
  setCookie: function (name, value, days = 7) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  },

  getCookie: function (name) {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? decodeURIComponent(match[2]) : null;
  },

  deleteCookie: function (name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  },

  
  /* =============================
     INTERNAL KEY
  ============================= */
  getCartKey: function () {
    return "rogueMarketCart";
  },

  /* =============================
     BASIC STORAGE (COOKIE)
  ============================= */
  getCart: function () {
    const raw = this.getCookie(this.getCartKey());
    if (!raw) return [];

    try {
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  },

  saveCart: function (cart) {
    this.setCookie(this.getCartKey(), JSON.stringify(cart), 7);
  },

  clearCart: function () {
    this.deleteCookie(this.getCartKey());
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

  updateQty: function (id, qty) {
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
  },


  /* =============================
     UI HELPERS
  ============================= */
  getItemCount: function () {
    const cart = this.getCart();
    let count = 0;

    cart.forEach(item => {
      const qty = Number(item.qty);
      if (!Number.isNaN(qty)) count += qty;
    });

    return count;
  },

  updateCartBadge: function () {
    const count = this.getItemCount();
    $(".item-count-badge").text(count);
  }

};

