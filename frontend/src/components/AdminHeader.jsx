import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/admin" className="flex items-center">
              <div className="text-2xl font-bold text-primary-600">ApparelDesk Admin</div>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link to="/admin" className="text-gray-700 hover:text-primary-600">Dashboard</Link>
              <Link to="/admin/products" className="text-gray-700 hover:text-primary-600">Products</Link>
              <Link to="/admin/contacts" className="text-gray-700 hover:text-primary-600">Contacts</Link>
              <Link to="/admin/sale-orders" className="text-gray-700 hover:text-primary-600">Sale Orders</Link>
              <Link to="/admin/invoices" className="text-gray-700 hover:text-primary-600">Invoices</Link>
              <Link to="/admin/purchase-orders" className="text-gray-700 hover:text-primary-600">Purchase Orders</Link>
              <Link to="/admin/vendor-bills" className="text-gray-700 hover:text-primary-600">Vendor Bills</Link>
              <Link to="/admin/payments" className="text-gray-700 hover:text-primary-600">Payments</Link>
              <Link to="/admin/payment-terms" className="text-gray-700 hover:text-primary-600">Payment Terms</Link>
              <Link to="/admin/discounts" className="text-gray-700 hover:text-primary-600">Discounts</Link>
              <Link to="/admin/reports" className="text-gray-700 hover:text-primary-600">Reports</Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-primary-600 text-sm">View Website</Link>
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-primary-600"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

