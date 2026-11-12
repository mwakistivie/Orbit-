ORBIT E-COMMERCE — FRONTEND PROTOTYPE
=====================================

FILES
- index.html       Main storefront structure
- style.css        Responsive visual styling
- script.js        Product filtering, wishlist, cart, quick view and demo checkout
- assets/maeve-logo.svg  Footer credit mark

RUN
1. Open index.html in a modern browser.
2. For local development, you may use VS Code Live Server.

FEATURES
- Responsive storefront and mobile navigation
- Product categories, search and sorting
- Product quick-view modal
- Wishlist interactions
- Shopping bag with quantity controls and subtotal
- Checkout form with demo order confirmation
- Newsletter interaction
- Local storage for cart and wishlist

IMPORTANT IMPLEMENTATION NOTES
- Product data is sample/demo data in script.js.
- Checkout is a frontend demonstration only. It does not create a real order,
  collect payment, or connect to a backend.
- Before production, implement server-side product/price validation, inventory,
  authentication, order persistence, secure payment initiation and verified
  payment callbacks (including idempotency and reconciliation).
- Do not store payment credentials or trust totals calculated only in the browser.


