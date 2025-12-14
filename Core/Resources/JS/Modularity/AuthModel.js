var AuthModel = {

  // single source of truth for the cookie name
  TOKEN_KEY: "authToken",

  /* ===== Cookie helpers ===== */
  getCookie: function (name) {
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
      const [key, value] = cookies[i].split("=");
      if (key === name) {
        return decodeURIComponent(value || "");
      }
    }
    return null;
  },

  setCookie: function (name, value) {
    // SESSION cookie → removed when browser closes
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Lax`;
  },

  deleteCookie: function (name) {
    document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
  },

  /* ===== Auth logic ===== */
  login: function (token) {
    if (!token) return false;
    this.setCookie(this.TOKEN_KEY, token);
    return true;
  },

  logout: function () {
    this.deleteCookie(this.TOKEN_KEY);
  },

  isLoggedIn: function () {
    return !!this.getCookie(this.TOKEN_KEY);
  },

  /* ===== Guards ===== */
  requireLogin: function (redirectUrl = "LoginPage.html") {
    if (!this.isLoggedIn()) {
      const next = encodeURIComponent(window.location.href);
      window.location.replace(`${redirectUrl}?next=${next}`);
      return false;
    }
    return true;
  },

  redirectAfterLogin: function (defaultUrl = "HomePage.html") {
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");
    window.location.href = next ? decodeURIComponent(next) : defaultUrl;
  }
};
