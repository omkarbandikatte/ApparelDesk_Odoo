import { useState, useEffect } from 'react';
import AdminHeader from '../../components/AdminHeader';

const CustomerInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saleOrders, setSaleOrders] = useState([]);

  useEffect(() => {
    fetchInvoices();
    fetchSaleOrders();
  }, []);

  const fetchInvoices = async () => {
    try {
      // const response = await api.get('/admin/invoices');
      // setInvoices(response.data);
      // Mock data
      setInvoices([
        {
          id: 1,
          invoiceNumber: 'INV-001',
          saleOrder: { orderNumber: 'SO-001' },
          contact: { name: 'John Doe' },
          status: 'confirmed',
          total: 129.80,
          paidAmount: 0,
          invoiceDate: '2024-01-15',
        },
      ]);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSaleOrders = async () => {
    // Mock - fetch confirmed sale orders
    setSaleOrders([{ id: 1, orderNumber: 'SO-001' }]);
  };

  const handleGenerateInvoice = async (saleOrderId) => {
    try {
      // await api.post(`/admin/invoices/generate`, { saleOrderId });
      console.log('Generate invoice from sale order:', saleOrderId);
      fetchInvoices();
    } catch (error) {
      console.error('Error generating invoice:', error);
    }
  };

  const handleConfirmInvoice = async (invoiceId) => {
    try {
      // await api.post(`/admin/invoices/${invoiceId}/confirm`);
      // Stock reduction happens on confirmation
      console.log('Confirm invoice (stock will be reduced):', invoiceId);
      fetchInvoices();
    } catch (error) {
      console.error('Error confirming invoice:', error);
    }
  };

  const handleRegisterPayment = async (invoiceId) => {
    const amount = prompt('Enter payment amount:');
    if (amount) {
      try {
        // await api.post(`/admin/invoices/${invoiceId}/payment`, { amount: parseFloat(amount) });
        console.log('Register payment:', invoiceId, amount);
        fetchInvoices();
      } catch (error) {
        console.error('Error registering payment:', error);
      }
    }
  };

  return (
    <div>
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Customer Invoices</h1>

        {loading ? (
          <div className="text-center py-12">Loading invoices...</div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sale Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 font-semibold">{invoice.invoiceNumber}</td>
                    <td className="px-6 py-4">{invoice.saleOrder.orderNumber}</td>
                    <td className="px-6 py-4">{invoice.contact.name}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">₹{invoice.total.toFixed(2)}</td>
                    <td className="px-6 py-4">₹{invoice.paidAmount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {invoice.status === 'draft' && (
                          <button
                            onClick={() => handleConfirmInvoice(invoice.id)}
                            className="text-green-600 hover:text-green-700 text-sm"
                          >
                            Confirm (Stock Reduction)
                          </button>
                        )}
                        {invoice.status === 'confirmed' && (
                          <button
                            onClick={() => handleRegisterPayment(invoice.id)}
                            className="text-primary-600 hover:text-primary-700 text-sm"
                          >
                            Register Payment
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4">Generate Invoice from Sale Order</h2>
          <div className="space-y-2">
            {saleOrders.map((order) => (
              <div key={order.id} className="flex justify-between items-center">
                <span>{order.orderNumber}</span>
                <button
                  onClick={() => handleGenerateInvoice(order.id)}
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 text-sm"
                >
                  Generate Invoice
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerInvoices;

