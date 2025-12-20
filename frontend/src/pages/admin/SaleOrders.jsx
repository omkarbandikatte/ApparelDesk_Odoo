import { useState, useEffect } from 'react';
import AdminHeader from '../../components/AdminHeader';

const SaleOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [products, setProducts] = useState([]);
  const [paymentTerms, setPaymentTerms] = useState([]);
  const [formData, setFormData] = useState({
    contactId: '',
    paymentTermId: '',
    lines: [{ productId: '', quantity: 1 }],
  });

  useEffect(() => {
    fetchOrders();
    fetchContacts();
    fetchProducts();
    fetchPaymentTerms();
  }, []);

  const fetchOrders = async () => {
    try {
      // const response = await api.get('/admin/sale-orders');
      // setOrders(response.data);
      // Mock data
      setOrders([
        {
          id: 1,
          orderNumber: 'SO-001',
          contact: { name: 'John Doe' },
          status: 'confirmed',
          total: 129.99,
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
    // Mock - fetch customers
    setContacts([{ id: 1, name: 'John Doe' }]);
  };

  const fetchProducts = async () => {
    // Mock - fetch products
    setProducts([{ id: 1, name: 'Classic T-Shirt' }]);
  };

  const fetchPaymentTerms = async () => {
    // Mock - fetch payment terms
    setPaymentTerms([
      { id: 1, name: 'Immediate Payment', days: 0 },
      { id: 2, name: 'Net 30', days: 30 },
    ]);
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
      // await api.post('/admin/sale-orders', formData);
      console.log('Create sale order:', formData);
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
      paymentTermId: '',
      lines: [{ productId: '', quantity: 1 }],
    });
  };

  return (
    <div>
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Sale Orders</h1>
          <button
            onClick={() => {
              setShowForm(true);
              resetForm();
            }}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
          >
            Create Sale Order
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Create Sale Order</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer *</label>
                  <select
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={formData.contactId}
                    onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
                  >
                    <option value="">Select Customer</option>
                    {contacts.map((contact) => (
                      <option key={contact.id} value={contact.id}>
                        {contact.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Term *</label>
                  <select
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={formData.paymentTermId}
                    onChange={(e) => setFormData({ ...formData, paymentTermId: e.target.value })}
                  >
                    <option value="">Select Payment Term</option>
                    {paymentTerms.map((term) => (
                      <option key={term.id} value={term.id}>
                        {term.name}
                      </option>
                    ))}
                  </select>
                </div>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
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
                    <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <button className="text-primary-600 hover:text-primary-700">View</button>
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

export default SaleOrders;

