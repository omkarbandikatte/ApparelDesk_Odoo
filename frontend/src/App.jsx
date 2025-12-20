import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';

// Customer Portal Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
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
          {/* Customer Portal Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Home />} />
          {/* Shop and products are public - anyone can browse */}
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          {/* Cart and checkout require customer login (not admin) */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute requireAdmin={false}>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute requireAdmin={false}>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-confirmation/:orderNumber"
            element={
              <ProtectedRoute requireAdmin={false}>
                <OrderConfirmation />
              </ProtectedRoute>
            }
          />
          
          {/* My Account Routes - Only for customers */}
          <Route
            path="/my-account"
            element={
              <ProtectedRoute requireAdmin={false}>
                <MyAccount />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/my-account" replace />} />
            <Route path="sale-orders" element={<SaleOrders />} />
            <Route path="sale-orders/:id" element={<SaleOrderView />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="invoices/:id" element={<InvoiceView />} />
          </Route>

          {/* Admin Routes - Only for sellers/admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/contacts"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminContacts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/sale-orders"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminSaleOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/invoices"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminCustomerInvoices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/purchase-orders"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminPurchaseOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/vendor-bills"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminVendorBills />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payments"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminPayments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payment-terms"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminPaymentTerms />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/discounts"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDiscountOffers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminReports />
              </ProtectedRoute>
            }
          />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

