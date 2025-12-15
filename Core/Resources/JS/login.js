$(document).ready(function () {

  AuthModel.forwardNextParam("#registerLink", "RegisterPage.html");
  
  if (AuthModel.isLoggedIn()) {
    AuthModel.redirectAfterLogin();  
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
          //uses auth model to login
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

