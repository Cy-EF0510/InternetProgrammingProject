$(document).ready(function() {
    renderFooter("#footer", "My Online Store");
});

function renderFooter(selector, storeName = "The ") {

  // Create the footer structure
  const $footer = $(`
    <footer>
      <div class="footer-container"></div>
      <div class="footer-bottom">© 2025 ${storeName}. All rights reserved.</div>
    </footer>
  `);

  const $container = $footer.find(".footer-container");

  // ============================
  // CATEGORY SECTION
  // ============================
  const categories = ["Clothing", "Electronics", "Home", "Accessories"];

  const $cat = $(`
    <div class="footer-section">
      <h3>Categories</h3>
      <ul></ul>
    </div>
  `);

  categories.forEach(cat => {
    $cat.find("ul").append(`<li><a href="#">${cat}</a></li>`);
  });

  // ============================
  // CONTACT INFO
  // ============================
  const $contact = $(`
    <div class="footer-section">
      <h3>Contact</h3>
      <p>Email: support@example.com</p>
      <p>Phone: +1 (514) 555-1234</p>
      <p>Address: 123 Main Street, Montreal</p>
    </div>
  `);

  // ============================
  // NEWSLETTER SIGNUP
  // ============================
  const $newsletter = $(`
    <div class="footer-section">
      <h3>Newsletter</h3>
      <p>Stay updated on deals and new products.</p>
      <div class="newsletter-box">
        <input type="email" id="newsletterEmail" placeholder="Enter your email">
        <button id="newsletterBtn">Sign Up</button>
      </div>
      <p id="newsletterMsg"></p>
    </div>
  `);

  // ============================
  // SOCIAL ICONS
  // ============================
  const $social = $(`
    <div class="footer-section">
      <h3>Follow Us</h3>
      <div class="social-icons">
        <a href="#" aria-label="Instagram"><svg width="24" height="24"><circle cx="12" cy="12" r="10" fill="currentColor"/></svg></a>
        <a href="#" aria-label="Facebook"><svg width="24" height="24"><rect x="4" y="4" width="16" height="16" fill="currentColor"/></svg></a>
        <a href="#" aria-label="Twitter"><svg width="24" height="24"><polygon points="4,20 20,4 20,20" fill="currentColor"/></svg></a>
      </div>
    </div>
  `);

  // Append sections into footer container
  $container.append($cat, $contact, $newsletter, $social);

  // Render into the page
  $(selector).html($footer);
}
