$(document).ready(function () {
    HeaderModel.createHeader();
    $("#footer-slot").append(FooterModel.createFooter());
    FooterModel.loadCategories();

    CartManagement.updateCartBadge();

    ValidatorModel.bindLive();

    renderCheckoutSummary();

    $("#checkoutForm").on("submit", function (e) {
        e.preventDefault();

        if (!ValidatorModel.checkCheckout()) return;

        // Fake order placement
        CartManagement.clearCart();
        window.location.href = "orderConfirmation.html";
    });

    $("input[name='delivery']").on("change", function () {
        renderCheckoutSummary();
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

    $("#co-subtotal").text(`$${subtotal.toFixed(2)}`);
    $("#co-tax").text(`$${tax.toFixed(2)}`);
    $("#co-shipping").text(`$${shipping.toFixed(2)}`);
    $("#co-total").text(`$${total.toFixed(2)}`);
    



    

}





