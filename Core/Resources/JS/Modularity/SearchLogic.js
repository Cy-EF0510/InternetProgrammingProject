// // im trying to get the "get all products" method and call it here
// const SearchLogic = {
//     showSuggestions: function(searchStr, containerId = "productList"){
//         if(!this.products || this.products.length === 0){
//             return Promise.rehect("Products not loaded. Call loadAllProducts first.")
//         }

//         const container = $("#" + containerId);
//         container.empty();
        
//         const filtered = this.products.filter(product =>
//             product.name.toLowerCase().includes(searchStr.toLowerCase())
//         );

//         filtered.forEach(product => {
//         const suggestion = $("<div/>")
//             .addClass("search-suggestion")
//             .attr("data-id", product.id)
//             .css("cursor", "pointer")
//             .html(product.name);

//         suggestion.on("click", function() {
//             window.location.href = `ProductDetailPage.html?id=${product.id}`;
//         });

//         container.append(suggestion);
//         });

//         return Promise.resolve(filtered);
//     },

//     // Clear suggestions
//     clearSuggestions: function(containerId = "productList") {
//         $("#" + containerId).empty();
//     },

//     // Get suggestion count
//     getSuggestionCount: function() {
//         return this.products.length;
//     }
// };