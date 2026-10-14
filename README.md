# BakeFlow 🎂✨
> **All-in-One Home Bakery Management Platform & Online Storefront**

BakeFlow is a modern, responsive web application designed for independent home bakers, cake artists, cupcake businesses, and artisan dessert studios. It eliminates the chaos of juggling WhatsApp chats, manual paper notebooks, and spreadsheets by uniting daily kitchen management and a customer-facing online storefront in one single platform.

---

## 🌟 Key Features

### 👩‍🍳 1. Baker Admin Dashboard
- **Real-Time KPIs**: Track today's orders, pending confirmations, items in preparation, pickup queues, overdue payments, and monthly revenue.
- **Kitchen Schedule**: Visual hourly calendar of baking, decorating, and delivery deadlines.
- **Interactive Kanban Pipeline**: 6-stage production board (*To Prepare → Baking → Cooling → Decorating → Packaging → Ready*) with daily capacity indicators.
- **Production Calendar & Daily Prep Checklist**: Schedule upcoming orders and check off preparation tasks.
- **Product & Variant Catalog**: Configure flavors, sizes (0.5kg, 1kg, 2kg, bento), eggless options, ingredient costs, and selling prices with profit margin tracking.
- **Recipe Manager & Scaler**: Scale batches from 0.5× to 3× in real time with automatic ingredient recalculation and cost per serving.
- **Cake Cost Calculator**: Calculate precise pricing based on raw materials, packaging, labor hours, hourly rate, and target margins.
- **Ingredient Inventory & Smart Shopping List**: Minimum threshold alerts, expiry tracking, and an automated restock list generator with one-click copy for WhatsApp supplier ordering.
- **Customer CRM**: Store customer preferences, dietary restrictions, birthdays, lifetime spend, order history, and VIP tags.
- **Financial Ledger & GST Invoices**: Record payments (UPI, Cash, Bank Transfer), download printable tax invoices, and track business expenses by category.
- **Financial Analytics**: 6-month revenue vs expense trends and bestselling items breakdown powered by Recharts.
- **Delivery & Pickup Logistics**: Manage pickup time slots and Bangalore delivery zones with customizable delivery fees.
- **WhatsApp Notification Center**: Editable templates for order confirmation, advance payment reminders, ready for pickup alerts, and dispatch updates.

### 🍰 2. Customer Online Storefront
- **Artisan Hero & Menu Catalog**: Warm, welcoming storefront showcasing Chef Ananya Sharma's artisanal creations.
- **8-Step Custom Cake Builder**:
  1. Occasion & Cake Type (Tiered Celebration, Bento, Sculpted 3D, Semi-Naked Floral)
  2. Size & Number of Servings (0.5 kg to 3 kg)
  3. Sponge Flavor, Filling, and Frosting
  4. Design Theme & Color Palette
  5. Plaque Inscription & Dietary Preferences (Eggless, Gluten-Free, Nut-Free)
  6. Photo Upload Preview
  7. Fulfillment Date & Time Slot (Pickup vs Doorstep Delivery)
  8. Live Dynamic Price Estimation & Instant Checkout
- **Cart & Slide-Over Drawer**: Coupon code support (`FIRSTBAKE10` for 10% off) and item customization notes.
- **Checkout Flow**: 50% advance deposit option vs 100% full payment, delivery instructions, and UPI payment guidance.
- **Order Confirmation & Tracker**: Confetti celebration, unique order tracking ID, WhatsApp bakery chat button, and milestone tracker (*Order Received → Baking → Decorating → Dispatched → Delivered*).

---

## 🎨 Design System

- **Color Palette**: Warm cream & ivory backgrounds (`#FAF6F0`), rich cocoa typography (`#2A1510`), and soft peach/blush accents (`#EE603D`).
- **Typography**: Playfair Display (editorial serif headings) paired with Plus Jakarta Sans (clean, modern interface body).
- **Dual Mode Switcher**: Universal top bar toggle allowing instant switching between the Baker Admin and Customer Storefront views.
- **Local Persistence**: Integrated with browser `localStorage` to ensure full state preservation across page refreshes.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Visuals**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn` / `pnpm`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/SurajBadchikarDE/BakeFlow.git
   cd BakeFlow
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to `http://localhost:5173/` to explore the app.

### Build for Production

```bash
npm run build
```

---

## 📄 License

This project is licensed under the MIT License.
