import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public / Auth
import Login from './pages/Login';
import Signup from './pages/Signup';

// Customer Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import MyAccount from './pages/MyAccount';
import SaleOrders from './pages/SaleOrders';
import SaleOrderView from './pages/SaleOrderView';
import Invoices from './pages/Invoices';
import InvoiceView from './pages/InvoiceView';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminContacts from './pages/admin/Contacts';
import AdminSaleOrders from './pages/admin/SaleOrders';
import AdminCustomerInvoices from './pages/admin/CustomerInvoices';
import AdminPurchaseOrders from './pages/admin/PurchaseOrders';
import AdminVendorBills from './pages/admin/VendorBills';
import AdminPayments from './pages/admin/Payments';
import AdminPaymentTerms from './pages/admin/PaymentTerms';
import AdminDiscountOffers from './pages/admin/DiscountOffers';
import AdminReports from './pages/admin/Reports';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* ---------- PUBLIC ---------- */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ---------- CUSTOMER (portal) ---------- */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute allow={['portal']}>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute allow={['portal']}>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/order-confirmation/:orderNumber"
            element={
              <ProtectedRoute allow={['portal']}>
                <OrderConfirmation />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-account"
            element={
              <ProtectedRoute allow={['portal']}>
                <MyAccount />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="sale-orders" replace />} />
            <Route path="sale-orders" element={<SaleOrders />} />
            <Route path="sale-orders/:id" element={<SaleOrderView />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="invoices/:id" element={<InvoiceView />} />
          </Route>

          {/* ---------- ADMIN (internal) ---------- */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allow={['internal']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/products"
            element={
              <ProtectedRoute allow={['internal']}>
                <AdminProducts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/contacts"
            element={
              <ProtectedRoute allow={['internal']}>
                <AdminContacts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/sale-orders"
            element={
              <ProtectedRoute allow={['internal']}>
                <AdminSaleOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/invoices"
            element={
              <ProtectedRoute allow={['internal']}>
                <AdminCustomerInvoices />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/purchase-orders"
            element={
              <ProtectedRoute allow={['internal']}>
                <AdminPurchaseOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/vendor-bills"
            element={
              <ProtectedRoute allow={['internal']}>
                <AdminVendorBills />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/payments"
            element={
              <ProtectedRoute allow={['internal']}>
                <AdminPayments />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/payment-terms"
            element={
              <ProtectedRoute allow={['internal']}>
                <AdminPaymentTerms />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/discounts"
            element={
              <ProtectedRoute allow={['internal']}>
                <AdminDiscountOffers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allow={['internal']}>
                <AdminReports />
              </ProtectedRoute>
            }
          />

          {/* ---------- FALLBACK ---------- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
