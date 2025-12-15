var ProductFilterModule = {

  settings: {
    allUrl: "./Data/products.json",
    categoryUrl: function (cat) {
      return "./Data/" + encodeURIComponent(cat) + ".json";
    },
    getPrice: function (p) { return Number(p.price); },
    getName: function (p) { return String(p.name || ""); },
    render: function () {},
    onError: function (e) { console.error(e); }
  },

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
    userSettings = userSettings || {};

    this.settings = $.extend({}, this.settings, userSettings);

    // normalize optional settings
    if (typeof this.settings.categoryUrl !== "function") {
      this.settings.categoryUrl = function (cat) {
        return "./Data/" + encodeURIComponent(cat) + ".json";
      };
    }
    if (typeof this.settings.getPrice !== "function") {
      this.settings.getPrice = function (p) { return Number(p.price); };
    }
    if (typeof this.settings.getName !== "function") {
      this.settings.getName = function (p) { return String(p.name || ""); };
    }
    if (typeof this.settings.render !== "function") {
      this.settings.render = function () {};
    }
    if (typeof this.settings.onError !== "function") {
      this.settings.onError = function (e) { console.error(e); };
    }
  },

  loadForCategory: function (category) {
    var url = category ? this.settings.categoryUrl(category) : this.settings.allUrl;
    return $.getJSON(url);
  },

  applySort: function () {
    var sort = this.state.filters.sort;
    var getPrice = this.settings.getPrice;
    var getName = this.settings.getName;

    if (sort === "price-asc") {
      this.state.filtered.sort(function (a, b) { return getPrice(a) - getPrice(b); });
    } else if (sort === "price-desc") {
      this.state.filtered.sort(function (a, b) { return getPrice(b) - getPrice(a); });
    } else if (sort === "name") {
      this.state.filtered.sort(function (a, b) {
        return getName(a).localeCompare(getName(b));
      });
    }
  },

  applyFiltersOnly: function () {
    var min = this.state.filters.minPrice;
    var max = this.state.filters.maxPrice;
    var getPrice = this.settings.getPrice;

    this.state.filtered = this.state.baseList.filter(function (p) {
      var price = getPrice(p);
      if (Number.isNaN(price)) return false;
      if (price < min) return false;
      if (price > max) return false;
      return true;
    });

    this.applySort();
    this.settings.render(this.state.filtered);
  },

  refresh: function () {
    var self = this;

    return this.loadForCategory(this.state.filters.category)
      .then(function (list) {
        self.state.baseList = Array.isArray(list) ? list : [];
        self.applyFiltersOnly();
      })
      .catch(function (e) {
        self.settings.onError(e);
      });
  },

  setCategory: function (cat) {
    this.state.filters.category = cat || "";
    return this.refresh();
  },

  setPriceRange: function (min, max) {
    this.state.filters.minPrice = Number(min) || 0;

    if (max === Infinity) this.state.filters.maxPrice = Infinity;
    else this.state.filters.maxPrice = Number(max) || Infinity;

    this.applyFiltersOnly();
  },

  setSort: function (sort) {
    this.state.filters.sort = sort || "";
    this.applyFiltersOnly();
  },

  getFilters: function () {
    return $.extend({}, this.state.filters);
  },

  getFiltered: function () {
    return this.state.filtered.slice();
  }
};
