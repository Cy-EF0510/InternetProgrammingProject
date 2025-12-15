var ProductModel = {
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

    // get price and make sure it's a number
    var price = Number(product.price);

    // create main card
    var card = $("<div>");
    card.addClass("product-card");
    card.attr("data-id", product.id);
    card.css("cursor", "pointer");

    // click event to go to product detail page
    card.on("click", function () {
      window.location.href = "ProductDetailPage.html?id=" + product.id;
    });

    // image wrapper
    var imgWrap = $("<div>");
    imgWrap.addClass("product-img-wrap");

    // product image
    var img = $("<img>");
    img.addClass("product-img");
    img.attr("src", product.image + "?id=" + product.id);
    img.attr("alt", product.name);

    imgWrap.append(img);

    // price + stock row
    var priceRow = $("<div>");
    priceRow.addClass("price-row");

    var priceDiv = $("<div>");
    priceDiv.addClass("price");
    priceDiv.text("$" + price.toFixed(2));

    var stockDiv = $("<div>");
    stockDiv.addClass("stock");
    stockDiv.text("Stock: " + product.stock);

    priceRow.append(priceDiv);
    priceRow.append(stockDiv);

    // product title
    var titleDiv = $("<div>");
    titleDiv.addClass("title");
    titleDiv.text(product.name);

    // product category
    var categoryDiv = $("<div>");
    categoryDiv.addClass("cat");
    categoryDiv.text(product.category);

    // put everything into the card
    card.append(imgWrap);
    card.append(priceRow);
    card.append(titleDiv);
    card.append(categoryDiv);

    return card;
  }

};
