var ProductFilterModule = {

  // defaults (can be overwritten in init)
  settings: {
    allUrl: "./Data/products.json",
    categoryUrl: null,
    getPrice: null,
    getName: null,
    render: null,
    onError: null
  },

  // data + current filter values
  state: {
    baseList: [],
    filtered: [],
    filters: {
      category: "",
      minPrice: 0,
      maxPrice: Infinity,
      sort: ""
    }
  },

  init: function (userSettings) {

    // safe default
    if (!userSettings) {
      userSettings = {};
    }

    // copy user settings onto settings (simple and obvious)
    for (var key in userSettings) {
      this.settings[key] = userSettings[key];
    }

    // ===== set defaults if missing =====
    if (typeof this.settings.categoryUrl !== "function") {
      this.settings.categoryUrl = function (cat) {
        return "./Data/" + encodeURIComponent(cat) + ".json";
      };
    }

    if (typeof this.settings.getPrice !== "function") {
      this.settings.getPrice = function (p) {
        return Number(p.price);
      };
    }

    if (typeof this.settings.getName !== "function") {
      this.settings.getName = function (p) {
        return String(p.name || "");
      };
    }

    if (typeof this.settings.render !== "function") {
      this.settings.render = function () {};
    }

    if (typeof this.settings.onError !== "function") {
      this.settings.onError = function (e) {
        console.error(e);
      };
    }
  },

  loadForCategory: function (category) {

    var url = "";

    if (category) {
      url = this.settings.categoryUrl(category);
    } else {
      url = this.settings.allUrl;
    }

    return $.getJSON(url);
  },

  refresh: function () {

    var self = this;
    var category = this.state.filters.category;

    return this.loadForCategory(category)
      .done(function (list) {

        if (Array.isArray(list)) {
          self.state.baseList = list;
        } else {
          self.state.baseList = [];
        }

        self.applyFiltersOnly();
      })
      .fail(function (xhr) {
        self.settings.onError(xhr);
      });
  },

  applyFiltersOnly: function () {

    var min = this.state.filters.minPrice;
    var max = this.state.filters.maxPrice;

    var getPrice = this.settings.getPrice;
    var base = this.state.baseList;

    var results = [];

    for (var i = 0; i < base.length; i++) {

      var p = base[i];
      var price = getPrice(p);

      if (Number.isNaN(price)) {
        continue;
      }

      if (price < min) {
        continue;
      }

      if (price > max) {
        continue;
      }

      results.push(p);
    }

    this.state.filtered = results;

    this.applySort();
    this.settings.render(this.state.filtered);
  },

  applySort: function () {

    var sort = this.state.filters.sort;

    var getPrice = this.settings.getPrice;
    var getName = this.settings.getName;

    if (sort === "price-asc") {

      this.state.filtered.sort(function (a, b) {
        return getPrice(a) - getPrice(b);
      });

    } else if (sort === "price-desc") {

      this.state.filtered.sort(function (a, b) {
        return getPrice(b) - getPrice(a);
      });

    } else if (sort === "name") {

      this.state.filtered.sort(function (a, b) {
        return getName(a).localeCompare(getName(b));
      });

    } else {
      // no sort
    }
  },

  setCategory: function (cat) {

    if (!cat) {
      cat = "";
    }

    this.state.filters.category = cat;
    return this.refresh();
  },

  setPriceRange: function (min, max) {

    var minNum = Number(min);
    if (!Number.isFinite(minNum)) {
      minNum = 0;
    }

    var maxNum;

    if (max === Infinity) {
      maxNum = Infinity;
    } else {
      maxNum = Number(max);
      if (!Number.isFinite(maxNum)) {
        maxNum = Infinity;
      }
    }

    this.state.filters.minPrice = minNum;
    this.state.filters.maxPrice = maxNum;

    this.applyFiltersOnly();
  },

  setSort: function (sort) {

    if (!sort) {
      sort = "";
    }

    this.state.filters.sort = sort;
    this.applyFiltersOnly();
  },

  getFilters: function () {
    var copy = {};
    copy.category = this.state.filters.category;
    copy.minPrice = this.state.filters.minPrice;
    copy.maxPrice = this.state.filters.maxPrice;
    copy.sort = this.state.filters.sort;
    return copy;
  },

  getFiltered: function () {
    return this.state.filtered.slice();
  }
};
