import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const SaleOrderView = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // const response = await api.get(`/sale-orders/${id}`);
        // setOrder(response.data);
        // Mock data
        const mockOrder = {
          id: 1,
          orderNumber: 'SO-001',
          status: 'confirmed',
          subtotal: 110.00,
          taxAmount: 19.80,
          discountAmount: 0,
          total: 129.80,
          paymentTerm: { name: 'Immediate Payment', days: 0 },
          lines: [
            {
              id: 1,
              product: { name: 'Classic T-Shirt' },
              quantity: 2,
              unitPrice: 29.99,
              lineTotal: 59.98,
              taxAmount: 10.80,
            },
            {
              id: 2,
              product: { name: 'Denim Jeans' },
              quantity: 1,
              unitPrice: 79.99,
              lineTotal: 79.99,
              taxAmount: 14.40,
            },
          ],
          invoice: {
            id: 1,
            invoiceNumber: 'INV-001',
          },
        };
        setOrder(mockOrder);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return <div className="text-center py-12">Loading order details...</div>;
  }

  if (!order) {
    return <div className="text-center py-12">Order not found</div>;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-2xl font-bold mb-6">Sale Order Details</h2>
      
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Order Number</label>
            <p className="text-gray-900 font-semibold">{order.orderNumber}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Status</label>
            <p className="text-gray-900">{order.status}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Payment Term</label>
            <p className="text-gray-900">{order.paymentTerm?.name} ({order.paymentTerm?.days} days)</p>
          </div>
          {order.invoice && (
            <div>
              <label className="text-sm font-medium text-gray-700">Linked Invoice</label>
              <p className="text-primary-600">
                <a href={`/my-account/invoices/${order.invoice.id}`}>{order.invoice.invoiceNumber}</a>
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Order Lines</h3>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {order.lines.map((line) => (
              <tr key={line.id}>
                <td className="px-4 py-2">{line.product.name}</td>
                <td className="px-4 py-2">{line.quantity}</td>
                <td className="px-4 py-2">${line.unitPrice.toFixed(2)}</td>
                <td className="px-4 py-2">${(line.lineTotal + line.taxAmount).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>${order.taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount:</span>
              <span>${order.discountAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleOrderView;

