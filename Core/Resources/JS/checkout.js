
let checkoutTotals = {
  subtotal: 0,
  tax: 0,
  shipping: 0,
  total: 0
};


$(document).ready(function () {
    AuthModel.requireLogin();

    HeaderModel.createHeader();
    $("#footer-slot").append(FooterModel.createFooter());
    FooterModel.loadCategories();

    CartManagement.updateCartBadge();

    ValidatorModel.bindLive();

    renderCheckoutSummary();

    $("#checkoutForm").on("submit", function (e) {
        e.preventDefault();

        const paymentMethod = $("input[name='payment']:checked").val();

        const checkoutValid = ValidatorModel.checkCheckout(); // shows shipping errors
        const cardValid = (paymentMethod === "card") ? ValidatorModel.validateCard() : true; // shows card errors

        if (!(checkoutValid && cardValid)) return;


        const orderData = {
            orderNumber: "RM-" + Math.floor(100000 + Math.random() * 900000),
            items: CartManagement.getCart(),
            subtotal: checkoutTotals.subtotal,
            tax: checkoutTotals.tax,
            shipping: checkoutTotals.shipping,
            total: checkoutTotals.total
        };

        // store as cookie (short life)
        document.cookie =
        "lastOrder=" + encodeURIComponent(JSON.stringify(orderData)) +
        "; path=/; max-age=300"; // 5 minutes


        // Fake order placement
        CartManagement.clearCart();
        window.location.href = "OrderConfirmationPage.html";
    });

    $("input[name='delivery']").on("change", function () {
        renderCheckoutSummary();
    });


    $("input[name='payment']").on("change", function () {
        const method = $("input[name='payment']:checked").val();

        if (method === "paypal") {
            $(".card-fields").addClass("hidden");
            $(".paypal-message").removeClass("hidden");
        } else {
            $(".card-fields").removeClass("hidden");
            $(".paypal-message").addClass("hidden");
        }
    });



});


const TaxRate = 0.15;
const ShippingPrices = {
    standard: 0,
    express: 9.99
};




function renderCheckoutSummary() {
    const cart = CartManagement.getCart();
    const $items = $("#checkout-items");
    $items.empty();

    let subtotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;

        $items.append(`
            <div class="summary-item">
            ${item.name} × ${item.qty}
            <span>$${itemTotal.toFixed(2)}</span>
            </div>
        `);
    });
    

    const deliveryType = $("input[name='delivery']:checked").val();
    const shipping = ShippingPrices[deliveryType];

    const tax = subtotal * TaxRate;
    const total = subtotal + tax + shipping;

    checkoutTotals.subtotal = subtotal;
    checkoutTotals.tax = tax;
    checkoutTotals.shipping = shipping;
    checkoutTotals.total = total;

    $("#co-subtotal").text(`$${subtotal.toFixed(2)}`);
    $("#co-tax").text(`$${tax.toFixed(2)}`);
    $("#co-shipping").text(`$${shipping.toFixed(2)}`);
    $("#co-total").text(`$${total.toFixed(2)}`);




    

}





