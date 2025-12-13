
let totalSlides = 0;

$(document).ready(function () {
    HeaderModel.createHeader();
    $("#footer-slot").append(FooterModel.createFooter());
    
    totalSlides = $(".mySlides").length;

    updateCarousel();
    startAutoSlide();

    $(".hero-carousel").hover(
        () => stopAutoSlide(),
        () => startAutoSlide()
    );

    
    CartManagement.updateCartBadge();


    // Load products and render featured products

  ProductModel.getAllProducts()
    .done(function (products) {

      const homeKitchen = products
        .filter(p => p.category === "Home & Kitchen")
        .slice(0, 12);
      renderRow(homeKitchen, "homeRow");

      const electronics = products
        .filter(p => p.category === "Electronics")
        .slice(0, 12);
      renderRow(electronics, "electronicsRow");

      const toys = products
        .filter(p => p.category === "Toys & Games")
        .slice(0, 12);
      renderRow(toys, "toysRow");

      initRowArrows();

    })
    .fail(function (err) {
      console.error("Failed to load homepage products", err);
    });





    

});


/************************************************
 * HERO CAROUSEL (W3Schools-style)
 ************************************************/

let slideIndex = 1;

function plusSlides(n) {
  stopAutoSlide();
  slideIndex += n;
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

let autoSlideInterval = null;

function startAutoSlide() {
  stopAutoSlide(); // prevent duplicates
  autoSlideInterval = setInterval(() => {
    plusSlides(1);
  }, 5000); // 5 seconds
}

function stopAutoSlide() {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval);
    autoSlideInterval = null;
  }
}

function wrapIndex() {
  if (slideIndex > totalSlides) slideIndex = 1;
  if (slideIndex < 1) slideIndex = totalSlides;
}


function updateCarousel() {
  const offset = -(slideIndex - 1) * 100;

  $(".hero-track").css(
    "transform",
    `translateX(${offset}%)`
  );

  $(".dot").removeClass("active");
  $(".dot").eq(slideIndex - 1).addClass("active");
}




/************************************************
 * FEATURED PRODUCTS (JSON + RANDOM)
 ************************************************/

function getRandomProducts(products, count) {
    const shuffled = [...products];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, count);
}


function renderRow(products, containerId) {
  const track = $("#" + containerId);
  track.empty();

  products.forEach(product => {
    track.append(ProductModel.createProductBox(product));
  });
}


function initRowArrows() {
  $(".product-row").each(function () {
    const $row = $(this);
    const $track = $row.find(".row-track");

    $row.find(".row-btn.left").off("click").on("click", function () {
      const cardW = $track.find(".product-card").first().outerWidth(true) || 240;
      $track[0].scrollBy({ left: -(cardW * 3), behavior: "smooth" });
    });

    $row.find(".row-btn.right").off("click").on("click", function () {
      const cardW = $track.find(".product-card").first().outerWidth(true) || 240;
      $track[0].scrollBy({ left: (cardW * 3), behavior: "smooth" });
    });
  });
}


