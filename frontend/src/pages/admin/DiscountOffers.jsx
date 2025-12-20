import { useState, useEffect } from 'react';
import AdminHeader from '../../components/AdminHeader';

const DiscountOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    discountPercentage: 0,
    validFrom: '',
    validTo: '',
    availableOnSales: false,
    availableOnWebsite: false,
    isActive: true,
  });

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      // const response = await api.get('/admin/discount-offers');
      // setOffers(response.data);
      // Mock data
      setOffers([
        {
          id: 1,
          name: 'Summer Sale',
          discountPercentage: 10,
          validFrom: '2024-01-01',
          validTo: '2024-12-31',
          availableOnSales: true,
          availableOnWebsite: true,
          isActive: true,
          couponCodes: [
            { id: 1, code: 'SAVE10', used: false },
            { id: 2, code: 'SUMMER10', used: true },
          ],
        },
      ]);
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingOffer) {
        // await api.put(`/admin/discount-offers/${editingOffer.id}`, formData);
        console.log('Update discount offer:', formData);
      } else {
        // await api.post('/admin/discount-offers', formData);
        console.log('Create discount offer:', formData);
      }
      setShowForm(false);
      setEditingOffer(null);
      resetForm();
      fetchOffers();
    } catch (error) {
      console.error('Error saving offer:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      discountPercentage: 0,
      validFrom: '',
      validTo: '',
      availableOnSales: false,
      availableOnWebsite: false,
      isActive: true,
    });
  };

  const handleEdit = (offer) => {
    setEditingOffer(offer);
    setFormData({
      name: offer.name,
      discountPercentage: offer.discountPercentage,
      validFrom: offer.validFrom,
      validTo: offer.validTo,
      availableOnSales: offer.availableOnSales,
      availableOnWebsite: offer.availableOnWebsite,
      isActive: offer.isActive,
    });
    setShowForm(true);
  };

  const handleGenerateCoupon = async (offerId) => {
    const code = prompt('Enter coupon code:');
    if (code) {
      try {
        // await api.post(`/admin/discount-offers/${offerId}/coupons`, { code });
        console.log('Generate coupon:', offerId, code);
        fetchOffers();
      } catch (error) {
        console.error('Error generating coupon:', error);
      }
    }
  };

  return (
    <div>
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Discount Offers & Coupons</h1>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingOffer(null);
              resetForm();
            }}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
          >
            Create Discount Offer
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">
              {editingOffer ? 'Edit Discount Offer' : 'Create Discount Offer'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Percentage *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={formData.discountPercentage}
                    onChange={(e) => setFormData({ ...formData, discountPercentage: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valid From *</label>
                  <input
                    type="date"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valid To *</label>
                  <input
                    type="date"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={formData.validTo}
                    onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={formData.availableOnSales}
                    onChange={(e) => setFormData({ ...formData, availableOnSales: e.target.checked })}
                  />
                  <span>Available on Sales (manual orders)</span>
                </label>
                <label className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={formData.availableOnWebsite}
                    onChange={(e) => setFormData({ ...formData, availableOnWebsite: e.target.checked })}
                  />
                  <span>Available on Website (online orders)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span>Active</span>
                </label>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
                >
                  {editingOffer ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingOffer(null);
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
          <div className="text-center py-12">Loading offers...</div>
        ) : (
          <div className="space-y-6">
            {offers.map((offer) => (
              <div key={offer.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{offer.name}</h3>
                    <p className="text-gray-600">
                      {offer.discountPercentage}% discount | Valid: {new Date(offer.validFrom).toLocaleDateString()} - {new Date(offer.validTo).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Available on: {offer.availableOnSales && 'Sales'} {offer.availableOnSales && offer.availableOnWebsite && '&'} {offer.availableOnWebsite && 'Website'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleGenerateCoupon(offer.id)}
                      className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 text-sm"
                    >
                      Generate Coupon
                    </button>
                    <button
                      onClick={() => handleEdit(offer)}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 text-sm"
                    >
                      Edit
                    </button>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Coupon Codes:</h4>
                  <div className="space-y-2">
                    {offer.couponCodes?.map((coupon) => (
                      <div key={coupon.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                        <span className="font-mono">{coupon.code}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          coupon.used ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {coupon.used ? 'Used' : 'Unused'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DiscountOffers;

