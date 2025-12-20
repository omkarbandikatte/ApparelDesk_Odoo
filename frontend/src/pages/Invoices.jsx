import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        // const response = await api.get('/invoices/my-invoices');
        // setInvoices(response.data);
        // Mock data
        const mockInvoices = [
          {
            id: 1,
            invoiceNumber: 'INV-001',
            status: 'paid',
            total: 129.80,
            paidAmount: 129.80,
            invoiceDate: '2024-01-15',
            dueDate: '2024-01-15',
          },
          {
            id: 2,
            invoiceNumber: 'INV-002',
            status: 'confirmed',
            total: 79.99,
            paidAmount: 0,
            invoiceDate: '2024-01-16',
            dueDate: '2024-01-16',
          },
        ];
        setInvoices(mockInvoices);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading invoices...</div>;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-2xl font-bold mb-6">My Invoices</h2>
      {invoices.length === 0 ? (
        <p className="text-gray-600">No invoices found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
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
                  <td className="px-6 py-4">{new Date(invoice.invoiceDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">${invoice.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    {invoice.paidAmount > 0 ? (
                      <span className="text-green-600">${invoice.paidAmount.toFixed(2)}</span>
                    ) : (
                      <span className="text-gray-400">$0.00</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/my-account/invoices/${invoice.id}`}
                      className="text-primary-600 hover:text-primary-700 mr-4"
                    >
                      View
                    </Link>
                    <button className="text-primary-600 hover:text-primary-700">Download PDF</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Invoices;

