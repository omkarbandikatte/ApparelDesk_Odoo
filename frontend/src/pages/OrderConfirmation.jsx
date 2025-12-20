import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';

const OrderConfirmation = () => {
  const { orderNumber } = useParams();

  return (
    <div>
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your order. Your order number is <strong>{orderNumber}</strong>
          </p>
          <p className="text-gray-600 mb-8">
            You will receive an email confirmation shortly.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/my-account/sale-orders"
              className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700"
            >
              View My Orders
            </Link>
            <Link
              to="/shop"
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-300"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderConfirmation;

