$(document).ready(function(){
    $("#submitBtn").on("click", function () {
        checkAll();
    });

    // live validation while typing
    $("#name").on("input", validateNameField);
    $("#email").on("input", validateEmailField);
    $("#pass").on("input", validatePasswordField);
    $("#repass").on("input", validateRePasswordField);
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
            console.log("Error:", o.responseJSON.error);
            alert("Registration failed: " + o.responseJSON.error);
        }
    });
}

const regEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const regPass = /^cityslicka$/i;


function validateNameField() {
    const name = $("#name").val().trim();

    if (name === "") {
        $("#nameError").text("Name is required.");
        $("#name").addClass("input-error");
        return false;
    }
    else {
        $("#nameError").text("");
        $("#name").removeClass("input-error");
        return true;
    }
}

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
    const ok = regPass.test(pswd);   // must be "cityslicka" for this API

    if (pswd === "") {
        $("#passError").text("Password is required.");
        $("#pass").addClass("input-error");
        return false;
    } else if (!ok) {
        $("#passError").text('For this demo, password must be "cityslicka".');
        $("#pass").addClass("input-error");
        return false;
    } else {
        $("#passError").text("");
        $("#pass").removeClass("input-error");
        return true;
    }
}

function validateRePasswordField() {
    const pswd = $("#pass").val();
    const confirmPswd = $("#repass").val();

    if (confirmPswd === "") {
        $("#repassError").text("Re-Enter Password is required");
        $("#repass").addClass("input-error");
        return false;
    } else if (pswd !== confirmPswd) {
        $("#repassError").text("Passwords do not match.");
        $("#repass").addClass("input-error");
        return false;
    } else {
        $("#repassError").text("");
        $("#repass").removeClass("input-error");
        return true;
    }
}


function checkAll() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const pswd = document.getElementById("pass").value;
    const confirmPswd = document.getElementById("repass").value;

    const emailCheck = regEmail.test(email);
    const pwsdCheck = regPass.test(pswd);

    // run live validators one more time to update messages
    validateNameField();
    validateEmailField();
    validatePasswordField();
    validateRePasswordField();

    if (pswd === confirmPswd) {
        if (emailCheck && pwsdCheck) {
            alert("All fields are valid. Proceeding to registration...");
            requestUsers(email, pswd);
        }
    }
}
