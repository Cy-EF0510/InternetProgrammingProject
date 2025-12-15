var totalSlides = 0;

$(document).ready(function () {

  //header + footer
  HeaderModel.createHeader();
  FooterModel.buildFooter();

  //category nav
  loadCategoryNav();

  //hero slides count
  totalSlides = $(".mySlides").length;

  //start hero carousel
  updateCarousel();
  startAutoSlide();

  //pause auto slide on hover
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


//hero carousel functions

var slideIndex = 1;
var autoSlideInterval = null;

//next/previous controls
function plusSlides(n) {
  stopAutoSlide();

  slideIndex = slideIndex + n;
  wrapIndex();
  updateCarousel();

  startAutoSlide();
}

//current slide control
function currentSlide(n) {
  stopAutoSlide();

  slideIndex = n;
  wrapIndex();
  updateCarousel();

  startAutoSlide();
}

//auto slide
function startAutoSlide() {
  stopAutoSlide();

  autoSlideInterval = setInterval(function () {
    slideIndex = slideIndex + 1;
    wrapIndex();
    updateCarousel();
  }, 5000);
}


//stop auto slide
function stopAutoSlide() {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval);
    autoSlideInterval = null;
  }
}

//wrap slide index
function wrapIndex() {
  if (slideIndex > totalSlides) {
    slideIndex = 1;
  }

  if (slideIndex < 1) {
    slideIndex = totalSlides;
  }
}

//update carousel display
function updateCarousel() {
  var offset = -(slideIndex - 1) * 100;

  $(".hero-track").css("transform", "translateX(" + offset + "%)");

  $(".dot").removeClass("active");
  $(".dot").eq(slideIndex - 1).addClass("active");
}


//home page product rows

//loasd products for home page rows
function loadHomeRows() {
  ProductModel.getAllProducts()
    .done(function (products) {

      // Home & Kitchen
      var homeKitchen = getCategoryProducts(products, "Home & Kitchen", 12);
      renderRow(homeKitchen, "homeRow");

      //Electronics
      var electronics = getCategoryProducts(products, "Electronics", 12);
      renderRow(electronics, "electronicsRow");

      //Toys & Games
      var toys = getCategoryProducts(products, "Toys & Games", 12);
      renderRow(toys, "toysRow");

      initRowArrows();
    })
    .fail(function (err) {
      console.error("Failed to load homepage products", err);
    });
}

//get products by category 
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




//product row rendering and arrow controls

//render products in a row
function renderRow(products, containerId) {
  var track = $("#" + containerId);
  track.empty();

  for (var i = 0; i < products.length; i++) {
    track.append(ProductModel.createProductBox(products[i]));
  }
}

//initialize row arrow button functionality
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


//category navigation 

function loadCategoryNav() {
  $.ajax({
    url: "./Data/categories.xml",
    dataType: "xml"
  })
    .done(function (xml) {
      var nav = $("#categoryNav");
      nav.empty();

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
