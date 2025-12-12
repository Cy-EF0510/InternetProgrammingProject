function loadProducts() {
  return $.getJSON("Data/products.json");
}

function buildProductCard(product) {
  const price = Number(product.price);

  const card = $("<div/>")
    .addClass("product-card")
    .attr("data-id", product.id)
    .css("cursor", "pointer");

  const imgWrap = $("<div/>").addClass("product-img-wrap");

  const img = $("<img/>")
    .addClass("product-img")
    .attr("src", product.image + "?id=" + product.id)
    .attr("alt", product.name);

  imgWrap.append(img);

  const priceRow = $("<div/>").addClass("price-row").append(
    $("<div/>").addClass("price").text(`$${price.toFixed(2)}`),
    $("<div/>").addClass("stock").text(product.stock > 0 ? "In stock" : "Out of stock")
  );

  const title = $("<div/>").addClass("title").text(product.name);
  const cat = $("<div/>").addClass("cat").text(product.category);

  card.append(imgWrap, priceRow, title, cat);

  return card;
}


function getCategories(products) {
  const set = new Set();
  for (let i = 0; i < products.length; i++) set.add(products[i].category);
  return Array.from(set).sort();
}

function applySearch(products, query) {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return products;

  return products.filter(p =>
    String(p.name).toLowerCase().includes(q) ||
    String(p.category).toLowerCase().includes(q) ||
    String(p.sku || "").toLowerCase().includes(q) ||
    String(p.description || "").toLowerCase().includes(q)
  );
}

function applyFilters(products, filters) {
  const cat = String(filters.category || "");
  const maxPrice = Number(filters.maxPrice);

  return products.filter(p => {
    const price = Number(p.price);

    if (cat && p.category !== cat) return false;
    if (!Number.isNaN(maxPrice) && price > maxPrice) return false;

    return true;
  });
}

function applySort(products, sortValue) {
  const sort = String(sortValue || "");

  // clone so we don't reorder the original array
  const arr = products.slice();

  if (sort === "price-asc") {
    arr.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sort === "price-desc") {
    arr.sort((a, b) => Number(b.price) - Number(a.price));
  }

  return arr;
}

function buildSuggestions(products, query, limit = 6) {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return [];

  const out = [];
  for (let i = 0; i < products.length; i++) {
    const name = String(products[i].name).toLowerCase();
    if (name.includes(q)) out.push(products[i]);
    if (out.length >= limit) break;
  }
  return out;
}




