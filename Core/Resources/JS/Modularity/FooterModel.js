var FooterModel = {

  createFooter: function () {

    // main footer
    var footer = $("<footer/>");

    // container
    var container = $("<div/>");
    container.addClass("footer-container");

    /* ===== CATEGORIES ===== */
    var categoriesSection = $("<div/>");
    categoriesSection.addClass("footer-section categories");

    var categoriesWrap = $("<div/>");
    categoriesWrap.addClass("footer-categories-wrap");

    var categoriesTitle = $("<h3/>");
    categoriesTitle.text("Categories");

    var categoriesList = $("<ul/>");
    categoriesList.attr("id", "footerCategoryLinks");

    categoriesWrap.append(categoriesTitle);
    categoriesWrap.append(categoriesList);
    categoriesSection.append(categoriesWrap);

    /* ===== CONTACT ===== */
    var contactSection = $("<div/>");
    contactSection.addClass("footer-section");

    var contactTitle = $("<h3/>").text("Contact");
    var contactEmail = $("<p/>").text("Email: RogueCompany@gmail.com");
    var contactPhone = $("<p/>").text("Phone: +1 (514) 555-1234");
    var contactAddress = $("<p/>").text("Address: 123 Main Street, Montreal");

    contactSection.append(contactTitle);
    contactSection.append(contactEmail);
    contactSection.append(contactPhone);
    contactSection.append(contactAddress);

    /* ===== NEWSLETTER ===== */
    var newsletterSection = $("<div/>");
    newsletterSection.addClass("footer-section");

    var newsletterTitle = $("<h3/>").text("Newsletter");
    var newsletterText = $("<p/>").text("Stay updated on deals and new products.");

    var newsletterBox = $("<div/>");
    newsletterBox.addClass("newsletter-box");

    var newsletterInput = $("<input/>");
    newsletterInput.attr("type", "email");
    newsletterInput.attr("placeholder", "Enter your email");

    var newsletterBtn = $("<button/>");
    newsletterBtn.text("Sign Up");

    newsletterBox.append(newsletterInput);
    newsletterBox.append(newsletterBtn);

    newsletterSection.append(newsletterTitle);
    newsletterSection.append(newsletterText);
    newsletterSection.append(newsletterBox);

    /* ===== SOCIAL ===== */
    var socialSection = $("<div/>");
    socialSection.addClass("footer-section footer-social");

    var socialTitle = $("<h3/>");
    socialTitle.text("Follow Us");

    var socialIcons = $("<div/>");
    socialIcons.addClass("social-icons");

    var instaLink = $("<a/>");
    instaLink.attr("href", "https://instagram.com/");
    instaLink.attr("target", "_blank");
    instaLink.attr("aria-label", "Instagram");
    instaLink.append($("<i/>").addClass("fa-brands fa-instagram"));

    var fbLink = $("<a/>");
    fbLink.attr("href", "https://facebook.com/");
    fbLink.attr("target", "_blank");
    fbLink.attr("aria-label", "Facebook");
    fbLink.append($("<i/>").addClass("fa-brands fa-facebook"));

    var xLink = $("<a/>");
    xLink.attr("href", "https://twitter.com/");
    xLink.attr("target", "_blank");
    xLink.attr("aria-label", "Twitter / X");
    xLink.append($("<i/>").addClass("fa-brands fa-x-twitter"));

    socialIcons.append(instaLink);
    socialIcons.append(fbLink);
    socialIcons.append(xLink);

    socialSection.append(socialTitle);
    socialSection.append(socialIcons);

    /* ===== PUT SECTIONS INTO CONTAINER ===== */
    container.append(categoriesSection);
    container.append(contactSection);
    container.append(newsletterSection);
    container.append(socialSection);

    /* ===== FOOTER BOTTOM ===== */
    var footerBottom = $("<div/>");
    footerBottom.addClass("footer-bottom");
    footerBottom.html("&copy; 2025 The Rogue Market. All rights reserved.");

    footer.append(container);
    footer.append(footerBottom);

    return footer;
  },

  loadCategories: function () {
    return $.ajax({
      url: "./Data/categories.xml",
      dataType: "xml"
    })
      .done(function (xml) {
        var list = $("#footerCategoryLinks");

        if (!list.length) {
          return;
        }

        list.empty();

        $(xml).find("category > name").each(function () {
          var name = $(this).text().trim();
          var href = "ProductListingPage.html?category=" + encodeURIComponent(name);

          var link = $("<a/>");
          link.attr("href", href);
          link.text(name);

          var li = $("<li/>");
          li.append(link);

          list.append(li);
        });
      })
      .fail(function (xhr) {
        console.error("Footer categories failed to load:", xhr.status);
      });
  }
};
