$(document).ready(function () {
  // must be logged in
  if (!AuthModel.requireLogin("LoginPage.html")) {
    return;
  }

  HeaderModel.createHeader();
  $("#footer-slot").append(FooterModel.createFooter());
  FooterModel.loadCategories();
  CartManagement.updateCartBadge();

  loadProfile();

  // avatar preview
  $("#avatar").on("input", function () {
    $("#avatarImg").attr("src", $(this).val());
  });

  // save profile (cookie only)
  $("#saveProfile").on("click", function () {
    const userId = $(this).data("userId");
    if (!userId) return;

    const data = {
      first_name: $("#firstName").val(),
      last_name: $("#lastName").val(),
      email: $("#email").val(),
      avatar: $("#avatar").val()
    };

    document.cookie =
      "profile_edits_" + userId + "=" +
      encodeURIComponent(JSON.stringify(data)) +
      "; path=/; max-age=" + (60 * 60 * 24 * 30);

    $("#profileMsg").text("Saved");
  });

  // reset profile
  $("#resetProfile").on("click", function () {
    const userId = $(this).data("userId");
    if (!userId) return;

    document.cookie =
      "profile_edits_" + userId +
      "=; path=/; max-age=0";

    loadProfile();
    $("#profileMsg").text("Reset");
  });
});


function loadProfile() {
  const auth = AuthModel.getAuth();

  if (!auth || !auth.token) {
    window.location.href = "LoginPage.html";
    return;
  }

  if (!auth.email) {
    $("#profileMsg").text("Missing email");
    return;
  }

  $("#profileMsg").text("Loading profile...");

  findUserByEmail(auth.email);
}


function findUserByEmail(email) {
  const targetEmail = email.toLowerCase();
  let page = 1;

  function loadPage() {
    $.ajax({
      url: "https://reqres.in/api/users?per_page=6&page=" + page,
      method: "GET",
      headers: {
        "x-api-key": "reqres_0500eb5af06f494291043eca51a3dae2"
      }
    })
    .done(function (res) {

      for (let i = 0; i < res.data.length; i++) {
        const user = res.data[i];

        if (user.email.toLowerCase() === targetEmail) {
          showProfile(user);
          return;
        }
      }

      if (page < res.total_pages) {
        page++;
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
  const userId = apiUser.id;
  let edits = {};

  const cookies = document.cookie.split("; ");
  for (let i = 0; i < cookies.length; i++) {
    if (cookies[i].startsWith("profile_edits_" + userId + "=")) {
      try {
        edits = JSON.parse(
          decodeURIComponent(cookies[i].split("=").slice(1).join("="))
        );
      } catch {}
    }
  }

  $("#firstName").val(edits.first_name || apiUser.first_name);
  $("#lastName").val(edits.last_name || apiUser.last_name);
  $("#email").val(edits.email || apiUser.email);
  $("#avatar").val(edits.avatar || apiUser.avatar);
  $("#avatarImg").attr("src", edits.avatar || apiUser.avatar);

  $("#saveProfile").data("userId", userId);
  $("#resetProfile").data("userId", userId);

  $("#profileMsg").text("");
}
