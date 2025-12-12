$(document).ready(function(){
    $("#submitBtn").on("click", function () {
        checkAll();
    });

    // live validation while typing 
    $("#email").on("input", function () {
        validateEmailField();
    });

    $("#pass").on("input", function () {
        validatePasswordField();
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
        .fail(function(o) {
            //*Testing purpose only
            console.log("LOGIN ERROR:", o.status, o.responseText);
            alert("Login failed: " + o.responseJSON.error);
        });
    }


const regEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const regPass = /^cityslicka$/i;

function validateEmailField() {
    const email = $("#email").val().trim();
    const ok = regEmail.test(email);

    if (email === "") {
        $("#emailError").text("Email is required.");
        $("#email").addClass("input-error");
        return false;
    } else if (!ok) {
        $("#emailError").text("Please enter a valid email.");
        $("#email").addClass("input-error");
        return false;
    } else {
        $("#emailError").text("");
        $("#email").removeClass("input-error");
        return true;
    }
}

function validatePasswordField() {
    const pswd = $("#pass").val();
    const ok = regPass.test(pswd); // "cityslicka"

    if (pswd === "") {
        $("#passError").text("Password is required.");
        $("#pass").addClass("input-error");
        return false;
    } else if (!ok) {
        $("#passError").text('Password must be "cityslicka".');
        $("#pass").addClass("input-error");
        return false;
    } else {
        $("#passError").text("");
        $("#pass").removeClass("input-error");
        return true;
    }
}

function checkAll() {
    const emailValid = validateEmailField();
    const passValid  = validatePasswordField();

    if (emailValid && passValid) {
        requestUsers($("#email").val().trim(), $("#pass").val());
    }
}
