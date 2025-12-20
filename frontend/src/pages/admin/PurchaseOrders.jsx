import { useState, useEffect } from 'react';
import AdminHeader from '../../components/AdminHeader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const PurchaseOrders = () => {
  const [orders, setOrders] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [contacts, setContacts] = useState([]);
  const [products, setProducts] = useState([]);
  const [orderData, setOrderData] = useState({
    poNumber: '',
    vendorId: '',
    poDate: new Date().toISOString().split('T')[0],
    status: 'draft',
    lines: [{ productId: '', quantity: 1, unitPrice: 0, taxRate: 10 }],
  });

  useEffect(() => {
    fetchOrders();
    fetchContacts();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (orders.length > 0 && currentIndex >= 0 && currentIndex < orders.length) {
      loadOrder(orders[currentIndex]);
    } else if (orders.length === 0 && currentIndex !== -1) {
      handleNew();
    }
  }, [currentIndex]);

  const fetchOrders = () => {
    const stored = localStorage.getItem('purchaseOrders');
    if (stored) {
      const parsed = JSON.parse(stored);
      setOrders(parsed.filter(o => !o.archived));
      if (parsed.length > 0) {
        setCurrentIndex(0);
      }
    } else {
      handleNew();
    }
  };

  const fetchContacts = () => {
    const stored = localStorage.getItem('contacts');
    if (stored) {
      const parsed = JSON.parse(stored);
      setContacts(parsed.filter(c => c.contactType === 'vendor' || c.contactType === 'both'));
    } else {
      setContacts([]);
    }
  };

  const fetchProducts = () => {
    const stored = localStorage.getItem('products');
    if (stored) {
      setProducts(JSON.parse(stored));
    } else {
      setProducts([]);
    }
  };

  const generatePONumber = () => {
    const stored = localStorage.getItem('purchaseOrders');
    if (stored) {
      const orders = JSON.parse(stored);
      const lastOrder = orders[orders.length - 1];
      if (lastOrder && lastOrder.poNumber) {
        const match = lastOrder.poNumber.match(/P(\d+)/);
        if (match) {
          const nextNum = parseInt(match[1]) + 1;
          return `P${String(nextNum).padStart(4, '0')}`;
        }
      }
    }
    return 'P0001';
  };

  const handleNew = () => {
    setOrderData({
      poNumber: generatePONumber(),
      vendorId: '',
      poDate: new Date().toISOString().split('T')[0],
      status: 'draft',
      lines: [{ productId: '', quantity: 1, unitPrice: 0, taxRate: 10 }],
    });
    setCurrentIndex(-1);
  };

  const loadOrder = (order) => {
    setOrderData({
      poNumber: order.poNumber,
      vendorId: order.vendorId || '',
      poDate: order.poDate || new Date().toISOString().split('T')[0],
      status: order.status || 'draft',
      lines: order.lines || [{ productId: '', quantity: 1, unitPrice: 0, taxRate: 10 }],
    });
  };

  const handleLineChange = (index, field, value) => {
    const newLines = [...orderData.lines];
    newLines[index][field] = field === 'quantity' || field === 'unitPrice' || field === 'taxRate' 
      ? parseFloat(value) || 0 
      : value;
    setOrderData({ ...orderData, lines: newLines });
  };

  const addLine = () => {
    setOrderData({
      ...orderData,
      lines: [...orderData.lines, { productId: '', quantity: 1, unitPrice: 0, taxRate: 10 }],
    });
  };

  const removeLine = (index) => {
    if (orderData.lines.length > 1) {
      setOrderData({
        ...orderData,
        lines: orderData.lines.filter((_, i) => i !== index),
      });
    }
  };

  const calculateLineTotals = (line) => {
    const untaxed = line.quantity * line.unitPrice;
    const taxAmount = (untaxed * line.taxRate) / 100;
    return { untaxed, taxAmount, total: untaxed + taxAmount };
  };

  const calculateTotals = () => {
    return orderData.lines.reduce(
      (acc, line) => {
        const { untaxed, taxAmount, total } = calculateLineTotals(line);
        return {
          untaxed: acc.untaxed + untaxed,
          taxAmount: acc.taxAmount + taxAmount,
          total: acc.total + total,
        };
      },
      { untaxed: 0, taxAmount: 0, total: 0 }
    );
  };

  const handleConfirm = () => {
    if (currentIndex === -1) {
      handleSave();
    }
    const stored = localStorage.getItem('purchaseOrders');
    let allOrders = stored ? JSON.parse(stored) : [];
    const currentOrder = currentIndex === -1 
      ? allOrders[allOrders.length - 1]
      : orders[currentIndex];
    
    allOrders = allOrders.map(o =>
      o.id === currentOrder.id ? { ...o, status: 'confirmed' } : o
    );
    localStorage.setItem('purchaseOrders', JSON.stringify(allOrders));
    fetchOrders();
  };

  const handleCancel = () => {
    const stored = localStorage.getItem('purchaseOrders');
    let allOrders = stored ? JSON.parse(stored) : [];
    const currentOrder = orders[currentIndex];
    
    allOrders = allOrders.map(o =>
      o.id === currentOrder.id ? { ...o, status: 'cancelled' } : o
    );
    localStorage.setItem('purchaseOrders', JSON.stringify(allOrders));
    fetchOrders();
  };

  const handleSave = () => {
    const stored = localStorage.getItem('purchaseOrders');
    let allOrders = stored ? JSON.parse(stored) : [];
    const totals = calculateTotals();
    
    const orderToSave = {
      id: currentIndex === -1 ? Date.now() : orders[currentIndex].id,
      poNumber: orderData.poNumber,
      vendorId: orderData.vendorId,
      poDate: orderData.poDate,
      status: orderData.status,
      lines: orderData.lines,
      ...totals,
    };

    if (currentIndex === -1) {
      allOrders.push(orderToSave);
    } else {
      allOrders = allOrders.map(o => o.id === orderToSave.id ? orderToSave : o);
    }
    
    localStorage.setItem('purchaseOrders', JSON.stringify(allOrders));
    fetchOrders();
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < orders.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handleCreateBill = () => {
    // Navigate to vendor bills or create bill
    alert('Create Bill functionality - will navigate to Vendor Bills');
  };

  const totals = calculateTotals();
  const isNew = currentIndex === -1;
  const currentOrder = !isNew && orders[currentIndex] ? orders[currentIndex] : null;
  const vendor = contacts.find(c => c.id === parseInt(orderData.vendorId));

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      
      <main className="container px-6 py-8">
        {/* Header with New and Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button onClick={handleNew} variant="outline">
            New
          </Button>
          {orders.length > 0 && (
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevious}
                disabled={currentIndex <= 0}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
              <span className="text-sm text-muted-foreground min-w-[80px] text-center">
                {isNew ? 'New Order' : `${currentIndex + 1} / ${orders.length}`}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                disabled={currentIndex >= orders.length - 1}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          )}
        </div>

        <Card className="p-8">
          <h1 className="text-2xl font-bold mb-6">Purchase Order</h1>

          {/* Header Fields */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">PO Number</label>
              <Input
                value={orderData.poNumber}
                onChange={(e) => setOrderData({ ...orderData, poNumber: e.target.value })}
                placeholder="P0001"
              />
              <p className="text-xs text-muted-foreground">(auto generate PO Number + 1 of last order)</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Vendor Name</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={orderData.vendorId}
                onChange={(e) => setOrderData({ ...orderData, vendorId: e.target.value })}
              >
                <option value="">Select Vendor</option>
                {contacts.map((contact) => (
                  <option key={contact.id} value={contact.id}>
                    {contact.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">(from Contact & users - Many to one)</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">PO Date</label>
              <Input
                type="date"
                value={orderData.poDate}
                onChange={(e) => setOrderData({ ...orderData, poDate: e.target.value })}
              />
            </div>
          </div>

          {/* Action Buttons and Status */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Button
                onClick={handleConfirm}
                variant={orderData.status === 'confirmed' ? 'default' : 'outline'}
                disabled={orderData.status === 'confirmed'}
              >
                Confirm
              </Button>
              <Button variant="outline">Print</Button>
              <Button variant="outline">Send</Button>
              <Button variant="outline" onClick={handleCancel}>Cancel</Button>
              {orderData.status === 'confirmed' && (
                <Button variant="outline" onClick={handleCreateBill}>
                  Create Bill
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded text-sm ${
                orderData.status === 'draft' ? 'bg-blue-100 text-blue-800' :
                orderData.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {orderData.status}
              </span>
              <span className="text-sm text-muted-foreground">Draft &gt; Confirm &gt; Cancelled</span>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border rounded-lg overflow-hidden mb-6">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Sr. No.</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Product</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Qty</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Unit Price</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Untaxed Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Tax</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Tax Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Total</th>
                  <th className="px-4 py-3 text-left text-sm font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {orderData.lines.map((line, index) => {
                  const { untaxed, taxAmount, total } = calculateLineTotals(line);
                  return (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">
                        <select
                          className="w-full border rounded px-2 py-1 text-sm"
                          value={line.productId}
                          onChange={(e) => {
                            const product = products.find(p => p.id === parseInt(e.target.value));
                            handleLineChange(index, 'productId', e.target.value);
                            if (product) {
                              handleLineChange(index, 'unitPrice', product.purchasePrice || 0);
                              handleLineChange(index, 'taxRate', product.taxRate || 10);
                            }
                          }}
                        >
                          <option value="">Select Product</option>
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          type="number"
                          className="w-20"
                          value={line.quantity}
                          onChange={(e) => handleLineChange(index, 'quantity', e.target.value)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          type="number"
                          step="0.01"
                          className="w-24"
                          value={line.unitPrice}
                          onChange={(e) => handleLineChange(index, 'unitPrice', e.target.value)}
                        />
                      </td>
                      <td className="px-4 py-3">{untaxed.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <Input
                          type="number"
                          step="0.01"
                          className="w-20"
                          value={line.taxRate}
                          onChange={(e) => handleLineChange(index, 'taxRate', e.target.value)}
                        />%
                      </td>
                      <td className="px-4 py-3">{taxAmount.toFixed(2)}</td>
                      <td className="px-4 py-3">{total.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm" onClick={() => removeLine(index)}>
                          Remove
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="p-4 border-t bg-muted/50">
              <Button variant="outline" size="sm" onClick={addLine}>
                + Add Line
              </Button>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-80 space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Total (Untaxed Amount):</span>
                <span className="font-bold text-green-600">{totals.untaxed.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total:</span>
                <span className="font-bold text-green-600">{totals.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default PurchaseOrders;
