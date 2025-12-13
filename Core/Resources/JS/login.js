$(document).ready(function(){
    $("#email").on("input", function () {
        ValidatorModel.validateEmail();
    });

    $("#pass").on("input", function () {
        ValidatorModel.validatePassword();
    });

    $("#submitBtn").on("click", function () {
        if (ValidatorModel.checkLogin()) {
            requestUsers($("#email").val().trim(), $("#pass").val());
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
            console.log(o);
            // Save token (expires in 2 minutes)
            document.cookie = `token=${o.token}; path=/; max-age=120; SameSite=Lax`;
            window.location.href = "/Core/HomePage.html"; 
        })
        .fail(function (o) {
            ValidatorModel.showAlert(
                "Login failed: " + (o.responseJSON?.error || "Unknown error")
            );
        });

    }

