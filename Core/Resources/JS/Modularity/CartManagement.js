var CartManagement = {

  //cookie management
  //saves cookie, and is used to store the cart data
  setCookie: function (name, value, days) {
    if (days === undefined || days === null) {
      days = 7;
    }

    //days to milliseconds
    var ms = days * 24 * 60 * 60 * 1000;
    var expiresDate = new Date(Date.now() + ms);
    var expires = expiresDate.toUTCString();

    //saves cookie
    document.cookie =
      name + "=" + encodeURIComponent(value) +
      "; expires=" + expires +
      "; path=/";
  },

  //reads cookie and returns value

  getCookie: function (name) {
    var parts = document.cookie.split("; ");

    for (var i = 0; i < parts.length; i++) {
      var pair = parts[i].split("=");
      var key = pair[0];
      var val = pair.slice(1).join("=");

      if (key === name) {
        return decodeURIComponent(val || "");
      }
    }

    return null;
  },

  //deletes cookie

  deleteCookie: function (name) {
    document.cookie =
      name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
  },

  //cart management
  //gets the cookie key used to store the cart
  getCartKey: function () {
    return "rogueMarketCart";
  },

  //gets the cart from the cookie and converts from json to array

  getCart: function () {
    var raw = this.getCookie(this.getCartKey());

    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  },

  //saves cart array to cookie as json

  saveCart: function (cart) {
    this.setCookie(this.getCartKey(), JSON.stringify(cart), 7);
  },


  //clears the cart and updated the amount 
  clearCart: function () {
    this.deleteCookie(this.getCartKey());
    this.updateCartBadge();
  },


  //cart item management
  //adds product to cart, or updates quantity if already exists

  addToCart: function (product, qty) {
    if (qty === undefined || qty === null) {
      qty = 1;
    }

    var cart = this.getCart();
    var productId = Number(product.id);

    //checks if product already exists in cart
    var existing = null;
    for (var i = 0; i < cart.length; i++) {
      if (Number(cart[i].id) === productId) {
        existing = cart[i];
        break;
      }
    }

    if (existing) {
      //incraese quantity
      existing.qty = Number(existing.qty) + Number(qty);
    } else {
      //add new product
      cart.push({
        id: productId,
        name: product.name,
        price: Number(product.price),
        image: product.image,
        qty: Number(qty)
      });
    }

    this.saveCart(cart);
    this.updateCartBadge();
  },


  //updates quantity of item in cart
  updateQty: function (id, qty) {
    var cart = this.getCart();

    var item = null;
    for (var i = 0; i < cart.length; i++) {
      if (Number(cart[i].id) === Number(id)) {
        item = cart[i];
        break;
      }
    }

    if (!item) {
      return;
    }

    qty = Number(qty);

    if (qty <= 0) {
      this.removeItem(id);
      return;
    }

    item.qty = qty;
    this.saveCart(cart);
    this.updateCartBadge();
  },

  //removes item from cart

  removeItem: function (id) {
    var cart = this.getCart();
    var newCart = [];

    for (var i = 0; i < cart.length; i++) {
      if (Number(cart[i].id) !== Number(id)) {
        newCart.push(cart[i]);
      }
    }

    this.saveCart(newCart);
    this.updateCartBadge();
  },

  //gets total item count in cart

  getItemCount: function () {
    var cart = this.getCart();
    var count = 0;

    for (var i = 0; i < cart.length; i++) {
      var qty = Number(cart[i].qty);

      if (!isNaN(qty)) {
        count = count + qty;
      }
    }

    return count;
  },

  //updates cart badge display with current item count

  updateCartBadge: function () {
    var count = this.getItemCount();
    $(".item-count-badge").text(count);
  }

};
