let allProducts = [];
let filteredProducts = [];

let page = 1;
const pageSize = 15;

let isLoading = false;
let hasMore = true;

let activeCategory = "";
let activeSort = "";

let filtersActive = false;
let activeMinPrice = 0;
let activeMaxPrice = 0;

$(document).ready(function () {
  // header/footer
  $("#footer-slot").html(FooterModel.createFooter());
  FooterModel.loadCategories();
  HeaderModel.createHeader();
  CartManagement.updateCartBadge();

  // read category from url first
  activeCategory = getCategoryFromURL() || "";

  // load categories dropdown then load products
  loadCategoriesIntoSelect().then(function () {
    $("#categoryFilter").val(activeCategory);
    loadProducts();
  });

  bindEvents();
});

function bindEvents() {
  $("#categoryFilter").on("change", function () {
    activeCategory = $(this).val();
    updateCategoryInURL(activeCategory);
    loadProducts();
  });

  $("#sortSelect").on("change", function () {
    activeSort = $(this).val();
    applyFiltersAndReset();
  });

  $(window).on("scroll", function () {
    const nearBottom = $(window).scrollTop() + $(window).height() >= $(document).height() - 300;

    if (!isLoading && hasMore && nearBottom) {
      appendNextPage();
    }
  });
}

// load products (by category)
function loadProducts() {
  ProductModel.getProducts(activeCategory)
    .done(function (products) {
      allProducts = products;

      page = 1;
      hasMore = true;
      isLoading = false;

      $("#dealsRow").empty();

      initPriceRangeSlider();
      applyFiltersAndReset();
    })
    .fail(function (xhr) {
      console.error("Failed to load products:", xhr.status);
    });
}

// url helpers
function getCategoryFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("category");
}

function updateCategoryInURL(category) {
  const params = new URLSearchParams(window.location.search);

  if (!category) params.delete("category");
  else params.set("category", category);

  const newUrl =
    window.location.pathname + (params.toString() ? "?" + params.toString() : "");

  history.pushState({}, "", newUrl);
}

// categories dropdown
function loadCategoriesIntoSelect() {
  return $.ajax({
    url: "Data/categories.xml",
    dataType: "xml"
  })
  .then(function (xml) {
    const $select = $("#categoryFilter");

    $select.empty();

    // All
    $select.append(
      $("<option/>").val("").text("All")
    );

    // Categories
    $(xml).find("category > name").each(function () {
      const name = $(this).text().trim();

      $select.append(
        $("<option/>").val(name).text(name)
      );
    });
  })
  .catch(function (xhr) {
    console.error("Failed to load categories:", xhr.status);
  });
}


/* ========================== RENDER + INFINITE SCROLL ========================== */

function appendNextPage() {
  if (isLoading || !hasMore) return;
  isLoading = true;

  const list = filtersActive ? filteredProducts : allProducts;

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const batch = list.slice(start, end);

  if (batch.length === 0) {
    hasMore = false;
    isLoading = false;
    return;
  }

  batch.forEach(function (p) {
    $("#dealsRow").append(ProductModel.createProductBox(p));
  });

  page++;
  if (batch.length < pageSize) hasMore = false;

  isLoading = false;
}

/* ========================== FILTERS + SLIDER ========================== */

function recomputeFilteredProducts() {
  const sliderMax = $("#priceRangeSlider").length
    ? $("#priceRangeSlider").slider("option", "max")
    : activeMaxPrice;

  filtersActive =
    activeSort !== "" ||
    activeMinPrice > 0 ||
    activeMaxPrice < sliderMax;

  filteredProducts = allProducts.filter(function (p) {
    const price = Number(p.price);
    if (Number.isNaN(price)) return false;
    return price >= activeMinPrice && price <= activeMaxPrice;
  });

  if (activeSort === "price-asc") {
    filteredProducts.sort(function (a, b) {
      return Number(a.price) - Number(b.price);
    });
  }

  if (activeSort === "price-desc") {
    filteredProducts.sort(function (a, b) {
      return Number(b.price) - Number(a.price);
    });
  }
}

function applyFiltersAndReset() {
  recomputeFilteredProducts();

  page = 1;
  hasMore = true;
  isLoading = false;

  $("#dealsRow").empty();
  appendNextPage();
}

function initPriceRangeSlider() {
  const maxPrice = Math.ceil(
    Math.max.apply(
      null,
      allProducts.map(function (p) {
        return Number(p.price) || 0;
      })
    )
  );

  activeMinPrice = 0;
  activeMaxPrice = maxPrice;

  if ($("#priceRangeSlider").hasClass("ui-slider")) {
    $("#priceRangeSlider").slider("destroy");
  }

  $("#priceRangeSlider").slider({
    range: true,
    min: 0,
    max: maxPrice,
    values: [activeMinPrice, activeMaxPrice],
    slide: function (event, ui) {
      activeMinPrice = ui.values[0];
      activeMaxPrice = ui.values[1];
      $("#priceRangeLabel").text(`$${activeMinPrice} – $${activeMaxPrice}`);
    },
    change: function () {
      applyFiltersAndReset();
    }
  });

  $("#priceRangeLabel").text(`$${activeMinPrice} – $${activeMaxPrice}`);
}

// back/forward buttons
window.addEventListener("popstate", function () {
  activeCategory = getCategoryFromURL() || "";
  $("#categoryFilter").val(activeCategory);
  loadProducts();
});
