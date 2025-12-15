$(document).ready(function () {

  HeaderModel.createHeader();
  SearchUI.init();
  FooterModel.buildFooter();

  var q = getParam("q") || "";
  $("#searchBar").val(q);

  if (q === "") {
    $("#searchStatus").text("Type something to search.");
    return;
  }

  $("#searchStatus").text("Searching...");

  SearchModel.findMatches(q).then(function (results) {

    $("#searchStatus").text(
      results.length + " result(s) for \"" + q + "\""
    );

    renderResults(results, q);
  });
});

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function highlight(text, q) {
  var safe = escapeHtml(text || "");
  var re = new RegExp("(" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig");
  return safe.replace(re, '<span class="search-hl">$1</span>');
}

function renderResults(list, q) {

  var wrap = $("#searchResults");
  wrap.empty();

  if (list.length === 0) {
    wrap.append($("<p>").text("No matches found."));
    return;
  }

  for (var i = 0; i < list.length; i++) {

    var p = list[i];

    var card = $("<div>").addClass("search-card");

    card.append(
      $("<div>").addClass("search-name").html(highlight(p.name, q)),
      $("<div>").addClass("search-desc").html(highlight(p.description, q)),
      $("<div>").addClass("search-price").text("$" + Number(p.price).toFixed(2))
    );

    (function (id) {
      card.on("click", function () {
        window.location.href =
          "ProductDetailPage.html?id=" + id;
      });
    })(p.id);

    wrap.append(card);
  }
}
