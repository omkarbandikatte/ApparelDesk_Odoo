# Backend API Documentation

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory with the following variables:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
JWT_SECRET=your-secret-key-change-in-production
PORT=5000
```

3. Run the database schema:
```bash
psql -U your_database_user -d your_database_name -f database/schema.sql
```

4. Start the server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/signup` - Signup
- `GET /api/auth/me` - Get current user (requires auth)

### Products
- `GET /api/products` - Get all products (query: `published=true` for published only)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Contacts
- `GET /api/contacts` - Get all contacts (admin only)
- `GET /api/contacts/:id` - Get single contact (admin only)
- `POST /api/contacts` - Create contact (admin only)
- `PUT /api/contacts/:id` - Update contact (admin only)
- `DELETE /api/contacts/:id` - Delete contact (admin only)

### Sale Orders
- `GET /api/sale-orders` - Get all sale orders (admin only)
- `GET /api/sale-orders/my-orders` - Get current user's orders
- `GET /api/sale-orders/:id` - Get single sale order
- `POST /api/sale-orders` - Create sale order
- `PUT /api/sale-orders/:id/status` - Update sale order status (admin only)

### Coupons
- `POST /api/coupons/validate` - Validate coupon code (requires auth)

### Invoices
- `GET /api/invoices` - Get all invoices (admin only)
- `GET /api/invoices/my-invoices` - Get current user's invoices
- `GET /api/invoices/:id` - Get single invoice
- `POST /api/invoices/generate` - Generate invoice from sale order (admin only)
- `POST /api/invoices/:id/confirm` - Confirm invoice (admin only)
- `POST /api/invoices/:id/payment` - Record payment (admin only)

### Admin Routes
- `GET /api/admin/dashboard/kpis` - Get dashboard KPIs
- `GET /api/admin/payments` - Get all payments
- `GET /api/admin/purchase-orders` - Get all purchase orders
- `POST /api/admin/purchase-orders` - Create purchase order
- `PUT /api/admin/purchase-orders/:id/status` - Update purchase order status
- `GET /api/admin/vendor-bills` - Get all vendor bills
- `POST /api/admin/vendor-bills/generate` - Generate vendor bill from purchase order
- `POST /api/admin/vendor-bills/:id/confirm` - Confirm vendor bill
- `POST /api/admin/vendor-bills/:id/payment` - Record vendor bill payment
- `GET /api/admin/payment-terms` - Get all payment terms
- `POST /api/admin/payment-terms` - Create payment term
- `PUT /api/admin/payment-terms/:id` - Update payment term
- `GET /api/admin/discount-offers` - Get all discount offers
- `POST /api/admin/discount-offers` - Create discount offer
- `PUT /api/admin/discount-offers/:id` - Update discount offer
- `POST /api/admin/discount-offers/generate-coupons` - Generate coupon codes
- `GET /api/admin/reports/:reportType` - Get reports (sales, revenue, products)

## Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

Tokens are obtained from the login/signup endpoints and stored in localStorage by the frontend.

