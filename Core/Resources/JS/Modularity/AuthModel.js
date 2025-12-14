var AuthModel = {
  TOKEN_KEY: "authToken",

  /* ===================== COOKIE HELPERS  ===================== */
  getCookie: function (name) {
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
      const parts = cookies[i].split("=");
      if (parts[0] === name) {
        return decodeURIComponent(parts[1] || "");
      }
    }
    return null;
  },

  setCookie: function (name, value, seconds) {
    seconds = Number(seconds);
    if (!Number.isFinite(seconds) || seconds <= 0) return;

    document.cookie =
      `${name}=${encodeURIComponent(value)}; path=/; max-age=${seconds}; SameSite=Lax`;
  },

  deleteCookie: function (name) {
    const exp = "Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = `${name}=; path=/; expires=${exp}; SameSite=Lax`;
    document.cookie = `${name}=; path=/; expires=${exp}`;
    document.cookie = `${name}=; path=/; expires=${exp}; SameSite=Lax; Secure`;
  },

  /* ===================== AUTH LOGIC ===================== */
  login: function (token, email, seconds) {
    if (!token) return false;

    seconds = Number(seconds);
    if (!Number.isFinite(seconds) || seconds <= 0) seconds = 3600;

    const payload = {
      token: token,
      email: (email || "").trim(),
      exp: Date.now() + seconds * 1000
    };

    // clear any old cookie first
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
  },

  getAuth: function () {
    const raw = this.getCookie(this.TOKEN_KEY);
    if (!raw) return null;

    try {
      const data = JSON.parse(raw);

      // expired
      if (data.exp && Date.now() > data.exp) {
        this.logout();
        return null;
      }

      return data.token ? data : null;
    } catch {
      return null;
    }
  },

  isLoggedIn: function () {
    return this.getAuth() !== null;
  },

  /* ===================== ROUTE GUARDS  ===================== */
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
