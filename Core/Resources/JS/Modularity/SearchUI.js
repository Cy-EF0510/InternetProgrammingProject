var SearchUI = {

  init: function () {

    if (typeof SearchModel === "undefined") {
      console.error("SearchModel.js is not loaded");
      return;
    }

    var input = $("#searchBar");
    var box = $("#searchSuggestions");

    if (!input.length || !box.length) return;

    // prevent double bind
    input.off(".searchui");
    $(document).off(".searchui");

    // preload products once
    SearchModel.loadAllProducts();

    //debounce timer
    var debounceTimer = null;

    input.on("input.searchui", function () {

      var query = input.val().trim();

      // cancel previous timer
      clearTimeout(debounceTimer);

      debounceTimer = setTimeout(function () {

        if (query.length < 2) {
          box.empty().hide();
          return;
        }

        SearchModel.getSuggestions(query, 6)
          .done(function (items) {

            box.empty();

            if (!items || items.length === 0) {
              box.append(
                $("<div>").addClass("s-item").text("No matches")
              );
              box.show();
              return;
            }

            for (var i = 0; i < items.length; i++) {
              (function (p) {

                var row = $("<div>")
                  .addClass("s-item")
                  .text(p.name || "Unnamed");

                row.on("click", function () {
                  window.location.href =
                    "SearchResultsPage.html?q=" +
                    encodeURIComponent(query);
                });

                box.append(row);

              })(items[i]);
            }

            box.show();
          })
          .fail(function () {
            box.empty().hide();
          });

      }, 250); // this is the debounce delay
    });

    //enter key
    input.on("keydown.searchui", function (e) {
      if (e.key === "Enter") {
        var q = input.val().trim();
        if (q !== "") {
          window.location.href =
            "SearchResultsPage.html?q=" + encodeURIComponent(q);
        }
      }
    });

    //click outside to close
    $(document).on("click.searchui", function (e) {
      if ($(e.target).closest(".search-wrapper").length === 0) {
        box.hide();
      }
    });
  }
};
