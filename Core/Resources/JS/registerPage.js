$(document).ready(function(){
    $("#submitBtn").on("click", function () {
        checkAll();
    });

    // live validation while typing
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
            console.log("Success:", o.token);
            // Save token to cookie
            document.cookie = `token=${o.token}; path=/; max-age=120`;
            alert("Registration successful. Token: " + o.token);
            window.location.href = "/Core/LoginPage.html"; 
        },
        error: function(o) {
            console.log("Error:", o.responseJSON.error);
            alert("Registration failed: " + o.responseJSON.error);
        }
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

// ---------- FINAL CHECK ON SUBMIT (KEEPS YOUR LOGIC) ----------
function checkAll() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const pswd = document.getElementById("pass").value;
    const confirmPswd = document.getElementById("repass").value;

    const emailCheck = regEmail.test(email);
    const pwsdCheck = regPass.test(pswd);

    // run live validators one more time to update messages
    validateEmailField();
    validatePasswordField();
    validateRePasswordField();

    // if (pswd === confirmPswd) {
    //     console.log("Passwords match.");
    //     if (emailCheck && pwsdCheck) {
    //         requestUsers(email, pswd);
    //     } else if (!emailCheck) {
    //         alert("Invalid email format!");
    //     } else if (!pwsdCheck) {
    //         alert("Invalid password format!");
    //     }
    // } else {
    //     alert("Passwords do not match!");
    // }
}
