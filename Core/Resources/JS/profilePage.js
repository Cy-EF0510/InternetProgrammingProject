$(document).ready(function () {
    HeaderModel.createHeader();
    $("#footer-slot").append(FooterModel.createFooter());
    CartManagement.updateCartBadge();
});