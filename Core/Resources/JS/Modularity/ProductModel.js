var ProductModel = {

  // "" or null => Data/products.json
  // "Home & Kitchen" => Data/Home%20%26%20Kitchen.json
  getProducts: function (category) {
    const url = category
      ? ("./Data/" + encodeURIComponent(category) + ".json")
      : "./Data/products.json";

    return $.getJSON(url);
  },

  // backward compatible
  getAllProducts: function () {
    
    return this.getProducts("");
  },

  createProductBox: function (product) {
    const price = Number(product.price);

    const card = $("<div/>")
      .addClass("product-card")
      .attr("data-id", product.id)
      .css("cursor", "pointer");

    card.on("click", function () {
      window.location.href = `ProductDetailPage.html?id=${product.id}`;
    });

    const imgWrap = $("<div/>").addClass("product-img-wrap");

  const img = $("<img/>")
      .addClass("product-img")
      .attr("src", product.image + "?id=" + product.id)
      .attr("alt", product.name);


    imgWrap.append(img);

    const priceRow = $("<div/>").addClass("price-row");
    priceRow.append(
      $("<div/>").addClass("price").text(`$${price.toFixed(2)}`),
      $("<div/>").addClass("stock").text(`Stock: ${product.stock}`)
    );

    card.append(
      imgWrap,
      priceRow,
      $("<div/>").addClass("title").text(product.name),
      $("<div/>").addClass("cat").text(product.category)
    );

    return card;
  }
};
