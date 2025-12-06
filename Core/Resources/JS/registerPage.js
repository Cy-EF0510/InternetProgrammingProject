
    const regEmail = /^[\w-]+@[a-z0-9]+\.(com|(co\.)?uk|(qc\.)?ca)$/i;
    const regPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!$_-])[\w!$-]{8,24}$/;   

function checkAll(){
    var name = document.getElementById("name").value
    var email = document.getElementById("email").value
    var pswd = document.getElementById("pass").value
    var confirmPswd = document.getElementById("repass").value

    var emailCheck = regEmail.test(email);
	var pwsdCheck = regPass.test(pswd);

    if(pswd == confirmPswd){
        if(emailCheck && pwsdCheck == true){
            sendData();
        }
    }
    else{
        alert("Passwords do not match!");
    }
}

function sendData() {
	document.getElementsByTagName("form")[0].submit();
}