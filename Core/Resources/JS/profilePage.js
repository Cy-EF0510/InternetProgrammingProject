$(document).ready(function () {
  // ===== MUST BE LOGGED IN =====
  if (!AuthModel.requireLogin("LoginPage.html")) {
    return;
  }

  // ===== LAYOUT =====
  HeaderModel.createHeader();
  FooterModel.buildFooter();
  CartManagement.updateCartBadge();

  // ===== LOAD PROFILE =====
  loadProfile();

  // ===== EVENTS =====
  setupAvatarPreview();
  setupSaveButton();
  setupResetButton();
  setupLogoutButton();
});


function setupAvatarPreview() {
  $("#avatar").on("input", function () {
    var url = $("#avatar").val();
    $("#avatarImg").attr("src", url);
  });
}

function setupSaveButton() {
  $("#saveProfile").on("click", function () {

    var userId = $("#saveProfile").data("userId");
    if (!userId) {
      return;
    }

    var data = {};
    data.first_name = $("#firstName").val();
    data.last_name  = $("#lastName").val();
    data.email      = $("#email").val();
    data.avatar     = $("#avatar").val();

    var cookieName = "profile_edits_" + userId;
    var cookieValue = encodeURIComponent(JSON.stringify(data));
    var maxAge = 60 * 60 * 24 * 30; // 30 days

    document.cookie =
      cookieName + "=" + cookieValue + "; path=/; max-age=" + maxAge;

    $("#profileMsg").text("Saved");
  });
}

function setupResetButton() {
  $("#resetProfile").on("click", function () {

    var userId = $("#resetProfile").data("userId");
    if (!userId) {
      return;
    }

    var cookieName = "profile_edits_" + userId;

    document.cookie = cookieName + "=; path=/; max-age=0";

    loadProfile();
    $("#profileMsg").text("Reset");
  });
}

function setupLogoutButton() {
  $("#logoutBtn").on("click", function () {
    AuthModel.logout();
  });
}


function loadProfile() {

  var auth = AuthModel.getAuth();

  // not logged in / missing token
  if (!auth || !auth.token) {
    window.location.href = "LoginPage.html";
    return;
  }

  // need email to find user
  if (!auth.email) {
    $("#profileMsg").text("Missing email");
    return;
  }

  $("#profileMsg").text("Loading profile...");

  findUserByEmail(auth.email);
}


function findUserByEmail(email) {

  var targetEmail = String(email).toLowerCase();
  var page = 1;

  function loadPage() {

    var url = "https://reqres.in/api/users?per_page=6&page=" + page;

    $.ajax({
      url: url,
      method: "GET",
      headers: {
        "x-api-key": "reqres_0500eb5af06f494291043eca51a3dae2"
      }
    })
    .done(function (res) {

      // look through users on this page
      var users = res.data;

      for (var i = 0; i < users.length; i++) {
        var user = users[i];

        if (String(user.email).toLowerCase() === targetEmail) {
          showProfile(user);
          return;
        }
      }

      // try next page if available
      if (page < res.total_pages) {
        page = page + 1;
        loadPage();
      } else {
        $("#profileMsg").text("User not found");
      }
    })
    .fail(function () {
      $("#profileMsg").text("API error");
    });
  }

  loadPage();
}


function showProfile(apiUser) {

  var userId = apiUser.id;

  // default edits is empty
  var edits = {};

  // read cookie edits if they exist
  var cookieName = "profile_edits_" + userId;
  var cookieValue = readCookie(cookieName);

  if (cookieValue) {
    try {
      edits = JSON.parse(decodeURIComponent(cookieValue));
    } catch (e) {
      edits = {};
    }
  }

  // fill form (cookie edits override api)
  $("#firstName").val(edits.first_name || apiUser.first_name);
  $("#lastName").val(edits.last_name || apiUser.last_name);
  $("#email").val(edits.email || apiUser.email);
  $("#avatar").val(edits.avatar || apiUser.avatar);

  $("#avatarImg").attr("src", edits.avatar || apiUser.avatar);

  // store id for save/reset
  $("#saveProfile").data("userId", userId);
  $("#resetProfile").data("userId", userId);

  $("#profileMsg").text("");
}


function readCookie(name) {

  var cookies = document.cookie.split("; ");

  for (var i = 0; i < cookies.length; i++) {

    var parts = cookies[i].split("=");
    var key = parts[0];
    var value = parts.slice(1).join("=");

    if (key === name) {
      return value;
    }
  }

  return null;
}
