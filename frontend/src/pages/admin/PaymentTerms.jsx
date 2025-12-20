import { useState, useEffect } from 'react';
import AdminHeader from '../../components/AdminHeader';

const PaymentTerms = () => {
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTerm, setEditingTerm] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    days: 0,
    earlyPaymentDiscount: 0,
    discountDays: 0,
    discountComputation: 'base',
  });

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      // const response = await api.get('/admin/payment-terms');
      // setTerms(response.data);
      // Mock data
      setTerms([
        {
          id: 1,
          name: 'Immediate Payment',
          description: 'Payment due immediately',
          days: 0,
          earlyPaymentDiscount: 0,
          discountDays: 0,
          discountComputation: 'base',
        },
        {
          id: 2,
          name: 'Net 30',
          description: 'Payment due within 30 days',
          days: 30,
          earlyPaymentDiscount: 2,
          discountDays: 10,
          discountComputation: 'base',
        },
      ]);
    } catch (error) {
      console.error('Error fetching payment terms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTerm) {
        // await api.put(`/admin/payment-terms/${editingTerm.id}`, formData);
        console.log('Update payment term:', formData);
      } else {
        // await api.post('/admin/payment-terms', formData);
        console.log('Create payment term:', formData);
      }
      setShowForm(false);
      setEditingTerm(null);
      resetForm();
      fetchTerms();
    } catch (error) {
      console.error('Error saving payment term:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      days: 0,
      earlyPaymentDiscount: 0,
      discountDays: 0,
      discountComputation: 'base',
    });
  };

  const handleEdit = (term) => {
    setEditingTerm(term);
    setFormData({
      name: term.name,
      description: term.description || '',
      days: term.days,
      earlyPaymentDiscount: term.earlyPaymentDiscount,
      discountDays: term.discountDays,
      discountComputation: term.discountComputation,
    });
    setShowForm(true);
  };

  return (
    <div>
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Payment Terms</h1>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingTerm(null);
              resetForm();
            }}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
          >
            Create Payment Term
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">
              {editingTerm ? 'Edit Payment Term' : 'Create Payment Term'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Days *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={formData.days}
                    onChange={(e) => setFormData({ ...formData, days: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Early Payment Discount (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={formData.earlyPaymentDiscount}
                    onChange={(e) => setFormData({ ...formData, earlyPaymentDiscount: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Days</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={formData.discountDays}
                    onChange={(e) => setFormData({ ...formData, discountDays: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Computation</label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={formData.discountComputation}
                    onChange={(e) => setFormData({ ...formData, discountComputation: e.target.value })}
                  >
                    <option value="base">Base Amount</option>
                    <option value="total">Total Amount</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600">
                  <strong>Example Preview:</strong> {formData.name} - Payment due within {formData.days} days.
                  {formData.earlyPaymentDiscount > 0 && (
                    <> Early payment discount of {formData.earlyPaymentDiscount}% if paid within {formData.discountDays} days (computed on {formData.discountComputation}).</>
                  )}
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
                >
                  {editingTerm ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingTerm(null);
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
          <div className="text-center py-12">Loading payment terms...</div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Early Payment Discount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount Days</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Computation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {terms.map((term) => (
                  <tr key={term.id}>
                    <td className="px-6 py-4 font-semibold">{term.name}</td>
                    <td className="px-6 py-4">{term.days}</td>
                    <td className="px-6 py-4">{term.earlyPaymentDiscount}%</td>
                    <td className="px-6 py-4">{term.discountDays}</td>
                    <td className="px-6 py-4 capitalize">{term.discountComputation}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleEdit(term)}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        Edit
                      </button>
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

export default PaymentTerms;

