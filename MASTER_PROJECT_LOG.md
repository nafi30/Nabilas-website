# 💎 Namira Nabila Creations - Master Project Log

This file is the "Source of Truth" for the project. It tracks the architecture, configuration, and progress to ensure consistency as the project grows.

---

## 🏗️ Technical Stack
- **Frontend:** React.js + Vite
- **Styling:** Vanilla CSS (Modern CSS Variables + Glassmorphism)
- **Icons:** Lucide React
- **Authentication:** Appwrite Cloud (NYC Region)
- **State Management:** React Context API (Theme, Cart, Wishlist, Auth)

---

## 🎨 Design System (Premium Black Vibe)
- **Primary Palette:** 
  - Main: `#0A0A0A` (Deep Black)
  - Hover: `#1A1A1A`
  - Accent: `#EC4899` (Soft Pink)
- **Theme:** Supports Light/Dark mode via `ThemeProvider`.
- **Mobile:** Optimized for touch; 2-column grids on mobile; 100% responsive header and cart.

---

## 🔐 Appwrite Configuration
- **Endpoint:** `https://nyc.cloud.appwrite.io/v1`
- **Project ID:** `69fe4c6a0019eae0e7fd`
- **Database ID:** `69fe56910001e5b55820`
- **Profiles Collection ID:** `profiles`
- **Products Collection ID:** `products`
- **Orders Collection ID:** `orders`
- **Storage Bucket ID:** `product_images`
- **Status:** All 3 tables live. Auth, Profiles, Products, and Orders connected.

---

## 📂 Project Structure
- `src/auth/`: AuthContext and Session management.
- `src/components/`: Reusable UI elements (Header, Footer, Product Cards).
- `src/context/`: Global states for Theme, Cart, and Wishlist.
- `src/pages/`: 
  - `Home`: Hero, Categories, Flash Sale.
  - `Products`: Grid/List view with filters.
  - `Auth`: Integrated Login/Register page.
  - `Account`: User Dashboard (Orders, Favorites, Settings).
- `src/lib/`: Service initializations (appwrite.js).

---

## ✅ Completed Milestones
1. **[Phase 1]** Base UI & Branding (Namira Nabila Creations).
2. **[Phase 2]** Premium Black Theme implementation (Replaced Purple).
3. **[Phase 3]** Full Mobile Optimization audit and fixes.
4. **[Phase 4]** Appwrite Authentication integration (Login/Register live).
5. **[Phase 5]** Mock Dashboard UI for Account, Orders, and Favorites.
6. **[Phase 6]** Real User Profiles — Shipping info saves to Appwrite Database. ✅
7. **[Phase 7]** Products migrated to Appwrite Database. ✅
8. **[Phase 8]** Real Checkout — Orders save to Appwrite. ✅

---

## 🔜 Next Steps
1. **Admin Dashboard:** Separate project for product management.
2. **Payment Gateway:** Integrate real payment processing.
