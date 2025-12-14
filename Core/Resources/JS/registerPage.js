$(document).ready(function(){
    // If already logged in, don’t show register page
    if (AuthModel.isLoggedIn()) {
        AuthModel.redirectAfterLogin();
        return;
    }

    ValidatorModel.bindLive();

    $("#submitBtn").on("click", function () {
        if (ValidatorModel.checkRegister()) {
        requestUsers(
            $("#email").val().trim(),
            $("#pass").val()
        );
        }
    });
});


function requestUsers( email, password){
    var urlUsers = "https://reqres.in/api/register";
    $.ajax({
        url: urlUsers,
        type: "POST",
        contentType: "application/json",
        accept: 'application/json',
        data: JSON.stringify({
            username: email,
            email: email,
            password: password
        }),
        headers: {
            "x-api-key": "reqres_0500eb5af06f494291043eca51a3dae2"
            },
        success: function(o) {
            AuthModel.login(o.token,email,3600);
            AuthModel.redirectAfterLogin();
        },
        error: function(o) {
            ValidatorModel.showAlert("Registration failed: " + (o.responseJSON?.error || "Unknown error"));
        }
    });
}
