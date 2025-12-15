var AuthModel = {

  TOKEN_KEY: "authToken",

  /* ===================== COOKIE HELPERS ===================== */

  getCookie: function (name) {
    var cookies = document.cookie.split("; ");

    for (var i = 0; i < cookies.length; i++) {
      var parts = cookies[i].split("=");
      var key = parts[0];
      var value = parts[1];

      if (key === name) {
        return decodeURIComponent(value || "");
      }
    }

    return null;
  },

  setCookie: function (name, value, seconds) {
    seconds = Number(seconds);

    if (!seconds || seconds <= 0) {
      return;
    }

    var cookie =
      name + "=" + encodeURIComponent(value) +
      "; path=/; max-age=" + seconds +
      "; SameSite=Lax";

    document.cookie = cookie;
  },

  deleteCookie: function (name) {
    var expired = "Thu, 01 Jan 1970 00:00:00 GMT";

    document.cookie = name + "=; path=/; expires=" + expired;
    document.cookie = name + "=; path=/; expires=" + expired + "; SameSite=Lax";
  },

  /* ===================== AUTH LOGIC ===================== */

  login: function (token, email, seconds) {
    if (!token) {
      return false;
    }

    seconds = Number(seconds);
    if (!seconds || seconds <= 0) {
      seconds = 3600;
    }

    var payload = {
      token: token,
      email: (email || "").trim(),
      exp: Date.now() + seconds * 1000
    };

    // remove old auth cookie first
    this.deleteCookie(this.TOKEN_KEY);

    this.setCookie(
      this.TOKEN_KEY,
      JSON.stringify(payload),
      seconds
    );

    return true;
  },

  logout: function () {
    this.deleteCookie(this.TOKEN_KEY);
    window.location.href = "HomePage.html";
  },

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

  /* ===================== ROUTE GUARDS ===================== */

  requireLogin: function (redirectUrl) {
    if (!redirectUrl) {
      redirectUrl = "LoginPage.html";
    }

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
