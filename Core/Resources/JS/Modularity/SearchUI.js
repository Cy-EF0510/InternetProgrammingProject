var SearchUI = {

  init: function () {

    var input = $("#searchBar");
    var box = $("#searchSuggestions");

    // header not on this page
    if (!input.length || !box.length) {
      return;
    }

    // preload products once
    SearchModel.loadAllProducts();

    // live typing
    input.on("input", function () {
      var q = input.val().trim();

      if (q.length < 2) {
        box.hide().empty();
        return;
      }

      SearchModel.getSuggestions(q, 6).then(function (items) {

        box.empty();

        if (items.length === 0) {
          box.append(
            $("<div>").addClass("s-item").text("No matches")
          );
          box.show();
          return;
        }

        for (var i = 0; i < items.length; i++) {
          (function (product) {

            var row = $("<div>")
              .addClass("s-item")
              .text(product.name);

            row.on("click", function () {
              window.location.href =
                "SearchResultsPage.html?q=" +
                encodeURIComponent(q);
            });

            box.append(row);

          })(items[i]);
        }

        box.show();
      });
    });

    // Enter key → results page
    input.on("keydown", function (e) {
      if (e.key === "Enter") {
        var q = input.val().trim();
        if (q !== "") {
          window.location.href =
            "SearchResultsPage.html?q=" +
            encodeURIComponent(q);
        }
      }
    });

    // click outside closes suggestions
    $(document).on("click", function (e) {
      if ($(e.target).closest(".search-wrapper").length === 0) {
        box.hide();
      }
    });
  }
};
