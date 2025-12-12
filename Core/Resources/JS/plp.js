let allProducts = [];
let filteredProducts = [];

let page = 1;
const pageSize = 8;

let isLoading = false;
let hasMore = true;

let activeCategory = "";
let activeSort = "";

let filtersActive = false;
let activeMinPrice = 0;
let activeMaxPrice = 0;


$(document).ready(function () {
  // FOOTER
  $("#footer-slot").append(FooterModel.createFooter());
  HeaderModel.createHeader();
  updateCartBadge();

  // 1) Read category from URL first
  activeCategory = getCategoryFromURL() || "";

  // 2) Load XML categories, THEN set dropdown value, THEN load products
  loadCategoriesIntoSelect().then(function () {
    $("#categoryFilter").val(activeCategory);
    getProducts(); // will load products for activeCategory
  });

  bindEvents();
});


function bindEvents() {
  $("#categoryFilter").on("change", function () {
  activeCategory = $(this).val();
  updateCategoryInURL(activeCategory);
  getProducts(); // reload correct category JSON
});


  $("#sortSelect").on("change", function () {
    activeSort = $(this).val();
    applyFiltersAndReset();
  });

  $(window).on("scroll", function () {
    if (
      !isLoading &&
      hasMore &&
      $(window).scrollTop() + $(window).height() >= $(document).height() - 300
    ) {
      appendNextPage();
    }
  });
}

// getting products using the model
function getProducts() {
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



//reads the category form url, for when we go form home page to plp page we need to know which category they selectedand to load the plp page with only that catergoy
function getCategoryFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("category"); // returns null if not present
}

function updateCategoryInURL(category) {
  const params = new URLSearchParams(window.location.search);

  if (!category) {
    params.delete("category"); // All categories
  } else {
    params.set("category",category);
  }

  const newUrl =
    window.location.pathname +
    (params.toString() ? "?" + params.toString() : "");

  history.pushState({}, "", newUrl);
}




function loadCategoriesIntoSelect() {
  return $.ajax({
    url: "Data/categories.xml",   // <-- change if needed
    dataType: "xml"
  })
  .then(function (xml) {
    const $select = $("#categoryFilter");

    // keep the "All" option
    $select.empty().append(`<option value="">All</option>`);

    $(xml).find("category > name").each(function () {
      const name = $(this).text().trim();
      $select.append(`<option value="${name}">${name}</option>`);
    });
  })
  .catch(function (xhr) {
    console.error("Failed to load categories:", xhr.status);
  });
}


//RENDERING + INFINITE SCROLL

function appendNextPage() {
  if (isLoading || !hasMore) return;
  isLoading = true;

  const source = filtersActive ? filteredProducts : allProducts;


  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const slice = source.slice(start, end);

  if (slice.length === 0) {
    hasMore = false;
    isLoading = false;
    return;
  }

  for (let i = 0; i < slice.length; i++) {
    $("#dealsRow").append(ProductModel.createProductBox(slice[i]));
  }

  page++;
  if (slice.length < pageSize) hasMore = false;
  isLoading = false;
}

/* =======================
CART (localStorage)
======================= */

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartBadge() {
  const cart = getCart();
  let count = 0;

  for (let i = 0; i < cart.length; i++) {
    const qty = Number(cart[i].qty);
    if (!Number.isNaN(qty)) {
      count += qty;
    }
  }

  $(".item-count-badge").text(count);
}



/*
  slider 
*/
function recomputeFilteredProducts() {
  const sliderMax = $("#priceRangeSlider").length
    ? $("#priceRangeSlider").slider("option", "max")
    : activeMaxPrice;

  filtersActive =
    !!activeSort ||
    activeMinPrice > 0 ||
    activeMaxPrice < sliderMax;

  filteredProducts = allProducts.filter(p => {
    const price = Number(p.price);
    if (Number.isNaN(price)) return false;
    return price >= activeMinPrice && price <= activeMaxPrice;
  });

  if (activeSort === "price-asc") {
    filteredProducts.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (activeSort === "price-desc") {
    filteredProducts.sort((a, b) => Number(b.price) - Number(a.price));
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
  // set slider max to your real max product price
  const maxProductPrice = Math.ceil(Math.max(...allProducts.map(p => Number(p.price) || 0)));
  const minProductPrice = 0;

  activeMinPrice = minProductPrice;
  activeMaxPrice = maxProductPrice;

  if ($("#priceRangeSlider").hasClass("ui-slider")) {
  $("#priceRangeSlider").slider("destroy");
}

  $("#priceRangeSlider").slider({
    range: true,
    min: minProductPrice,
    max: maxProductPrice,
    values: [activeMinPrice, activeMaxPrice],
    slide: function (event, ui) {
      activeMinPrice = ui.values[0];
      activeMaxPrice = ui.values[1];
      $("#priceRangeLabel").text(`$${activeMinPrice} – $${activeMaxPrice}`);
    },
    change: function (event, ui) {
      // when user releases handle, apply filter
      applyFiltersAndReset();
    }
  });

  $("#priceRangeLabel").text(`$${activeMinPrice} – $${activeMaxPrice}`);
}



//adding a listener for when the user navigates back and forth using the browser buttons
window.addEventListener("popstate", function () {
  const categoryFromURL = getCategoryFromURL(); // reads from URL

  activeCategory = categoryFromURL || "";       // "" means All
  $("#categoryFilter").val(activeCategory);     // update dropdown UI

  getProducts();                    // re-filter + re-render
});
