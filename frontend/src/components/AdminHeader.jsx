import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';
import { useState, useEffect, useRef } from 'react';

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [billingMenuOpen, setBillingMenuOpen] = useState(false);
  const [paymentTermsMenuOpen, setPaymentTermsMenuOpen] = useState(false);
  const billingMenuRef = useRef(null);
  const paymentTermsMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (billingMenuRef.current && !billingMenuRef.current.contains(event.target)) {
        setBillingMenuOpen(false);
      }
      if (paymentTermsMenuRef.current && !paymentTermsMenuRef.current.contains(event.target)) {
        setPaymentTermsMenuOpen(false);
      }
    };

    if (billingMenuOpen || paymentTermsMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [billingMenuOpen, paymentTermsMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard' },
    { path: '/admin/products', label: 'Products' },
    { path: '/admin/contacts', label: 'Contacts' },
  ];

  const billingItems = [
    { path: '/admin/sale-orders', label: 'Sale Orders' },
    { path: '/admin/purchase-orders', label: 'Purchase Orders' },
  ];

  const paymentTermsItems = [
    { path: '/admin/payment-terms', label: 'Payment Terms' },
    { path: '/admin/discounts', label: 'Offers' },
  ];

  const otherItems = [
    { path: '/admin/invoices', label: 'Invoices' },
    { path: '/admin/vendor-bills', label: 'Vendor Bills' },
    { path: '/admin/payments', label: 'Payments' },
    { path: '/admin/reports', label: 'Reports' },
  ];

  const isBillingActive = billingItems.some(item => location.pathname === item.path);
  const isPaymentTermsActive = paymentTermsItems.some(item => location.pathname === item.path);

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
            
            {/* Billing and Payment Dropdown */}
            <div className="relative" ref={billingMenuRef}>
              <button
                onClick={() => setBillingMenuOpen(!billingMenuOpen)}
                className={`text-sm font-medium transition-colors flex items-center gap-1 ${
                  isBillingActive
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Billing and Payment
                <svg
                  className={`h-4 w-4 transition-transform ${billingMenuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {billingMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 rounded-md border bg-popover shadow-lg py-1 z-50">
                  {billingItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setBillingMenuOpen(false)}
                      className={`block px-4 py-2 text-sm transition-colors ${
                        location.pathname === item.path
                          ? 'bg-accent text-accent-foreground'
                          : 'hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Terms & Offers Dropdown */}
            <div className="relative" ref={paymentTermsMenuRef}>
              <button
                onClick={() => setPaymentTermsMenuOpen(!paymentTermsMenuOpen)}
                className={`text-sm font-medium transition-colors flex items-center gap-1 ${
                  isPaymentTermsActive
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Payment Terms & Offers
                <svg
                  className={`h-4 w-4 transition-transform ${paymentTermsMenuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {paymentTermsMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 rounded-md border bg-popover shadow-lg py-1 z-50">
                  {paymentTermsItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setPaymentTermsMenuOpen(false)}
                      className={`block px-4 py-2 text-sm transition-colors ${
                        location.pathname === item.path
                          ? 'bg-accent text-accent-foreground'
                          : 'hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {otherItems.map((item) => (
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
