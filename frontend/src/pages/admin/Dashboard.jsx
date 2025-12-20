import { useState, useEffect } from 'react';
import AdminHeader from '../../components/AdminHeader';

const Dashboard = () => {
  const [kpis, setKpis] = useState({
    totalSales: 0,
    totalPurchases: 0,
    pendingInvoices: 0,
    lowStockProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        // const response = await api.get('/admin/dashboard/kpis');
        // setKpis(response.data);
        // Mock data
        setKpis({
          totalSales: 125000.50,
          totalPurchases: 85000.00,
          pendingInvoices: 5,
          lowStockProducts: 12,
        });
      } catch (error) {
        console.error('Error fetching KPIs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchKPIs();
  }, []);

  if (loading) {
    return (
      <div>
        <AdminHeader />
        <div className="text-center py-12">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Sales</h3>
            <p className="text-3xl font-bold text-primary-600">${kpis.totalSales.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Purchases</h3>
            <p className="text-3xl font-bold text-blue-600">${kpis.totalPurchases.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Pending Invoices</h3>
            <p className="text-3xl font-bold text-yellow-600">{kpis.pendingInvoices}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Low Stock Products</h3>
            <p className="text-3xl font-bold text-red-600">{kpis.lowStockProducts}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

