import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard' },
    { path: '/admin/products', label: 'Products' },
    { path: '/admin/contacts', label: 'Contacts' },
    { path: '/admin/sale-orders', label: 'Sale Orders' },
    { path: '/admin/invoices', label: 'Invoices' },
    { path: '/admin/purchase-orders', label: 'Purchase Orders' },
    { path: '/admin/vendor-bills', label: 'Vendor Bills' },
    { path: '/admin/payments', label: 'Payments' },
    { path: '/admin/payment-terms', label: 'Payment Terms' },
    { path: '/admin/discounts', label: 'Discounts' },
    { path: '/admin/reports', label: 'Reports' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link to="/admin" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              ApparelDesk Admin
            </span>
          </Link>
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            View Website
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
