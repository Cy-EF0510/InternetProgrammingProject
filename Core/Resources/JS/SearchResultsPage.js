
//globals
var allMatches = [];

var page = 1;
var pageSize = 12;

var isLoading = false;
var hasMore = true;

var activeQuery = "";

//page ready

$(document).ready(function () {

  // header + footer
  HeaderModel.createHeader();
  FooterModel.buildFooter();

  // Read query from URL
  var query = getParam("q");
  query = (query || "").trim();

  activeQuery = query;

  // Put query back into the header input
  if ($("#searchBar").length) {
    $("#searchBar").val(query);
  }

  if (query === "") {
    $("#searchStatus").text("Type something to search.");
    $("#searchResults").empty();
    return;
  }

  $("#searchStatus").text("Searching...");

  // Load all matches once
  SearchModel.findMatches(query)
    .done(function (matches) {

      if (!Array.isArray(matches)) {
        matches = [];
      }

      allMatches = matches;

      // reset paging
      page = 1;
      isLoading = false;
      hasMore = true;

      // clear UI
      $("#searchResults").empty();

      // render first page
      appendNextPage();

      // status text
      $("#searchStatus").text(allMatches.length + ' result(s) for "' + query + '"');

      // bind scroll AFTER we have results
      bindScroll();
    })
    .fail(function () {
      $("#searchStatus").text("Could not load products.");
      $("#searchResults").empty();
    });
});


//scroll event binding

function bindScroll() {

  // avoid multiple scroll bindings
  $(window).off("scroll.search");

  $(window).on("scroll.search", function () {

    var scrollTop = $(window).scrollTop();
    var windowHeight = $(window).height();
    var docHeight = $(document).height();

    var nearBottom = (scrollTop + windowHeight) >= (docHeight - 300);

    if (isLoading === false && hasMore === true && nearBottom === true) {
      appendNextPage();
    }
  });
}


// append next page
function appendNextPage() {

  if (isLoading === true) return;
  if (hasMore === false) return;

  isLoading = true;

  var start = (page - 1) * pageSize;
  var end = start + pageSize;

  var batch = allMatches.slice(start, end);

  if (batch.length === 0) {
    hasMore = false;
    isLoading = false;
    return;
  }

  for (var i = 0; i < batch.length; i++) {
    var p = batch[i];
    $("#searchResults").append(createResultCard(p, activeQuery));
  }

  page = page + 1;

  if (batch.length < pageSize) {
    hasMore = false;
  }

  isLoading = false;
}


// build card
function createResultCard(p, query) {

  var card = $("<div>");
  card.addClass("search-card");

  var nameHtml = highlightText(p.name || "", query);
  var descHtml = highlightText(p.description || "", query);
  var catHtml  = highlightText(p.category || "", query);

  var price = Number(p.price);
  var priceText = Number.isFinite(price) ? ("$" + price.toFixed(2)) : "";

  var img = $("<img>");
  img.addClass("search-thumb");
  img.attr("src", (p.image || "") + "?id=" + p.id);
  img.attr("alt", p.name || "Product");

  var info = $("<div>");
  info.addClass("search-info");

  info.append(
    $("<div>").addClass("search-name").html(nameHtml),
    $("<div>").addClass("search-cat").html(catHtml),
    $("<div>").addClass("search-desc").html(descHtml),
    $("<div>").addClass("search-price").text(priceText)
  );

  card.append(img, info);

  card.on("click", function () {
    window.location.href = "ProductDetailPage.html?id=" + encodeURIComponent(p.id);
  });

  return card;
}


// url helper
function getParam(name) {
  var params = new URLSearchParams(window.location.search);
  return params.get(name);
}


// highlight helper
function escapeHtml(s) {
  return String(s || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeRegex(s) {
  return String(s || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightText(text, query) {

  var safeText = escapeHtml(text || "");
  var q = String(query || "").trim();

  if (q === "") {
    return safeText;
  }

  var re = new RegExp("(" + escapeRegex(q) + ")", "ig");
  return safeText.replace(re, '<span class="search-hl">$1</span>');
}
