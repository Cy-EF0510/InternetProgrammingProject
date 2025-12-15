var totalSlides = 0;

$(document).ready(function () {

  // header + footer
  HeaderModel.createHeader();
  $("#footer-slot").append(FooterModel.createFooter());
  FooterModel.loadCategories();

  // category nav
  loadCategoryNav();

  // hero slides count
  totalSlides = $(".mySlides").length;

  // start hero carousel
  updateCarousel();
  startAutoSlide();

  // pause auto slide on hover
  $(".hero-carousel").hover(
    function () {
      stopAutoSlide();
    },
    function () {
      startAutoSlide();
    }
  );

  // cart badge
  CartManagement.updateCartBadge();

  // load products for homepage rows
  loadHomeRows();
});


/* =========================
   HOMEPAGE ROWS
========================= */

function loadHomeRows() {
  ProductModel.getAllProducts()
    .done(function (products) {

      // Home & Kitchen
      var homeKitchen = getCategoryProducts(products, "Home & Kitchen", 12);
      renderRow(homeKitchen, "homeRow");

      // Electronics
      var electronics = getCategoryProducts(products, "Electronics", 12);
      renderRow(electronics, "electronicsRow");

      // Toys & Games
      var toys = getCategoryProducts(products, "Toys & Games", 12);
      renderRow(toys, "toysRow");

      initRowArrows();
    })
    .fail(function (err) {
      console.error("Failed to load homepage products", err);
    });
}

function getCategoryProducts(products, categoryName, limit) {
  var result = [];
  var count = 0;

  for (var i = 0; i < products.length; i++) {
    if (products[i].category === categoryName) {
      result.push(products[i]);
      count++;

      if (count >= limit) {
        break;
      }
    }
  }

  return result;
}


/* =========================
   HERO CAROUSEL
========================= */

var slideIndex = 1;
var autoSlideInterval = null;

function plusSlides(n) {
  stopAutoSlide();

  slideIndex = slideIndex + n;
  wrapIndex();
  updateCarousel();

  startAutoSlide();
}

function currentSlide(n) {
  stopAutoSlide();

  slideIndex = n;
  wrapIndex();
  updateCarousel();

  startAutoSlide();
}

function startAutoSlide() {
  stopAutoSlide();

  autoSlideInterval = setInterval(function () {
    slideIndex = slideIndex + 1;
    wrapIndex();
    updateCarousel();
  }, 5000);
}

function stopAutoSlide() {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval);
    autoSlideInterval = null;
  }
}

function wrapIndex() {
  if (slideIndex > totalSlides) {
    slideIndex = 1;
  }

  if (slideIndex < 1) {
    slideIndex = totalSlides;
  }
}

function updateCarousel() {
  var offset = -(slideIndex - 1) * 100;

  $(".hero-track").css("transform", "translateX(" + offset + "%)");

  $(".dot").removeClass("active");
  $(".dot").eq(slideIndex - 1).addClass("active");
}


/* =========================
   PRODUCT ROWS
========================= */

function renderRow(products, containerId) {
  var track = $("#" + containerId);
  track.empty();

  for (var i = 0; i < products.length; i++) {
    track.append(ProductModel.createProductBox(products[i]));
  }
}

function initRowArrows() {
  $(".product-row").each(function () {

    var row = $(this);
    var track = row.find(".row-track");

    row.find(".row-btn.left").off("click").on("click", function () {
      var firstCard = track.find(".product-card").first();
      var cardWidth = firstCard.outerWidth(true);

      if (!cardWidth) {
        cardWidth = 240;
      }

      track[0].scrollBy({
        left: -(cardWidth * 3),
        behavior: "smooth"
      });
    });

    row.find(".row-btn.right").off("click").on("click", function () {
      var firstCard = track.find(".product-card").first();
      var cardWidth = firstCard.outerWidth(true);

      if (!cardWidth) {
        cardWidth = 240;
      }

      track[0].scrollBy({
        left: cardWidth * 3,
        behavior: "smooth"
      });
    });
  });
}


/* =========================
   CATEGORY NAV BAR
========================= */

function loadCategoryNav() {
  $.ajax({
    url: "Data/categories.xml",
    dataType: "xml"
  })
    .done(function (xml) {
      var nav = $("#categoryNav");
      nav.empty();

      // All link
      var all = $("<a/>");
      all.attr("href", "ProductListingPage.html");
      all.text("All");
      nav.append(all);

      // category links
      $(xml).find("category > name").each(function () {
        var name = $(this).text().trim();
        var encoded = encodeURIComponent(name);

        var link = $("<a/>");
        link.attr("href", "ProductListingPage.html?category=" + encoded);
        link.text(name);

        nav.append(link);
      });
    })
    .fail(function () {
      console.error("Failed to load categories");
    });
}
