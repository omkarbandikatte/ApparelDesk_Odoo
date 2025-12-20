import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const InvoiceView = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        // const response = await api.get(`/invoices/${id}`);
        // setInvoice(response.data);
        // Mock data
        const mockInvoice = {
          id: 1,
          invoiceNumber: 'INV-001',
          status: 'paid',
          invoiceDate: '2024-01-15',
          dueDate: '2024-01-15',
          subtotal: 110.00,
          taxAmount: 19.80,
          discountAmount: 0,
          total: 129.80,
          paidAmount: 129.80,
          paymentTerm: {
            name: 'Immediate Payment',
            days: 0,
            description: 'Payment due immediately upon invoice confirmation',
          },
          contact: {
            name: 'John Doe',
            email: 'john@example.com',
            address: '123 Main St, City, State 12345',
          },
          lines: [
            {
              id: 1,
              product: { name: 'Classic T-Shirt' },
              quantity: 2,
              unitPrice: 29.99,
              lineTotal: 59.98,
              taxRate: 18,
              taxAmount: 10.80,
            },
            {
              id: 2,
              product: { name: 'Denim Jeans' },
              quantity: 1,
              unitPrice: 79.99,
              lineTotal: 79.99,
              taxRate: 18,
              taxAmount: 14.40,
            },
          ],
        };
        setInvoice(mockInvoice);
      } catch (error) {
        console.error('Error fetching invoice:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id]);

  const handleDownloadPDF = () => {
    // Mock PDF download
    alert('PDF download functionality would be implemented here');
  };

  if (loading) {
    return <div className="text-center py-12">Loading invoice...</div>;
  }

  if (!invoice) {
    return <div className="text-center py-12">Invoice not found</div>;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      {/* ERP-style Invoice Layout */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">INVOICE</h1>
            <p className="text-gray-600">Invoice #{invoice.invoiceNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">ApparelDesk</p>
            <p className="text-sm text-gray-600">123 Business St</p>
            <p className="text-sm text-gray-600">City, State 12345</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-6">
          <div>
            <h3 className="font-semibold mb-2">Bill To:</h3>
            <p>{invoice.contact.name}</p>
            <p className="text-sm text-gray-600">{invoice.contact.email}</p>
            <p className="text-sm text-gray-600">{invoice.contact.address}</p>
          </div>
          <div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Invoice Date:</span>
                <span>{new Date(invoice.invoiceDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Due Date:</span>
                <span>{new Date(invoice.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {invoice.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Lines */}
      <div className="mb-6">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tax Rate</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tax Amount</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {invoice.lines.map((line) => (
              <tr key={line.id}>
                <td className="px-4 py-3">{line.product.name}</td>
                <td className="px-4 py-3">{line.quantity}</td>
                <td className="px-4 py-3">₹{line.unitPrice.toFixed(2)}</td>
                <td className="px-4 py-3">{line.taxRate}%</td>
                <td className="px-4 py-3">₹{line.taxAmount.toFixed(2)}</td>
                <td className="px-4 py-3 text-right">₹{(line.lineTotal + line.taxAmount).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-6">
        <div className="w-64 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Base Amount:</span>
            <span>₹{invoice.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax:</span>
            <span>₹{invoice.taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Discount:</span>
            <span>-₹{invoice.discountAmount.toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>₹{invoice.total.toFixed(2)}</span>
          </div>
          {invoice.paidAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Paid:</span>
              <span>₹{invoice.paidAmount.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Payment Terms */}
      <div className="border-t pt-4 mb-6">
        <h3 className="font-semibold mb-2">Payment Terms</h3>
        <p className="text-sm text-gray-600">{invoice.paymentTerm.description || invoice.paymentTerm.name}</p>
        <p className="text-sm text-gray-600 mt-1">
          Payment due within {invoice.paymentTerm.days} days of invoice date.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={handleDownloadPDF}
          className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
        >
          Download PDF (Mock)
        </button>
      </div>
    </div>
  );
};

export default InvoiceView;

