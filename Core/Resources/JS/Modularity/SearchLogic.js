var SearchModel = {

  // cached products (so we don't fetch every keypress)
  products: null,

  /* ===================== HELPERS ===================== */

  normalize: function (text) {
    return String(text || "").toLowerCase().trim();
  },

  /* ===================== LOAD PRODUCTS ===================== */

  loadAllProducts: function () {

    var self = this;

    // already loaded
    if (self.products !== null) {
      return $.Deferred().resolve(self.products).promise();
    }

    // load once
    return $.getJSON("./Data/products.json")
      .done(function (data) {

        var list = [];

        // supports: [] OR { products: [] }
        if (Array.isArray(data)) {
          list = data;
        } else if (data && Array.isArray(data.products)) {
          list = data.products;
        }

        self.products = list;
      })
      .fail(function () {
        self.products = [];
      })
      .then(function () {
        return self.products;
      });
  },

  /* ===================== SEARCH ===================== */

  productMatches: function (product, query) {

    var q = this.normalize(query);
    if (q === "") {
      return false;
    }

    var name = this.normalize(product.name);
    var desc = this.normalize(product.description);
    var cat  = this.normalize(product.category);

    // match if query appears anywhere
    if (name.indexOf(q) !== -1) return true;
    if (desc.indexOf(q) !== -1) return true;
    if (cat.indexOf(q) !== -1) return true;

    return false;
  },

  findMatches: function (query) {

    var self = this;

    return self.loadAllProducts().then(function (list) {

      var matches = [];

      for (var i = 0; i < list.length; i++) {
        var p = list[i];

        if (self.productMatches(p, query)) {
          matches.push(p);
        }
      }

      return matches;
    });
  },

  getSuggestions: function (query, limit) {

    var self = this;

    limit = Number(limit);
    if (!Number.isFinite(limit) || limit <= 0) {
      limit = 6;
    }

    return self.findMatches(query).then(function (matches) {
      return matches.slice(0, limit);
    });
  },

  /* ===================== OPTIONAL ===================== */

  clearCache: function () {
    this.products = null;
  }
};
