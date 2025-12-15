var FooterModel = {

  buildFooter: function () {
    this.createFooter();
    this.loadCategories();
  },

  // picks the correct slot automatically
  getMountPoint: function () {
    var slot = $("#footer-slot");
    if (slot.length) return slot;

    var container = $("#footer-container");
    if (container.length) return container;

    // fallback: last resort
    return $("body");
  },

  createFooter: function () {

    var footer = $("<footer>");
    var container = $("<div>");
    container.addClass("footer-container");

    // ===== CATEGORIES =====
    var categoriesSection = $("<div>");
    categoriesSection.addClass("footer-section categories");

    var categoriesWrap = $("<div>");
    categoriesWrap.addClass("footer-categories-wrap");

    var categoriesTitle = $("<h3>");
    categoriesTitle.text("Categories");

    var categoriesList = $("<ul>");
    categoriesList.attr("id", "footerCategoryLinks");

    categoriesWrap.append(categoriesTitle);
    categoriesWrap.append(categoriesList);
    categoriesSection.append(categoriesWrap);

    // ===== CONTACT =====
    var contactSection = $("<div>");
    contactSection.addClass("footer-section");

    var contactTitle = $("<h3>");
    contactTitle.text("Contact");

    var contactEmail = $("<p>").text("Email: RogueCompany@gmail.com");
    var contactPhone = $("<p>").text("Phone: +1 (514) 555-1234");
    var contactAddress = $("<p>").text("Address: 123 Main Street, Montreal");

    contactSection.append(contactTitle, contactEmail, contactPhone, contactAddress);

    // ===== NEWSLETTER =====
    var newsletterSection = $("<div>");
    newsletterSection.addClass("footer-section");

    var newsletterTitle = $("<h3>").text("Newsletter");
    var newsletterText = $("<p>").text("Stay updated on deals and new products.");

    var newsletterBox = $("<div>").addClass("newsletter-box");
    var newsletterInput = $("<input>").attr("type", "email").attr("placeholder", "Enter your email");
    var newsletterBtn = $("<button>").text("Sign Up");

    newsletterBox.append(newsletterInput, newsletterBtn);
    newsletterSection.append(newsletterTitle, newsletterText, newsletterBox);

    // ===== SOCIAL =====
    var socialSection = $("<div>");
    socialSection.addClass("footer-section footer-social");

    var socialTitle = $("<h3>").text("Follow Us");
    var socialIcons = $("<div>").addClass("social-icons");

    var instaLink = $("<a>")
      .attr("href", "https://instagram.com/")
      .attr("target", "_blank")
      .attr("aria-label", "Instagram")
      .append($("<i>").addClass("fa-brands fa-instagram"));

    var fbLink = $("<a>")
      .attr("href", "https://facebook.com/")
      .attr("target", "_blank")
      .attr("aria-label", "Facebook")
      .append($("<i>").addClass("fa-brands fa-facebook"));

    var xLink = $("<a>")
      .attr("href", "https://twitter.com/")
      .attr("target", "_blank")
      .attr("aria-label", "Twitter / X")
      .append($("<i>").addClass("fa-brands fa-x-twitter"));

    socialIcons.append(instaLink, fbLink, xLink);
    socialSection.append(socialTitle, socialIcons);

    // ===== ASSEMBLE =====
    container.append(categoriesSection, contactSection, newsletterSection, socialSection);

    var footerBottom = $("<div>");
    footerBottom.addClass("footer-bottom");
    footerBottom.html("&copy; 2025 The Rogue Market. All rights reserved.");

    footer.append(container, footerBottom);

    // inject into the right place
    var $mount = this.getMountPoint();
    $mount.html(footer);

    return footer;
  },

  loadCategories: function () {

    $.ajax({
      url: "./Data/categories.xml",
      dataType: "xml"
    })
    .done(function (xml) {

      var list = $("#footerCategoryLinks");
      if (!list.length) return;

      list.empty();

      $(xml).find("category > name").each(function () {
        var name = $(this).text().trim();

        var link = $("<a>");
        link.attr("href", "ProductListingPage.html?category=" + encodeURIComponent(name));
        link.text(name);

        var li = $("<li>").append(link);
        list.append(li);
      });
    })
    .fail(function (xhr) {
      console.error("Footer categories failed to load:", xhr.status);
    });
  }
};
