var FooterModel = {

  createFooter: function () {

    const footer = $("<footer/>");
    const container = $("<div/>").addClass("footer-container");

    /* ===== Categories (from XML) ===== */
    const categoriesSection = $("<div/>").addClass("footer-section categories");

    const categoriesWrap = $("<div/>").addClass("footer-categories-wrap");
    const categoriesList = $("<ul/>").attr("id", "footerCategoryLinks");

    categoriesWrap.append(
      $("<h3/>").text("Categories"),
      categoriesList
    );

    categoriesSection.append(categoriesWrap);

    /* ===== Contact ===== */
    const contactSection = $("<div/>").addClass("footer-section").append(
      $("<h3/>").text("Contact"),
      $("<p/>").text("Email: RogueCompany@gmail.com"),
      $("<p/>").text("Phone: +1 (514) 555-1234"),
      $("<p/>").text("Address: 123 Main Street, Montreal")
    );

    /* ===== Newsletter ===== */
    const newsletterSection = $("<div/>").addClass("footer-section");
    const newsletterBox = $("<div/>").addClass("newsletter-box").append(
      $("<input/>").attr({
        type: "email",
        placeholder: "Enter your email"
      }),
      $("<button/>").text("Sign Up")
    );

    newsletterSection.append(
      $("<h3/>").text("Newsletter"),
      $("<p/>").text("Stay updated on deals and new products."),
      newsletterBox
    );

    /* ===== Social ===== */
    const socialSection = $("<div/>").addClass("footer-section footer-social");
    const socialIcons = $("<div/>").addClass("social-icons").append(
      $("<a/>", {
        href: "https://instagram.com/",
        target: "_blank",
        "aria-label": "Instagram"
      }).append($("<i/>").addClass("fa-brands fa-instagram")),

      $("<a/>", {
        href: "https://facebook.com/",
        target: "_blank",
        "aria-label": "Facebook"
      }).append($("<i/>").addClass("fa-brands fa-facebook")),

      $("<a/>", {
        href: "https://twitter.com/",
        target: "_blank",
        "aria-label": "Twitter / X"
      }).append($("<i/>").addClass("fa-brands fa-x-twitter"))
    );

    socialSection.append(
      $("<h3/>").text("Follow Us"),
      socialIcons
    );

    /* ===== Assemble container ===== */
    container.append(
      categoriesSection,
      contactSection,
      newsletterSection,
      socialSection
    );

    /* ===== Footer bottom ===== */
    const footerBottom = $("<div/>")
      .addClass("footer-bottom")
      .html("&copy; 2025 The Rogue Market. All rights reserved.");

    footer.append(container, footerBottom);

    return footer;
  },

  /* ===== Load categories from XML ===== */
  loadCategories: function () {
    return $.ajax({
      url: "Data/categories.xml",
      dataType: "xml"
    })
    .done(function (xml) {
      const $list = $("#footerCategoryLinks");
      if (!$list.length) return;

      $list.empty();

      $(xml).find("category > name").each(function () {
        const name = $(this).text().trim();
        const href = "ProductListingPage.html?category=" + encodeURIComponent(name);

        $list.append(
          $("<li/>").append(
            $("<a/>").attr("href", href).text(name)
          )
        );
      });
    })
    .fail(function (xhr) {
      console.error("Footer categories failed to load:", xhr.status);
    });
  }
};
