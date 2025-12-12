// filters.js
// Requires jQuery loaded first

window.ProductFilterModule = (function () {

  let settings = {};
  let state = {
    baseList: [],
    filtered: [],
    filters: {
      category: "",
      minPrice: 0,
      maxPrice: Infinity,
      sort: ""
    }
  };

  function init(userSettings) {
    settings = {
      allUrl: userSettings.allUrl || "Data/products.json",
      categoryUrl: userSettings.categoryUrl || function (cat) {
        return "Data/" + encodeURIComponent(cat) + ".json";
      },
      getPrice: userSettings.getPrice || function (p) {
        return Number(p.price);
      },
      getName: userSettings.getName || function (p) {
        return String(p.name || "");
      },
      render: userSettings.render || function () {},
      onError: userSettings.onError || function (e) {
        console.error(e);
      }
    };
  }

  function loadForCategory(category) {
    const url = category ? settings.categoryUrl(category) : settings.allUrl;
    return $.getJSON(url);
  }

  function applySort() {
    switch (state.filters.sort) {
      case "price-asc":
        state.filtered.sort((a, b) => settings.getPrice(a) - settings.getPrice(b));
        break;
      case "price-desc":
        state.filtered.sort((a, b) => settings.getPrice(b) - settings.getPrice(a));
        break;
      case "name":
        state.filtered.sort((a, b) =>
          settings.getName(a).localeCompare(settings.getName(b))
        );
        break;
    }
  }

  function applyFiltersOnly() {
    const min = state.filters.minPrice;
    const max = state.filters.maxPrice;

    state.filtered = state.baseList.filter(p => {
      const price = settings.getPrice(p);
      if (isNaN(price)) return false;
      if (price < min) return false;
      if (price > max) return false;
      return true;
    });

    applySort();
    settings.render(state.filtered);
  }

  function refresh() {
    return loadForCategory(state.filters.category)
      .then(list => {
        state.baseList = Array.isArray(list) ? list : [];
        applyFiltersOnly();
      })
      .catch(settings.onError);
  }

  /* ========= PUBLIC API ========= */

  return {
    init,

    refresh,

    setCategory: function (cat) {
      state.filters.category = cat || "";
      return refresh();
    },

    setPriceRange: function (min, max) {
      state.filters.minPrice = Number(min) || 0;
      state.filters.maxPrice = (max === Infinity)
        ? Infinity
        : (Number(max) || Infinity);
      applyFiltersOnly();
    },

    setSort: function (sort) {
      state.filters.sort = sort || "";
      applyFiltersOnly();
    },

    getFilters: function () {
      return $.extend({}, state.filters);
    },

    getFiltered: function () {
      return state.filtered.slice();
    }
  };

})();
