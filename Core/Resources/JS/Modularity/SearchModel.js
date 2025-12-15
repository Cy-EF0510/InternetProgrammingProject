var SearchModel = {

//settings
  PRODUCTS_URL: "./Data/products.json",

  //cached products
  products: null,

  //helpers
  normalize: function (text) {
    return String(text || "").toLowerCase().trim();
  },

  //load all products from json
  loadAllProducts: function () {

    var self = this;

    // already loaded
    if (self.products !== null) {
      return $.Deferred().resolve(self.products).promise();
    }

    // load from json
    return $.getJSON(self.PRODUCTS_URL)
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

   //match single product
  productMatches: function (product, query) {

    var q = this.normalize(query);
    if (q === "") return false;

    // safe strings (no crashes if missing)
    var name = this.normalize(product && product.name);
    var desc = this.normalize(product && product.description);
    var cat  = this.normalize(product && product.category);

    if (name.indexOf(q) !== -1) return true;
    if (desc.indexOf(q) !== -1) return true;
    if (cat.indexOf(q) !== -1) return true;

    return false;
  },

   //find all matching products
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

  //get limited number of suggestions
  getSuggestions: function (query, limit) {

    limit = Number(limit);
    if (!Number.isFinite(limit) || limit <= 0) {
      limit = 6;
    }

    return this.findMatches(query).then(function (matches) {
      return matches.slice(0, limit);
    });
  },

   //clear cached products
  clearCache: function () {
    this.products = null;
  }
};
