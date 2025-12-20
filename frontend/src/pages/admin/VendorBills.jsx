import { useState, useEffect } from 'react';
import AdminHeader from '../../components/AdminHeader';

const VendorBills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      // const response = await api.get('/admin/vendor-bills');
      // setBills(response.data);
      // Mock data
      setBills([
        {
          id: 1,
          billNumber: 'BILL-001',
          purchaseOrder: { orderNumber: 'PO-001' },
          contact: { name: 'ABC Suppliers' },
          status: 'confirmed',
          total: 5000.00,
          paidAmount: 0,
          billDate: '2024-01-15',
          dueDate: '2024-02-15',
        },
      ]);
    } catch (error) {
      console.error('Error fetching bills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBill = async (billId) => {
    try {
      // await api.post(`/admin/vendor-bills/${billId}/confirm`);
      // Stock increase happens on confirmation
      console.log('Confirm bill (stock will be increased):', billId);
      fetchBills();
    } catch (error) {
      console.error('Error confirming bill:', error);
    }
  };

  const handleRegisterPayment = async (billId) => {
    const amount = prompt('Enter payment amount:');
    if (amount) {
      try {
        // await api.post(`/admin/vendor-bills/${billId}/payment`, { amount: parseFloat(amount) });
        console.log('Register payment:', billId, amount);
        fetchBills();
      } catch (error) {
        console.error('Error registering payment:', error);
      }
    }
  };

  return (
    <div>
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Vendor Bills</h1>

        {loading ? (
          <div className="text-center py-12">Loading bills...</div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bill Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purchase Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bill Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bills.map((bill) => (
                  <tr key={bill.id}>
                    <td className="px-6 py-4 font-semibold">{bill.billNumber}</td>
                    <td className="px-6 py-4">{bill.purchaseOrder.orderNumber}</td>
                    <td className="px-6 py-4">{bill.contact.name}</td>
                    <td className="px-6 py-4">{new Date(bill.billDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{new Date(bill.dueDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        {bill.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">${bill.total.toFixed(2)}</td>
                    <td className="px-6 py-4">${bill.paidAmount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {bill.status === 'draft' && (
                          <button
                            onClick={() => handleConfirmBill(bill.id)}
                            className="text-green-600 hover:text-green-700 text-sm"
                          >
                            Confirm (Stock Increase)
                          </button>
                        )}
                        {bill.status === 'confirmed' && (
                          <button
                            onClick={() => handleRegisterPayment(bill.id)}
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
      </main>
    </div>
  );
};

export default VendorBills;

