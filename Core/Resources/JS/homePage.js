/************************************************
 * HERO CAROUSEL (top banner)
 ************************************************/
let currentHero = 0;
const heroSlides = document.querySelectorAll(".hero-slide");
const heroDots = document.querySelectorAll(".dot");

function switchHero(index) {
    heroSlides.forEach(s => s.classList.remove("active"));
    heroDots.forEach(d => d.classList.remove("active"));

    heroSlides[index].classList.add("active");
    heroDots[index].classList.add("active");
    currentHero = index;
}

heroDots.forEach((dot, idx) => {
    dot.addEventListener("click", () => switchHero(idx));
});

setInterval(() => {
    currentHero = (currentHero + 1) % heroSlides.length;
    switchHero(currentHero);
}, 4000);


/************************************************
 * FEATURED PRODUCTS (JSON + RANDOM)
 ************************************************/
const FEATURED_COUNT = 6;
let carouselIndex = 0;

fetch("Data/products.json")
    .then(res => res.json())
    .then(products => {
        const randomProducts = getRandomProducts(products, FEATURED_COUNT);
        renderFeaturedProducts(randomProducts);
    })
    .catch(err => console.error("Error loading products:", err));


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
