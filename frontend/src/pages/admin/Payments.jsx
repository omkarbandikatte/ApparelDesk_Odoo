import { useState, useEffect } from 'react';
import AdminHeader from '../../components/AdminHeader';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      // const response = await api.get('/admin/payments');
      // setPayments(response.data);
      // Mock data
      setPayments([
        {
          id: 1,
          paymentNumber: 'PAY-001',
          customerInvoice: { invoiceNumber: 'INV-001' },
          vendorBill: null,
          amount: 129.80,
          paymentDate: '2024-01-15',
          paymentMethod: 'bank_transfer',
        },
        {
          id: 2,
          paymentNumber: 'PAY-002',
          customerInvoice: null,
          vendorBill: { billNumber: 'BILL-001' },
          amount: 5000.00,
          paymentDate: '2024-01-16',
          paymentMethod: 'cheque',
        },
      ]);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Payments</h1>
        <p className="text-gray-600 mb-6">
          Unified payment list. Payments are linked to Customer Invoices or Vendor Bills.
          Supports partial and full payments.
        </p>

        {loading ? (
          <div className="text-center py-12">Loading payments...</div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Linked To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 font-semibold">{payment.paymentNumber}</td>
                    <td className="px-6 py-4">
                      {payment.customerInvoice ? (
                        <span className="text-blue-600">Invoice: {payment.customerInvoice.invoiceNumber}</span>
                      ) : (
                        <span className="text-green-600">Bill: {payment.vendorBill.billNumber}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {payment.customerInvoice ? (
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Customer</span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Vendor</span>
                      )}
                    </td>
                    <td className="px-6 py-4">${payment.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 capitalize">{payment.paymentMethod.replace('_', ' ')}</td>
                    <td className="px-6 py-4">{new Date(payment.paymentDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default Payments;

