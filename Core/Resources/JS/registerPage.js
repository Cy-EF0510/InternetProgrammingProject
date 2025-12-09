$(document).ready(function(){
    $("#submitBtn").on("click", function () {
        checkAll();
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


function checkAll(){
    //*Old regex patterns for email and password validation
    //const regEmail = /^[\w-]+@[a-z0-9]+\.(in|com|(co\.)?uk|(qc\.)?ca)$/i;
    //const regPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!$_-])[\w!$-]{8,24}$/; 
    
    //*To work with reqres.in API 

    /*
    Uses this 
    "username": "eve.holt@reqres.in",
    "email": "eve.holt@reqres.in",
    "password": "cityslicka"
    */ 
    const regEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const regPass = /^cityslicka$/i;
 

    var name = document.getElementById("name").value
    var email = document.getElementById("email").value
    var pswd = document.getElementById("pass").value
    var confirmPswd = document.getElementById("repass").value
    

    var emailCheck = regEmail.test(email);
	var pwsdCheck = regPass.test(pswd);

    //check if passwords match
    if(pswd == confirmPswd){
        console.log("Passwords match.");
        //check if email and password are valid
        if(emailCheck && pwsdCheck == true){
            requestUsers(email, pswd);
        }
        else if(!emailCheck ){
            alert("Invalid email format!");
        }
        else if(!pwsdCheck){
            alert("Invalid password format!");
        }
    }
    else{
        alert("Passwords do not match!");
    }
}

function sendData() {
	document.getElementsByTagName("form")[0].submit();
}