var ValidatorModel = {

  /* ===== Rules ===== */
  regEmail: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  regPass: /^cityslicka$/i, // reqres demo password

  /* ===== Utils ===== */
  exists: function (selector) {
    return $(selector).length > 0;
  },

  setError: function ($input, $error, msg) {
    $error.text(msg);
    $input.addClass("input-error");
    return false;
  },

  clearError: function ($input, $error) {
    $error.text("");
    $input.removeClass("input-error");
    return true;
  },

  /* ===== Field Validators ===== */
  validateName: function () {
    if (!this.exists("#name")) return true;

    const $input = $("#name");
    const $error = $("#nameError");
    const value = $input.val().trim();

    if (value === "") {
      return this.setError($input, $error, "Name is required.");
    }
    return this.clearError($input, $error);
  },

  validateEmail: function () {
    if (!this.exists("#email")) return true;

    const $input = $("#email");
    const $error = $("#emailError");
    const value = $input.val().trim();

    if (value === "") {
      return this.setError($input, $error, "Email is required.");
    }
    if (!this.regEmail.test(value)) {
      return this.setError($input, $error, "Please enter a valid email.");
    }
    return this.clearError($input, $error);
  },

  validatePassword: function () {
    if (!this.exists("#pass")) return true;

    const $input = $("#pass");
    const $error = $("#passError");
    const value = $input.val();

    if (value === "") {
        return this.setError($input, $error, "Password is required.");
    }
    if (!this.regPass.test(value)) {
      return this.setError($input, $error, 'Password must be "cityslicka".');
    }
    return this.clearError($input, $error);
  },

  validateRePassword: function () {
    if (!this.exists("#repass")) return true;

    const pass = $("#pass").val();
    const $input = $("#repass");
    const $error = $("#repassError");
    const value = $input.val();

    if (value === "") {
      return this.setError($input, $error, "Re-enter password is required.");
    }
    if (value !== pass) {
      return this.setError($input, $error, "Passwords do not match.");
    }
    return this.clearError($input, $error);
  },


  validatePhone: function () {
  if (!this.exists("#phone")) return true;

  const $input = $("#phone");
  const $error = $("#phoneError");
  const value = $input.val().trim();

  if (value === "") {
    return this.setError($input, $error, "Phone number is required.");
  }

  return this.clearError($input, $error);
},

validateAddress: function () {
  if (!this.exists("#address")) return true;

  const $input = $("#address");
  const $error = $("#addressError");
  const value = $input.val().trim();

  if (value === "") {
    return this.setError($input, $error, "Shipping address is required.");
  }

  return this.clearError($input, $error);
},





  /* ===== Page-Level Checks ===== */
  checkLogin: function () {
    const emailValid = this.validateEmail();
    const passValid = this.validatePassword();

    return emailValid && passValid;
  },


  checkRegister: function () {
    const nameValid = this.validateName();
    const emailValid = this.validateEmail();
    const passValid = this.validatePassword(); 
    const rePassValid = this.validateRePassword();

    return nameValid && emailValid && passValid && rePassValid;
  },


  checkCheckout: function () {
    const nameValid = this.validateName();
    const emailValid = this.validateEmail();
    const phoneValid = this.validatePhone();
    const addressValid = this.validateAddress();

    return nameValid && emailValid && phoneValid && addressValid;
  },


  /* ===== Alerts ===== */
  showAlert: function (msg, type = "error") {
    if (!this.exists("#loginAlert")) return;

    $("#loginAlert")
      .removeClass()
      .addClass(`alert-box alert-${type}`)
      .text(msg)
      .fadeIn();
  },

  clearAlert: function () {
    if (this.exists("#loginAlert")) {
      $("#loginAlert").fadeOut();
    }
  },

  /* ===== Live Binding ===== */
  bindLive: function () {
    const self = this;

    if ($("#name").length) {
      $("#name").on("input", function () { self.validateName(); });
    }
    if ($("#email").length) {
      $("#email").on("input", function () { self.validateEmail(); });
    }
    if ($("#pass").length) {
      $("#pass").on("input", function () { self.validatePassword(); });
    }
    if ($("#repass").length) {
      $("#repass").on("input", function () { self.validateRePassword(); });
    }
    if ($("#phone").length) {
      $("#phone").on("input", function () { self.validatePhone(); });
    }
    if ($("#address").length) {
      $("#address").on("input", function () { self.validateAddress(); });
    }

  }

};
