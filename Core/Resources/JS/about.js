$(document).ready(function () {
    console.log("AuthModel:", typeof AuthModel);
  console.log("HeaderModel:", typeof HeaderModel);
  console.log("FooterModel:", typeof FooterModel);
  console.log("CartManagement:", typeof CartManagement);
  console.log("#footer-slot exists:", $("#footer-slot").length);
    
    HeaderModel.createHeader();
    $("#footer-slot").append(FooterModel.createFooter());
    FooterModel.loadCategories();

    CartManagement.updateCartBadge();
});