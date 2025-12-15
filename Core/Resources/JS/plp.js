// ===== GLOBAL STATE (junior style) =====

var allProducts = [];
var filteredProducts = [];

var page = 1;
var pageSize = 15;

var isLoading = false;
var hasMore = true;

var activeCategory = "";
var activeSort = "";

var filtersActive = false;
var activeMinPrice = 0;
var activeMaxPrice = 0;


// ===== PAGE START =====

$(document).ready(function () {

  // header/footer
  HeaderModel.createHeader();
  FooterModel.buildFooter();

  CartManagement.updateCartBadge();

  // read category from url first
  activeCategory = getCategoryFromURL();
  if (!activeCategory) {
    activeCategory = "";
  }

  // categories dropdown first, then products
  loadCategoriesIntoSelect().then(function () {
    $("#categoryFilter").val(activeCategory);
    loadProducts();
  });

  bindEvents();
});


// ===== EVENTS =====

function bindEvents() {

  $("#categoryFilter").on("change", function () {

    var newCategory = $("#categoryFilter").val();
    activeCategory = newCategory;

    updateCategoryInURL(activeCategory);

    loadProducts();
  });

  $("#sortSelect").on("change", function () {

    var newSort = $("#sortSelect").val();
    activeSort = newSort;

    applyFiltersAndReset();
  });

  $(window).on("scroll", function () {

    var scrollTop = $(window).scrollTop();
    var windowHeight = $(window).height();
    var docHeight = $(document).height();

    var nearBottom = (scrollTop + windowHeight) >= (docHeight - 300);

    if (isLoading === false && hasMore === true && nearBottom === true) {
      appendNextPage();
    }
  });
}


// ===== LOAD PRODUCTS (BY CATEGORY) =====

function loadProducts() {

  ProductModel.getProducts(activeCategory)
    .done(function (products) {

      // save full list
      allProducts = products;

      // reset paging
      page = 1;
      hasMore = true;
      isLoading = false;

      // clear UI
      $("#dealsRow").empty();

      // reset slider + filters
      initPriceRangeSlider();
      applyFiltersAndReset();
    })
    .fail(function (xhr) {
      console.error("Failed to load products:", xhr.status);
    });
}


// ===== URL HELPERS =====

function getCategoryFromURL() {

  var params = new URLSearchParams(window.location.search);
  var value = params.get("category");

  return value;
}

function updateCategoryInURL(category) {

  var params = new URLSearchParams(window.location.search);

  if (!category) {
    params.delete("category");
  } else {
    params.set("category", category);
  }

  var qs = params.toString();
  var newUrl = window.location.pathname;

  if (qs) {
    newUrl = newUrl + "?" + qs;
  }

  history.pushState({}, "", newUrl);
}


// ===== CATEGORIES DROPDOWN =====

function loadCategoriesIntoSelect() {

  return $.ajax({
    url: "Data/categories.xml",
    dataType: "xml"
  })
  .then(function (xml) {

    var $select = $("#categoryFilter");
    $select.empty();

    // All option
    var allOption = $("<option>");
    allOption.val("");
    allOption.text("All");
    $select.append(allOption);

    // Category options
    $(xml).find("category > name").each(function () {

      var name = $(this).text().trim();

      var opt = $("<option>");
      opt.val(name);
      opt.text(name);

      $select.append(opt);
    });
  })
  .catch(function (xhr) {
    console.error("Failed to load categories:", xhr.status);
  });
}


// ===== RENDER + INFINITE SCROLL =====

function appendNextPage() {

  if (isLoading === true) {
    return;
  }

  if (hasMore === false) {
    return;
  }

  isLoading = true;

  // choose list
  var list = allProducts;
  if (filtersActive === true) {
    list = filteredProducts;
  }

  // compute page slice
  var start = (page - 1) * pageSize;
  var end = start + pageSize;

  var batch = list.slice(start, end);

  // nothing left
  if (batch.length === 0) {
    hasMore = false;
    isLoading = false;
    return;
  }

  // add cards
  for (var i = 0; i < batch.length; i++) {
    var p = batch[i];
    $("#dealsRow").append(ProductModel.createProductBox(p));
  }

  page = page + 1;

  if (batch.length < pageSize) {
    hasMore = false;
  }

  isLoading = false;
}


// ===== FILTERS + SLIDER =====

function recomputeFilteredProducts() {

  // figure out slider max (fallback to activeMaxPrice)
  var sliderMax = activeMaxPrice;

  if ($("#priceRangeSlider").length) {
    sliderMax = $("#priceRangeSlider").slider("option", "max");
  }

  // decide if filters are active
  filtersActive = false;

  if (activeSort !== "") {
    filtersActive = true;
  }

  if (activeMinPrice > 0) {
    filtersActive = true;
  }

  if (activeMaxPrice < sliderMax) {
    filtersActive = true;
  }

  // filter by price
  var results = [];

  for (var i = 0; i < allProducts.length; i++) {

    var p = allProducts[i];
    var price = Number(p.price);

    if (Number.isNaN(price)) {
      continue;
    }

    if (price < activeMinPrice) {
      continue;
    }

    if (price > activeMaxPrice) {
      continue;
    }

    results.push(p);
  }

  filteredProducts = results;

  // sorting
  if (activeSort === "price-asc") {
    filteredProducts.sort(function (a, b) {
      return Number(a.price) - Number(b.price);
    });
  } else if (activeSort === "price-desc") {
    filteredProducts.sort(function (a, b) {
      return Number(b.price) - Number(a.price);
    });
  }
}

function applyFiltersAndReset() {

  recomputeFilteredProducts();

  // reset paging
  page = 1;
  hasMore = true;
  isLoading = false;

  // reset UI
  $("#dealsRow").empty();

  // render first page
  appendNextPage();
}

function initPriceRangeSlider() {

  // find max price
  var maxPrice = 0;

  for (var i = 0; i < allProducts.length; i++) {
    var price = Number(allProducts[i].price);
    if (!Number.isNaN(price) && price > maxPrice) {
      maxPrice = price;
    }
  }

  maxPrice = Math.ceil(maxPrice);

  activeMinPrice = 0;
  activeMaxPrice = maxPrice;

  // destroy old slider if needed
  if ($("#priceRangeSlider").hasClass("ui-slider")) {
    $("#priceRangeSlider").slider("destroy");
  }

  // build slider
  $("#priceRangeSlider").slider({
    range: true,
    min: 0,
    max: maxPrice,
    values: [activeMinPrice, activeMaxPrice],

    slide: function (event, ui) {
      activeMinPrice = ui.values[0];
      activeMaxPrice = ui.values[1];

      $("#priceRangeLabel").text("$" + activeMinPrice + " – $" + activeMaxPrice);
    },

    change: function () {
      applyFiltersAndReset();
    }
  });

  $("#priceRangeLabel").text("$" + activeMinPrice + " – $" + activeMaxPrice);
}


// ===== BACK / FORWARD BUTTONS =====

window.addEventListener("popstate", function () {

  var cat = getCategoryFromURL();
  if (!cat) {
    cat = "";
  }

  activeCategory = cat;

  $("#categoryFilter").val(activeCategory);

  loadProducts();
});
