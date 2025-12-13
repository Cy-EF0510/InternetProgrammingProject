$(document).ready(function(){
    ValidatorModel.bindLive();

    $("#submitBtn").on("click", function () {
        if (ValidatorModel.checkRegister()) {
            requestUsers($("#email").val().trim(), $("#pass").val());
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

            console.log("Registration response:", o);

            const auth = { id: o.id, token: o.token };

            document.cookie = "auth=" + JSON.stringify(auth) + "; path=/; max-age=120";

            console.log(document.cookie);
            
            window.location.href = "/Core/HomePage.html"; 
        },
        error: function(o) {
            ValidatorModel.showAlert();
            console.log("Error:", o.responseJSON.error);
            alert("Registration failed: " + o.responseJSON.error);
        }
    });
}
