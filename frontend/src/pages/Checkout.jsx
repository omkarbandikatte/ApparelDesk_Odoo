import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
  const { cart, getCartSubtotal, getCartTax, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);

  const subtotal = getCartSubtotal();
  const tax = getCartTax();
  const total = getCartTotal() - discount;

  const handleCouponValidation = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setCouponError('');
    setCouponSuccess('');

    try {
      // Mock API call - replace with actual API
      // const response = await api.post('/coupons/validate', { code: couponCode });
      // if (response.data.valid) {
      //   setDiscount(response.data.discountAmount);
      //   setCouponSuccess('Coupon applied successfully!');
      // } else {
      //   setCouponError('Invalid or expired coupon code');
      // }
      
      // Mock validation
      if (couponCode.toUpperCase() === 'SAVE10') {
        const discountAmount = subtotal * 0.1;
        setDiscount(discountAmount);
        setCouponSuccess('Coupon applied successfully! 10% discount applied.');
      } else {
        setCouponError('Invalid or expired coupon code');
      }
    } catch (error) {
      setCouponError('Error validating coupon. Please try again.');
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      // Website orders create Sale Order with Payment Term = Immediate Payment
      // const response = await api.post('/sale-orders', {
      //   items: cart,
      //   couponCode: couponCode || null,
      //   paymentTerm: 'Immediate Payment', // Website orders always use Immediate Payment
      // });
      
      // Mock order creation
      const orderNumber = `SO-${Date.now()}`;
      
      // Clear cart after successful order
      clearCart();
      
      // Navigate to order confirmation
      navigate(`/order-confirmation/${orderNumber}`);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div>
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-4">Add items to your cart before checkout</p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700"
            >
              Continue Shopping
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address Confirmation */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
              {user?.address ? (
                <div className="text-gray-700">
                  <p>{user.name}</p>
                  <p>{user.address}</p>
                  <p>{user.mobile}</p>
                </div>
              ) : (
                <p className="text-gray-600">No address on file. Please update your profile.</p>
              )}
            </div>

            {/* Coupon Code */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-4">Coupon Code</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  className="flex-1 border border-gray-300 rounded-md px-4 py-2"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button
                  onClick={handleCouponValidation}
                  className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
                >
                  Apply
                </button>
              </div>
              {couponError && (
                <p className="mt-2 text-red-600 text-sm">{couponError}</p>
              )}
              {couponSuccess && (
                <p className="mt-2 text-green-600 text-sm">{couponSuccess}</p>
              )}
            </div>

            {/* Order Items Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-4">Order Items</h2>
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>${((item.salesPrice * item.quantity) * (1 + item.taxRate / 100)).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <div className="mb-4 text-sm text-gray-600">
                <p>Payment Term: Immediate Payment</p>
                <p className="text-xs mt-1">
                  Website orders create Sale Order with Payment Term = Immediate Payment
                </p>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-primary-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-primary-700 disabled:opacity-50"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;

