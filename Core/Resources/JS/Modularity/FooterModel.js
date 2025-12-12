var FooterModel = {

  createFooter: function () {

    const footer = $("<footer/>");

    const container = $("<div/>").addClass("footer-container");

    /* ===== Categories ===== */
    const categoriesSection = $("<div/>").addClass("footer-section");
    const categoriesList = $("<ul/>").append(
      $("<li/>").append($("<a/>").attr("href", "#").text("Clothing")),
      $("<li/>").append($("<a/>").attr("href", "#").text("Electronics")),
      $("<li/>").append($("<a/>").attr("href", "#").text("Home")),
      $("<li/>").append($("<a/>").attr("href", "#").text("Accessories"))
    );

    categoriesSection.append(
      $("<h3/>").text("Categories"),
      categoriesList
    );

    /* ===== Contact ===== */
    const contactSection = $("<div/>").addClass("footer-section").append(
      $("<h3/>").text("Contact"),
      $("<p/>").text("Email: support@example.com"),
      $("<p/>").text("Phone: +1 (514) 555-1234"),
      $("<p/>").text("Address: 123 Main Street, Montreal")
    );

    /* ===== Newsletter ===== */
    const newsletterBox = $("<div/>").addClass("newsletter-box").append(
      $("<input/>").attr({
        type: "email",
        placeholder: "Enter your email"
      }),
      $("<button/>").text("Sign Up")
    );

    const newsletterSection = $("<div/>").addClass("footer-section").append(
      $("<h3/>").text("Newsletter"),
      $("<p/>").text("Stay updated on deals and new products."),
      newsletterBox
    );

    /* ===== Social ===== */
    const socialIcons = $("<div/>").addClass("social-icons").append(
      $("<a/>")
        .attr({
          href: "https://instagram.com/yourname",
          target: "_blank",
          "aria-label": "Instagram"
        })
        .append($("<i/>").addClass("fa-brands fa-instagram")),

      $("<a/>")
        .attr({
          href: "https://facebook.com/yourname",
          target: "_blank",
          "aria-label": "Facebook"
        })
        .append($("<i/>").addClass("fa-brands fa-facebook")),

      $("<a/>")
        .attr({
          href: "https://twitter.com/yourname",
          target: "_blank",
          "aria-label": "Twitter/X"
        })
        .append($("<i/>").addClass("fa-brands fa-x-twitter"))
    );

    const socialSection = $("<div/>").addClass("footer-section").append(
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
      .text("© 2025 Your Store Name. All rights reserved.");

    footer.append(container, footerBottom);

    return footer;
  }
};
