# 🌌 The Rogue Market

**The Rogue Market** is a fully responsive and interactive e-commerce frontend project with modular JavaScript architecture, live search, dynamic category filtering, cart and checkout flows, and a Star Wars–inspired UI. It is a frontend-only simulation that runs entirely in the browser using HTML, CSS, JS, and local product data in JSON/XML formats.

---

## 📑 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Pages](#pages)
- [Architecture](#architecture)
- [Data Sources](#data-sources)
- [Styling](#styling)
- [Troubleshooting](#troubleshooting)
- [Folder Structure](#folder-structure)

---

## 🌐 Overview

The Rogue Market is designed as a demo online shopping site featuring:

- Realistic product catalog
- Live filtering and search
- Cart, checkout, and order confirmation
- Profile system using cookies
- Custom error page and dynamic content

No backend or database required — all content is driven from static files.

---

## ✨ Features

- 🔍 Live product search with suggestion dropdown
- 🛒 Cart system with quantity, subtotal, and localStorage
- 📦 Checkout with tax and payment method validation
- 👤 Profile page with editable avatar and cookie persistence
- 📁 Modular JS structure for clean logic separation
- 🎨 Star Wars–inspired UI with hover effects and animated transitions
- 📂 Dynamic product rendering from category JSONs
- 🌐 XML-powered navigation (via `categories.xml`)
- ❌ 404 error page with theme-appropriate messaging

---

## 🧱 Installation

1. Download or clone this repository into your local machine.
2. Since the project uses AJAX to load JSON and XML data, you **must run it from a local server**.
3. We recommend using **XAMPP** or a similar local server.

### 🔧 To run using XAMPP:
- Move the project folder to `htdocs` inside your XAMPP installation (e.g., `C:/xampp/htdocs/TheRogueMarket`)
- Start **Apache** using the XAMPP Control Panel
- Open your browser and go to:  
  `http://localhost/TheRogueMarket/HomePage.html`

> 🔍 This is required because browsers block file-based AJAX requests (`file://`) due to CORS and security restrictions.

---

## ▶️ Usage

- Start at `HomePage.html`
- Browse featured products or use **Search**
- Add items to cart via listings or product detail pages
- Click **Cart** → Proceed to **Checkout**
- Fill the form (validated), submit, and view **Order Confirmation**
- Visit **Profile Page** to update avatar and user info
- Explore other categories via nav or footer

---

## 📄 Pages

| Page | Description |
|------|-------------|
| `HomePage.html` | Landing page with featured products and hero section |
| `ProductListingPage.html` | Grid of products with category/price sorting |
| `ProductDetailPage.html` | Product details, reviews, add to cart |
| `ShoppingCartPage.html` | Cart items, total, update/remove |
| `CheckoutPage.html` | Shipping/payment form, order placement |
| `OrderConfirmationPage.html` | Summary of last placed order |
| `SearchResultsPage.html` | Infinite scroll and highlighted results |
| `LoginPage.html` | Simulated login using `reqres.in` |
| `RegisterPage.html` | Validated form for account creation |
| `ProfilePage.html` | Edit user avatar and details via cookies |
| `AboutPage.html` | Info about the project and team concept |
| `ErrorPage.html` | Custom 404 with animation |

---

## 🧠 Architecture

- **Modular JS**
  - `AuthModel.js` – Login/logout
  - `CartManagement.js` – Cart control via localStorage
  - `ProductModel.js` – Loads/render products
  - `SearchModel.js`, `SearchUI.js` – Handles search logic
  - `FormValidation.js` – Validates all forms (checkout, login, register)
  - `HeaderModel.js`, `FooterModel.js` – Injects dynamic header/footer

- **Data Persistence**
  - Cart: `cookie`
  - Profile: Cookies
  - Last Order: Cookie (`lastOrder`)

---

## 📊 Data Sources

- `products.json` – Master product list
- Category files:  
  - `Electronics.json`, `Home & Kitchen.json`, etc.
- `reviews.json` and `product-reviews.json` – User reviews
- `categories.xml` – Navigation category loading

All data is loaded via AJAX from `/Data/` directory.

---

## 🎨 Styling

- `base.css` – Global styles, variables, shared layout
- Page-specific CSS files like:
  - `homePage.css`, `checkoutPage.css`, `pdp.css`, `plp.css`, etc.
- Starfield backgrounds, neon hover effects, sci-fi UI
- Fonts: `Orbitron`, `Pathway Gothic One` (Google Fonts)

---

## 🧯 Troubleshooting

| Problem | Solution |
|---------|----------|
| Product list is empty | Ensure `products.json` is reachable (check dev tools) |
| Forms don’t submit | Check validation errors (inspect console) |
| Search doesn’t work | Confirm `SearchModel.js` and JSON paths are correct |
| CORS / file access errors | Use a local server like XAMPP or `python3 -m http.server` |

---

## 📁 Folder Structure

```
📦 /TheRogueMarket
├── *.html
├── /Resources/
│   ├── /CSS/
│   │   ├── base.css
│   │   └── [page].css
│   ├── /JS/
│   │   ├── Modularity/
│   │   │   ├── AuthModel.js, CartManagement.js, ...
│   │   └── [page].js
│   └── /IMG/
│       └── product images, logos, etc.
├── /Data/
│   ├── products.json, reviews.json, product-reviews.json
│   ├── [Category].json (Electronics, Toys, etc.)
│   └── categories.xml
```

---

*This project is frontend-only and provided for learning, demo, and Final Project for Internet Programming*
