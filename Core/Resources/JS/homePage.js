
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
const FEATURED_COUNT = 6;
let carouselIndex = 0;

//testings for product model / it workings

// $(document).ready(function () {

//     ProductModel.getAllProducts().done(function (products) {

//         console.log("Model WOrks - prodcuts loaded: ", products);

//         console.log("num of products: ", products.length);

//     }).fail(function () {
        
//         console.error("Model failed!!!");

//     })

// })






function getRandomProducts(products, count) {
    const shuffled = [...products];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, count);
}


function renderFeaturedProducts(products) {
    const track = document.getElementById("featuredTrack");
    track.innerHTML = "";

    products.forEach(p => {
        track.innerHTML += `
            <div class="product-card">
                <img src="${p.image}" alt="${p.name}">
                <h3>${p.name}</h3>
                <p>$${p.price.toFixed(2)}</p>
                <button class="view-btn">View</button>
            </div>
        `;
    });
}


/************************************************
 * FEATURED PRODUCTS CAROUSEL CONTROLS
 ************************************************/
const btnLeft = document.querySelector(".carousel-btn.left");
const btnRight = document.querySelector(".carousel-btn.right");
const track = document.getElementById("featuredTrack");

btnRight.addEventListener("click", () => {
    carouselIndex++;
    track.style.transform = `translateX(-${carouselIndex * 260}px)`;
});

btnLeft.addEventListener("click", () => {
    if (carouselIndex > 0) carouselIndex--;
    track.style.transform = `translateX(-${carouselIndex * 260}px)`;
});
