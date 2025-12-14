$(document).ready(function () {

    
    HeaderModel.createHeader();
    $("#footer-slot").append(FooterModel.createFooter());
    FooterModel.loadCategories();

    CartManagement.updateCartBadge();
});