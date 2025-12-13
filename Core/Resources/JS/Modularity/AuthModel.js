var AuthModel = {

  token: "auth_user", // change name if you want (token, session, etc.)

  login: function (user) {
    // user example: { id, name, email }
    localStorage.setItem(this.token, JSON.stringify(user || {}));
    window.dispatchEvent(new Event("auth:changed"));
  },

  logout: function () {
    localStorage.removeItem(this.token);
    window.dispatchEvent(new Event("auth:changed"));
  },

  getUser: function () {
  return localStorage.getItem(this.token);
}
,

  isLoggedIn: function () {
    return !!this.getUser();
  },

  // use this on protected pages
  requireLogin: function (redirectTo) {
    redirectTo = redirectTo || "LoginPage.html";

    if (!this.isLoggedIn()) {
      window.location.href = redirectTo;
      return false;
    }
    return true;
  }
};
