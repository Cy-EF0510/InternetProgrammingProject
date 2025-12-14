var HeaderModel = {
    createHeader: function () {
        const header = $("<header/>");
        const container = $("<div/>").addClass("header-container");

        /* ===== Logo ===== */
        const logo = $("<div/>").addClass("logo").append(
            $("<a/>")
                .attr("href", "HomePage.html")
                .append(
                    $("<img/>")
                        .addClass("logo-img")
                        .attr({
                            src: "Resources/IMG/notcircle.png",
                            alt: ""
                        })
                )   
        );

        /* ===== Navigation ===== */
       const nav = $("<nav/>").addClass("main-nav").append(
        $("<a/>").attr("href", "HomePage.html").text("Home"),
        $("<a/>").attr("href", "ProductListingPage.html").text("Products"),
        $("<a/>").attr("href", "AboutPage.html").text("Contact")
        );


        /* ===== Search Wrapper ===== */
        const searchWrapper = $("<div/>").addClass("search-wrapper").append(
            $("<input/>")
                .attr({
                    type: "text",
                    id: "searchBar",
                    placeholder: "Search products...",
                    autocomplete: "off"
                }),
            $("<div/>").attr("id", "searchSuggestions").addClass("search-suggestions")
        );

        /* ===== Cart Icon ===== */
        const cartIcon = $("<a/>")
            .attr("href", "ShoppingCartPage.html")
            .addClass("icon-btn")
            .append(
                $("<i/>").addClass("fas fa-shopping-cart"),
                $("<span/>").addClass("item-count-badge").text("0")
            );

        /* ===== User Icon ===== */
        const userIcon = AuthModel.isLoggedIn()
        ? $("<a/>")
            .attr("href", "ProfilePage.html")
            .addClass("icon-btn")
            .append($("<i/>").addClass("fas fa-user"))
        : $("<a/>")
            .attr("href", "LoginPage.html")
            .addClass("icon-btn")
            .append($("<i/>").addClass("fas fa-user"));

        /* ===== Header Actions ===== */
        const headerActions = $("<div/>").addClass("header-actions").append(
            searchWrapper,
            cartIcon,
            userIcon
        );

        /* ===== Assemble container ===== */
        container.append(
            logo,
            nav,
            headerActions
        );

        header.append(container);

        /* ===== Insert into DOM ===== */
        $("#header-container").html(header);

        return header;
    }
};