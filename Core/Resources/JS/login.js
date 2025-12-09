$(document).ready(function(){

    $("#submitBtn").on("click", function () {
    checkAll();
    });

    
});

function requestUsers(email, password){
    var urlUsers = "https://reqres.in/api/login";
    $.ajax({
        method: "POST",
        url: urlUsers,
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            email: email,
            password: password
        }),
        headers: {
            "x-api-key": "reqres_0500eb5af06f494291043eca51a3dae2"
            }
        })
        .done(function(o){
            // Save token (expires in 2 minutes)
            document.cookie = `token=${o.token}; path=/; max-age=120; Secure; SameSite=Lax`;

            //*Testing purpose only
            console.log("LOGIN OK:", o);      // o.token exists if success
            alert("Login successful. Token: " + o.token);
            window.location.href = "/Core/HomePage.html"; 
        })
        .fail(function(jqXHR) {
            //*Testing purpose only
            console.log("LOGIN ERROR:", jqXHR.status, jqXHR.responseText);
            alert("Login failed: " + jqXHR.responseJSON.error);
        });
    }


function checkAll(){
    const regEmail = /^[\w-]+@[a-z0-9]+\.(com|(co\.)?uk|(qc\.)?ca)$/i;
    const regPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!$_-])[\w!$-]{8,24}$/;   

    var email = document.getElementById("email").value
    var pswd = document.getElementById("pass").value
    

    var emailCheck = regEmail.test(email);
	var pwsdCheck = regPass.test(pswd);

    requestUsers(email, pswd);

    //todo: fix validation 
    if(emailCheck && pwsdCheck == true){
        requestUsers(email, pswd);
    }
}