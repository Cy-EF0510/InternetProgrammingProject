var AuthModel = {

  TOKEN_KEY: "authToken",

  //cookies helpers


  //get cookie by name, and returns the value if found and null if not
  getCookie: function (name) {
    //split all the cookies into an array
    var cookies = document.cookie.split("; ");

    for (var i = 0; i < cookies.length; i++) {
      var parts = cookies[i].split("=");
      var key = parts[0];
      var value = parts[1];

      //if cookie name mathces return its value
      if (key === name) {
        return decodeURIComponent(value || "");
      }
    }

    return null;
  },

  //creates a cookie with expiry time
  setCookie: function (name, value, seconds) {
    seconds = Number(seconds);

    if (!seconds || seconds <= 0) {
      return;
    }

    //build the cookie string
    var cookie =
      name + "=" + encodeURIComponent(value) +
      "; path=/; max-age=" + seconds +
      "; SameSite=Lax";
    
      //savve the cookie
    document.cookie = cookie;
  },


  
  //delets a cookie 

  deleteCookie: function (name) {
    var expired = "Thu, 01 Jan 1970 00:00:00 GMT";

    document.cookie = name + "=; path=/; expires=" + expired;
    document.cookie = name + "=; path=/; expires=" + expired + "; SameSite=Lax";
  },

  
  //authencation logic

  //save login info in cookie
  login: function (token, email, seconds) {
    if (!token) {
      return false;
    }

    seconds = Number(seconds);

    //default login time is 1 hour
    if (!seconds || seconds <= 0) {
      seconds = 3600;
    }

    //data to store in the cookie

    var payload = {
      token: token,
      email: (email || "").trim(),
      exp: Date.now() + seconds * 1000
    };

    // remove old auth cookie first
    this.deleteCookie(this.TOKEN_KEY);

    //save new logoin cookie
    this.setCookie(
      this.TOKEN_KEY,
      JSON.stringify(payload),
      seconds
    );

    return true;
  },


  //logs user our by deleting the auth cookie and bringing them to homepage
  logout: function () {
    this.deleteCookie(this.TOKEN_KEY);
    window.location.href = "HomePage.html";
  },


  //validates the auth cookie
  getAuth: function () {
    var raw = this.getCookie(this.TOKEN_KEY);

    if (!raw) {
      return null;
    }

    try {
      var data = JSON.parse(raw);

      // check expiration
      if (data.exp && Date.now() > data.exp) {
        this.logout();
        return null;
      }

      if (data.token) {
        return data;
      }

      return null;

    } catch (e) {
      return null;
    }
  },

  isLoggedIn: function () {
    return this.getAuth() !== null;
  },

 
  
  //forces user to be logged in to access certain pages

  requireLogin: function (redirectUrl) {
    if (!redirectUrl) {
      redirectUrl = "LoginPage.html";
    }

    //if not logged in bring back to login page
    if (!this.isLoggedIn()) {
      var next =
        encodeURIComponent(
          window.location.pathname + window.location.search
        );

      window.location.replace(
        redirectUrl + "?next=" + next
      );

      return false;
    }

    return true;
  },


  //sends the user back to the page they were trying to access after login
  redirectAfterLogin: function (defaultUrl) {
    if (!defaultUrl) {
      defaultUrl = "HomePage.html";
    }

    var params = new URLSearchParams(window.location.search);
    var next = params.get("next");

    if (next && next.indexOf("/") === 0) {
      window.location.replace(next);
    } else {
      window.location.replace(defaultUrl);
    }
  },


  //keeps the next parameter when switching between pages
  forwardNextParam: function (linkSelector, targetPage) {
    var params = new URLSearchParams(window.location.search);
    var next = params.get("next");

    if (next) {
      $(linkSelector).attr(
        "href",
        targetPage + "?next=" + encodeURIComponent(next)
      );
    }
  }
};
