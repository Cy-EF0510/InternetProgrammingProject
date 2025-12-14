$(document).ready(function () {
    // If already logged in, don’t show login page
  if (AuthModel.isLoggedIn()) {
    AuthModel.redirectAfterLogin();   // goes to ?next=... or HomePage
    return;
  }
  // call the live validation binder
  ValidatorModel.bindLive();

  $("#submitBtn").on("click", function () {
    if (ValidatorModel.checkLogin()) {
      requestUsers(
        $("#email").val().trim(),
        $("#pass").val()
      );
    }
  });
});

function requestUsers(email, password){
    var urlUsers = "https://reqres.in/api/login";
    $.ajax({
        method: "POST",
        url: urlUsers,
        contentType: "application/json",
        accept: 'application/json',
        data: JSON.stringify({
            email: email,
            password: password
        }),
        headers: {
            "x-api-key": "reqres_0500eb5af06f494291043eca51a3dae2"
            }
        })
        .done(function(o){
          // Use AuthModel (sets authToken as a session cookie)
          AuthModel.login(o.token,email,3600);

          // Go back to the page they tried to access, or default
          AuthModel.redirectAfterLogin();
        
        })
        .fail(function (o) {
            ValidatorModel.showAlert(
                "Login failed: " + (o.responseJSON?.error || "Unknown error")
            );
        });

    }

