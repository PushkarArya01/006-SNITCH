# SNITCH — Modern E-Commerce Frontend (React.js + Tailwind CSS)

A high-fidelity recreation of **[Snitch](https://www.snitch.com/)**, engineered with modern **React.js**, **Tailwind CSS**, **Vite**, **React Router v6**, and **Axios**. Built to plug-and-play with the Cohort-3 backend (`0006-snitch`).

---

## 🌟 Key Features

- **Iconic Snitch Aesthetic:** Pitch black & white high-contrast editorial look, typography, animated announcement ticker, and responsive layouts.
- **Top Announcement Bar:** Auto-rotating promotional marquee (Free shipping above ₹999, coupon alerts).
- **Sticky Navigation Bar:** Real-time search modal, dynamic wishlist counter, slide-over bag badge, and authentication status.
- **Live Search Modal:** Debounced real-time product search with trending suggestion chips.
- **Interactive Product Catalog:**
  - Aspect ratio cards with 2nd-image hover reveal
  - One-click **Quick Size Add** overlay (`S`, `M`, `L`, `XL`, `XXL`)
  - Wishlist heart toggle with instant local persistence
  - Filter by category (Shirts, Oversized, Bottoms, Co-ords, Fragrances)
  - Sorting (Price Low-to-High, High-to-Low, Rating, Newest)
- **Product Details Page (PDP):**
  - Multi-angle image gallery with thumbnail navigation
  - Size selection with interactive **Size Guide Modal**
  - Live Indian 6-digit Pincode delivery estimator
  - Expandable accordions for Fabric Specifications, Wash Care, and 7-day Return policy
  - "You May Also Like" recommendation strip
- **Slide-Over Cart Drawer:**
  - Dynamic Free Delivery progress indicator bar
  - Quantity controls (`+` / `-` / remove)
  - Real-time coupon engine (`SNITCH10`, `FLAT200`, `COHORT3`)
  - Subtotal, discounts, shipping, and grand total calculations
- **Checkout Flow:** Complete shipping address capture, payment mode selection (UPI, Cards, COD), and order confirmation receipt generation.
- **User Dashboard & Auth:** Login/Register tabbed modal with instant "Quick Demo Login" and order history tracker.
- **Hybrid API & Mock Architecture:** Connects to your backend when online, and seamlessly falls back to realistic Snitch catalog mock data if your backend is offline!

---

## 📁 Clean Folder Structure

```
snitch-frontend/
├── .env                       # Backend endpoint configuration (VITE_API_BASE_URL)
├── .env.example
├── index.html                 # HTML shell with Snitch branding & metadata
├── package.json               # Dependencies and build scripts
├── vite.config.js             # Vite + Tailwind CSS plugin config
└── src/
    ├── api/                   # Centralized API layer connecting to Cohort-3 backend
    │   ├── client.js          # Axios client with JWT interceptor & error handling
    │   ├── authApi.js         # /api/auth (login, register, profile)
    │   ├── productApi.js      # /api/products, /api/products/:id, /api/products/trending
    │   ├── cartApi.js         # /api/cart operations
    │   └── orderApi.js        # /api/orders (create order, my-orders)
    ├── components/
    │   ├── auth/              # AuthModal (Sign In / Register tabs)
    │   ├── cart/              # CartDrawer (Slide-over panel, price breakdown)
    │   ├── common/            # SearchModal (Live search with debouncing)
    │   ├── layout/            # TopBanner, Navbar, Footer
    │   └── product/           # ProductCard (Image hover flip, quick size add)
    ├── context/               # React Context state management
    │   ├── AuthContext.jsx    # User session, login, logout, modal controls
    │   ├── CartContext.jsx    # Cart items, drawer open/close, coupons, totals
    │   └── WishlistContext.jsx# Saved wishlist items with localStorage persistence
    ├── data/
    │   └── mockProducts.js    # Rich Snitch fashion catalog with high-res images
    ├── hooks/
    │   ├── useDebounce.js     # Custom hook for search delay
    │   └── useProducts.js     # Product fetch and filter lifecycle hook
    ├── pages/
    │   ├── HomePage.jsx       # Hero banner, category grid, viral drops, editorial
    │   ├── ShopPage.jsx       # Catalog with category pills & sorting
    │   ├── ProductDetailPage.jsx # PDP with gallery, size selector, pincode check
    │   ├── WishlistPage.jsx   # Saved items & quick "Move to Bag"
    │   ├── CheckoutPage.jsx   # Address form, payment selector & order confirmation
    │   └── AccountPage.jsx    # User orders history and profile
    ├── routes/
    │   └── AppRoutes.jsx      # React Router routes mapping
    ├── utils/
    │   ├── constants.js       # Categories, navigation links, coupon codes
    │   └── formatCurrency.js  # Indian Rupee (₹) formatting and discount calculations
    ├── App.jsx                # Layout root with providers and modals
    ├── index.css              # Tailwind CSS styles & typography resets
    └── main.jsx               # Application entry point
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd snitch-frontend
npm install
```

### 2. Configure Backend URL
Open `.env` and set your backend API URL (default is `http://localhost:5000/api`):
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_ENABLE_MOCK_FALLBACK=true
```

### 3. Run Development Server
```bash
npm run dev
```

The application will start at `http://localhost:5173`.

---

## 🔌 Connecting with your `0006-snitch` Backend

Your backend endpoints are already mapped in `src/api/`:

| Feature | HTTP Method | Endpoint | Fallback Behavior |
| :--- | :--- | :--- | :--- |
| **All Products** | `GET` | `/products` | Serves realistic Snitch catalog |
| **Product Detail** | `GET` | `/products/:id` | Looks up item in catalog |
| **Trending Drops** | `GET` | `/products/trending`| Filters `TRENDING` / `BESTSELLER` |
| **User Login** | `POST` | `/auth/login` | Mock JWT session with demo user |
| **Register** | `POST` | `/auth/register` | Saves user session to storage |
| **Create Order** | `POST` | `/orders` | Saves order to local order history |
| **User Orders** | `GET` | `/orders/my-orders` | Returns saved orders list |

> **Pro Tip:** When your backend is running, the frontend will automatically use live database data. If your backend is stopped, the frontend continues to work with mock data so you can test any page or checkout interaction without interruption.
