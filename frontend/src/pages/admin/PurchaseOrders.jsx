import { useState, useEffect } from 'react';
import AdminHeader from '../../components/AdminHeader';

const PurchaseOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    contactId: '',
    lines: [{ productId: '', quantity: 1 }],
  });

  useEffect(() => {
    fetchOrders();
    fetchContacts();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      // const response = await api.get('/admin/purchase-orders');
      // setOrders(response.data);
      // Mock data
      setOrders([
        {
          id: 1,
          orderNumber: 'PO-001',
          contact: { name: 'ABC Suppliers' },
          status: 'confirmed',
          total: 5000.00,
          createdAt: '2024-01-15',
        },
      ]);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async () => {
    // Mock - fetch vendors
    setContacts([{ id: 1, name: 'ABC Suppliers' }]);
  };

  const fetchProducts = async () => {
    // Mock - fetch products
    setProducts([{ id: 1, name: 'Classic T-Shirt' }]);
  };

  const handleAddLine = () => {
    setFormData({
      ...formData,
      lines: [...formData.lines, { productId: '', quantity: 1 }],
    });
  };

  const handleLineChange = (index, field, value) => {
    const newLines = [...formData.lines];
    newLines[index][field] = value;
    setFormData({ ...formData, lines: newLines });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // await api.post('/admin/purchase-orders', formData);
      console.log('Create purchase order:', formData);
      setShowForm(false);
      resetForm();
      fetchOrders();
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      contactId: '',
      lines: [{ productId: '', quantity: 1 }],
    });
  };

  const handleConvertToBill = async (orderId) => {
    try {
      // await api.post(`/admin/purchase-orders/${orderId}/convert-to-bill`);
      console.log('Convert to vendor bill:', orderId);
      fetchOrders();
    } catch (error) {
      console.error('Error converting to bill:', error);
    }
  };

  return (
    <div>
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Purchase Orders</h1>
          <button
            onClick={() => {
              setShowForm(true);
              resetForm();
            }}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
          >
            Create Purchase Order
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Create Purchase Order</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vendor *</label>
                <select
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={formData.contactId}
                  onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
                >
                  <option value="">Select Vendor</option>
                  {contacts.map((contact) => (
                    <option key={contact.id} value={contact.id}>
                      {contact.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Order Lines *</label>
                  <button
                    type="button"
                    onClick={handleAddLine}
                    className="text-primary-600 hover:text-primary-700 text-sm"
                  >
                    + Add Line
                  </button>
                </div>
                {formData.lines.map((line, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <select
                      required
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                      value={line.productId}
                      onChange={(e) => handleLineChange(index, 'productId', e.target.value)}
                    >
                      <option value="">Select Product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      required
                      className="w-24 border border-gray-300 rounded-md px-3 py-2"
                      value={line.quantity}
                      onChange={(e) => handleLineChange(index, 'quantity', parseInt(e.target.value) || 1)}
                      placeholder="Qty"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
                >
                  Create Order
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">Loading orders...</div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 font-semibold">{order.orderNumber}</td>
                    <td className="px-6 py-4">{order.contact.name}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      {order.status === 'confirmed' && (
                        <button
                          onClick={() => handleConvertToBill(order.id)}
                          className="text-primary-600 hover:text-primary-700 text-sm"
                        >
                          Convert to Vendor Bill
                        </button>
                      )}
                    </td>
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

export default PurchaseOrders;

