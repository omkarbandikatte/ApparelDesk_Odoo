import { useState } from 'react';
import AdminHeader from '../../components/AdminHeader';

const Reports = () => {
  const [reportType, setReportType] = useState('sales-by-product');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = async () => {
    if (!dateFrom || !dateTo) {
      alert('Please select date range');
      return;
    }

    setLoading(true);
    try {
      // const response = await api.get(`/admin/reports/${reportType}`, {
      //   params: { dateFrom, dateTo },
      // });
      // setReportData(response.data);
      // Mock data
      setReportData({
        reportType,
        dateFrom,
        dateTo,
        data: [
          { product: 'Classic T-Shirt', quantity: 150, amount: 4498.50 },
          { product: 'Denim Jeans', quantity: 80, amount: 6399.20 },
        ],
      });
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Reports</h1>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Generate Report</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="sales-by-product">Sales by Product</option>
                <option value="purchase-by-product">Purchase by Product</option>
                <option value="sales-by-customer">Sales by Customer</option>
                <option value="purchase-by-vendor">Purchase by Vendor</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>
            <button
              onClick={handleGenerateReport}
              disabled={loading}
              className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </div>

        {reportData && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold mb-4">
              {reportData.reportType.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
            </h2>
            <p className="text-gray-600 mb-4">
              Period: {new Date(reportData.dateFrom).toLocaleDateString()} - {new Date(reportData.dateTo).toLocaleDateString()}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {reportData.reportType.includes('product') ? 'Product' : reportData.reportType.includes('customer') ? 'Customer' : 'Vendor'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reportData.data.map((row, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 font-semibold">{row.product || row.customer || row.vendor}</td>
                      <td className="px-6 py-4">{row.quantity}</td>
                      <td className="px-6 py-4">₹{row.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Reports;

