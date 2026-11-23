# PizzaHub — Pizza Ordering & Delivery Platform (Client)

PizzaHub is a pizza ordering and delivery platform. Customers discover local pizza shops, browse their menus, and place food orders. Restaurants (vendors) create profiles, publish menu items, and manage incoming orders. Admins manage users, review published menu items, and monitor platform transactions.

## Important Features
- Role-based authentication (Customer, Vendor, Admin) with Better Auth + Google OAuth
- Browse, search, filter and sort menu items; item details with image gallery
- Cart and checkout with cash on delivery
- Customer dashboard with order tracking and cancellation
- Vendor dashboard with menu management (CRUD), order accept/reject, subscription upgrade
- Admin dashboard with user management, menu approval, orders and transactions
- Premium vendor subscriptions via Stripe Checkout + verified webhooks
- ImgBB image uploads for menu items
- Favorites / wishlist and order status timeline
- Framer Motion animations on the home page

## Tech Stack
- Next.js 16 (App Router), React 19, Tailwind CSS 4
- Better Auth (MongoDB adapter, JWT plugin, Google OAuth)
- Axios, Sonner (toast), Recharts, Motion, Lucide React, ShadCN UI

## Installation
```bash
npm install
cp .env.example .env.local
# fill in the values
```

## Run Locally
```bash
npm run dev
```
Open http://localhost:3000

## Environment Variables
See `.env.example`: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_URL`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `MONGODB_URI`, `DB_NAME`.

## Repository Links
- Client: https://github.com/rafiul-islam-dev/pizzahub-client
- Server: https://github.com/rafiul-islam-dev/pizzahub-server

## Live Website
<your-live-client-url>

## Advanced Search / Sorting (Challenge)
Browse Menu filters by name, category and location on the client, and the `/api/menu` endpoint accepts `search`, `category`, `location` and `sort` (`price-low`, `price-high`, `name`) query parameters. See `src/components/menu/BrowseMenu.jsx` and `pizzahub-server/src/routes/menu.routes.js`.

## JWT / Token Verification (Challenge)
The Express backend verifies the Better Auth JWT using `jose` (`createRemoteJWKSet` + `jwtVerify`) with issuer/audience checks, then loads the user from MongoDB and attaches `req.user`. Role-based middleware (`authorizeRoles`) enforces per-route access and verifies resource ownership. See `src/middleware/auth.middleware.js` and `src/middleware/role.middleware.js`.