# ApparelDesk - Frontend Only

A beautiful, modern e-commerce + ERP-lite system built with React, featuring separate UIs for customers and sellers.
Video of the project:https://drive.google.com/file/d/1_dH-esKZxN5XzgYjCNcOO8S57Mdhsd1a/view?usp=sharing

## 🎨 Design

Built with **v0-style** modern UI using:
- Tailwind CSS with custom CSS variables (shadcn/ui style)
- Clean, professional design
- Responsive layouts
- Smooth animations and transitions

## 🚀 Features

### Customer UI
- Browse and shop products
- Shopping cart functionality
- Order management
- Invoice viewing

### Seller/Admin UI
- Product management
- Order management
- Inventory tracking
- Reports and analytics

## 🔐 Demo Credentials

### Customer Account
- **Email:** `customer@demo.com`
- **Password:** `customer123`

### Seller Account
- **Email:** `seller@demo.com`
- **Password:** `seller123`

You can also use the quick login buttons on the login page!

## 📦 Tech Stack

- **React 18** with Vite
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Context API** for state management
- **localStorage** for data persistence

## 🛠️ Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:3000`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── ui/         # Base UI components (Button, Input, Card)
│   │   └── Header.jsx  # Navigation header
│   ├── pages/          # Page components
│   │   ├── admin/      # Admin/Seller pages
│   │   └── ...         # Customer pages
│   ├── context/        # React Context providers
│   ├── lib/            # Utilities and initialization
│   └── App.jsx         # Main app component
```

## 💾 Data Storage

All data is stored in **localStorage**:
- Products
- Users
- Orders
- Cart items

## 🎯 Key Pages

### Customer Portal
- `/` - Home page
- `/shop` - Product catalog
- `/product/:id` - Product details
- `/cart` - Shopping cart
- `/checkout` - Checkout process
- `/my-account` - Account management

### Admin Portal
- `/admin` - Dashboard
- `/admin/products` - Product management
- `/admin/contacts` - Contact management
- `/admin/sale-orders` - Sales orders
- `/admin/invoices` - Invoice management
- `/admin/reports` - Reports and analytics

## 🎨 UI Components

The app uses a custom component library inspired by shadcn/ui:
- `Button` - Various variants (default, outline, ghost, etc.)
- `Input` - Form inputs with consistent styling
- `Card` - Container components with shadows and borders

## 📝 Notes

- This is a **frontend-only** application
- All data persists in localStorage
- Perfect for demos and prototyping
- Easy to connect to a backend API later

## 🚧 Future Enhancements

- Connect to backend API
- Add more product images
- Implement search functionality
- Add filters and sorting
- Dark mode support
