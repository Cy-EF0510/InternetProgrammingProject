var HeaderModel = {

  createHeader: function () {

    // Create main header
    var header = $("<header>");
    var container = $("<div>");
    container.addClass("header-container");

    /* ===== LOGO ===== */

    var logo = $("<div>");
    logo.addClass("logo");

    var logoLink = $("<a>");
    logoLink.attr("href", "HomePage.html");

    var logoImg = $("<img>");
    logoImg.addClass("logo-img");
    logoImg.attr("src", "Resources/IMG/notcircle.png");
    logoImg.attr("alt", "");

    logoLink.append(logoImg);
    logo.append(logoLink);

    /* ===== NAVIGATION ===== */

    var nav = $("<nav>");
    nav.addClass("main-nav");

    var homeLink = $("<a>");
    homeLink.attr("href", "HomePage.html");
    homeLink.text("Home");

    var productsLink = $("<a>");
    productsLink.attr("href", "ProductListingPage.html");
    productsLink.text("Products");

    var contactLink = $("<a>");
    contactLink.attr("href", "AboutPage.html");
    contactLink.text("Contact");

    nav.append(homeLink);
    nav.append(productsLink);
    nav.append(contactLink);

    /* ===== SEARCH ===== */

    var searchWrapper = $("<div>");
    searchWrapper.addClass("search-wrapper");

    var searchInput = $("<input>");
    searchInput.attr("type", "text");
    searchInput.attr("id", "searchBar");
    searchInput.attr("placeholder", "Search products...");
    searchInput.attr("autocomplete", "off");

    var searchSuggestions = $("<div>");
    searchSuggestions.attr("id", "searchSuggestions");
    searchSuggestions.addClass("search-suggestions");

    searchWrapper.append(searchInput);
    searchWrapper.append(searchSuggestions);

    /* ===== CART ICON ===== */

    var cartIcon = $("<a>");
    cartIcon.attr("href", "ShoppingCartPage.html");
    cartIcon.addClass("icon-btn");

    var cartI = $("<i>");
    cartI.addClass("fas fa-shopping-cart");

    var cartBadge = $("<span>");
    cartBadge.addClass("item-count-badge");
    cartBadge.text("0");

    cartIcon.append(cartI);
    cartIcon.append(cartBadge);

    /* ===== USER ICON ===== */

    var userIcon = $("<a>");
    userIcon.addClass("icon-btn");

    if (AuthModel.isLoggedIn()) {
      userIcon.attr("href", "ProfilePage.html");
    } else {
      userIcon.attr("href", "LoginPage.html");
    }

    var userI = $("<i>");
    userI.addClass("fas fa-user");
    userIcon.append(userI);

    /* ===== HEADER ACTIONS ===== */

    var headerActions = $("<div>");
    headerActions.addClass("header-actions");

    headerActions.append(searchWrapper);
    headerActions.append(cartIcon);
    headerActions.append(userIcon);

    /* ===== BUILD HEADER ===== */

    container.append(logo);
    container.append(nav);
    container.append(headerActions);

    header.append(container);

    /* ===== INSERT INTO PAGE ===== */

    $("#header-container").html(header);

    return header;


  }
};
