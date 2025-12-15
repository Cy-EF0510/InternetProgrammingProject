var ValidatorModel = {

  //Regex checkings for email and password
  regEmail: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  redEmail2: /^[\w-]+@[a-z0-9]+\.(com|(co\.)?uk|(qc\.)?ca|net)$/i,

  regPass: /^cityslicka$/i, // reqres demo password
  redPass2: /^(?=\S{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).*$/,



  //helper functions

  //check if element exists
  exists: function (selector) {
    return $(selector).length > 0;
  },

  //set and display an error message

  setError: function (input, error, msg) {
    error.text(msg);
    input.addClass("input-error");
    return false;
  },


  //clear error message
  clearError: function (input, error) {
    error.text("");
    input.removeClass("input-error");
    return true;
  },


  //functions to validate the fields

  //validate name
  validateName: function () {
    if (!this.exists("#name")) {
      return true;
    }

    var input = $("#name");
    var error = $("#nameError");
    var value = input.val().trim();

    if (value === "") {
      return this.setError(input, error, "Name is required.");
    }

    return this.clearError(input, error);
  },


  //validate email
  validateEmail: function () {
    if (!this.exists("#email")) {
      return true;
    }

    var input = $("#email");
    var error = $("#emailError");
    var value = input.val().trim();

    if (value === "") {
      return this.setError(input, error, "Email is required.");
    }

    if (!this.regEmail.test(value)) {
      return this.setError(input, error, "Please enter a valid email.");
    }

    return this.clearError(input, error);
  },

  //validate password
  validatePassword: function () {
    if (!this.exists("#pass")) {
      return true;
    }

    var input = $("#pass");
    var error = $("#passError");
    var value = input.val();

    if (value === "") {
      return this.setError(input, error, "Password is required.");
    }

    if (!this.regPass.test(value)) {
      return this.setError(
        input,
        error,
        "Password must be At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special (cityslicka)."
      );
    }

    return this.clearError(input, error);
  },


  //validate re-entered password
  validateRePassword: function () {
    if (!this.exists("#repass")) {
      return true;
    }

    var pass = $("#pass").val();
    var input = $("#repass");
    var error = $("#repassError");
    var value = input.val();

    if (value === "") {
      return this.setError(input, error, "Re-enter password is required.");
    }

    if (value !== pass) {
      return this.setError(input, error, "Passwords do not match.");
    }

    return this.clearError(input, error);
  },


  //validate phone number
  validatePhone: function () {
    if (!this.exists("#phone")) {
      return true;
    }

    var input = $("#phone");
    var error = $("#phoneError");
    var value = input.val().trim();

    if (value === "") {
      return this.setError(input, error, "Phone number is required.");
    }

    return this.clearError(input, error);
  },


  //validate address
  validateAddress: function () {
    if (!this.exists("#address")) {
      return true;
    }

    var input = $("#address");
    var error = $("#addressError");
    var value = input.val().trim();

    if (value === "") {
      return this.setError(input, error, "Shipping address is required.");
    }

    return this.clearError(input, error);
  },


  //validate card info
  validateCard: function () {
    // if PayPal checked, skip card validation
    var payment = $("input[name='payment']:checked").val();
    if (payment === "paypal") {
      return true;
    }

    var valid = true;

    //card number validation
    var card = $("#cardNumber");
    var cardError = $("#cardNumberError");
    var cardVal = card.val().replace(/\s+/g, "");

    if (!/^\d{16}$/.test(cardVal)) {
      this.setError(card, cardError, "Card number must be 16 digits.");
      valid = false;
    } else {
      this.clearError(card, cardError);
    }

    //expiry date validation
    var expiry = $("#cardExpiry");
    var expiryError = $("#cardExpiryError");
    var expiryVal = expiry.val();

    if (!/^\d{2}\/\d{2}$/.test(expiryVal)) {
      this.setError(expiry, expiryError, "Expiry must be MM/YY.");
      valid = false;
    } else {
      this.clearError(expiry, expiryError);
    }

    //CVV validation
    var cvv = $("#cardCvv");
    var cvvError = $("#cardCvvError");
    var cvvVal = cvv.val();

    if (!/^\d{3}$/.test(cvvVal)) {
      this.setError(cvv, cvvError, "CVV must be 3 digits.");
      valid = false;
    } else {
      this.clearError(cvv, cvvError);
    }

    return valid;
  },




  //page level validation checks

  //validate login form
  checkLogin: function () {
    var emailValid = this.validateEmail();
    var passValid = this.validatePassword();

    return emailValid && passValid;
  },

  //validate registration form
  checkRegister: function () {
    var nameValid = this.validateName();
    var emailValid = this.validateEmail();
    var passValid = this.validatePassword();
    var rePassValid = this.validateRePassword();

    return nameValid && emailValid && passValid && rePassValid;
  },


  //validate checkout form
  checkCheckout: function () {
    var nameValid = this.validateName();
    var emailValid = this.validateEmail();
    var phoneValid = this.validatePhone();
    var addressValid = this.validateAddress();

    return nameValid && emailValid && phoneValid && addressValid;
  },


  //alert helpers


  //show alert message
  showAlert: function (msg, type) {
    if (type === undefined || type === null) {
      type = "error";
    }

    if (!this.exists("#loginAlert")) {
      return;
    }

    var box = $("#loginAlert");
    box.removeClass();
    box.addClass("alert-box alert-" + type);
    box.text(msg);
    box.fadeIn();
  },


  //clear alert message
  clearAlert: function () {
    if (this.exists("#loginAlert")) {
      $("#loginAlert").fadeOut();
    }
  },


  
  //live validation bindings

  //live validation while typing
  bindLive: function () {
    var self = this;

    if ($("#name").length) {
      $("#name").on("input", function () {
        self.validateName();
      });
    }

    if ($("#email").length) {
      $("#email").on("input", function () {
        self.validateEmail();
      });
    }

    if ($("#pass").length) {
      $("#pass").on("input", function () {
        self.validatePassword();
      });
    }

    if ($("#repass").length) {
      $("#repass").on("input", function () {
        self.validateRePassword();
      });
    }

    if ($("#phone").length) {
      $("#phone").on("input", function () {
        self.validatePhone();
      });
    }

    if ($("#address").length) {
      $("#address").on("input", function () {
        self.validateAddress();
      });
    }

    if ($("#cardNumber").length) {
      $("#cardNumber").on("input", function () {
        self.validateCard();
      });
    }

    if ($("#cardExpiry").length) {
      $("#cardExpiry").on("input", function () {
        self.validateCard();
      });
    }

    if ($("#cardCvv").length) {
      $("#cardCvv").on("input", function () {
        self.validateCard();
      });
    }
  }
};
