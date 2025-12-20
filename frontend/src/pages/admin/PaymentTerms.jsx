import { useState, useEffect } from 'react';
import AdminHeader from '../../components/AdminHeader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const PaymentTerms = () => {
  const [terms, setTerms] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    days: 15,
    earlyDiscount: false,
    earlyDiscountPercent: 2,
    earlyDiscountDays: 10,
    active: true,
  });

  useEffect(() => {
    fetchTerms();
  }, []);

  useEffect(() => {
    if (terms.length > 0 && currentIndex >= 0 && currentIndex < terms.length) {
      loadTerm(terms[currentIndex]);
    }
  }, [currentIndex]);

  const fetchTerms = () => {
    const stored = localStorage.getItem('paymentTerms');
    if (stored) {
      const parsed = JSON.parse(stored);
      setTerms(parsed.filter(t => !t.archived));
      if (parsed.length > 0) {
        setCurrentIndex(0);
      }
    } else {
      const defaultTerms = [
        {
          id: 1,
          name: '15 Days',
          days: 15,
          earlyDiscount: true,
          earlyDiscountPercent: 2,
          earlyDiscountDays: 10,
          active: true,
        },
        {
          id: 2,
          name: 'Immediate Payment',
          days: 0,
          earlyDiscount: false,
          earlyDiscountPercent: 0,
          earlyDiscountDays: 0,
          active: true,
        },
      ];
      localStorage.setItem('paymentTerms', JSON.stringify(defaultTerms));
      setTerms(defaultTerms);
      setCurrentIndex(0);
    }
  };

  const handleNew = () => {
    setFormData({
      name: '',
      days: 15,
      earlyDiscount: false,
      earlyDiscountPercent: 2,
      earlyDiscountDays: 10,
      active: true,
    });
    setCurrentIndex(-1);
  };

  const loadTerm = (term) => {
    setFormData({
      name: term.name,
      days: term.days || 15,
      earlyDiscount: term.earlyDiscount || false,
      earlyDiscountPercent: term.earlyDiscountPercent || 2,
      earlyDiscountDays: term.earlyDiscountDays || 10,
      active: term.active !== undefined ? term.active : true,
    });
  };

  const calculateDiscountAmount = () => {
    // This would be calculated based on order amount, for preview we'll use 5000 as example
    const baseAmount = 5000;
    if (formData.earlyDiscount && formData.earlyDiscountPercent > 0) {
      return (baseAmount * formData.earlyDiscountPercent) / 100;
    }
    return 0;
  };

  const calculateDiscountDate = () => {
    if (formData.earlyDiscount && formData.earlyDiscountDays > 0) {
      const date = new Date();
      date.setDate(date.getDate() + formData.earlyDiscountDays);
      return date.toLocaleDateString('en-GB');
    }
    return '';
  };

  const handleSave = () => {
    const stored = localStorage.getItem('paymentTerms');
    let allTerms = stored ? JSON.parse(stored) : [];

    const termToSave = {
      id: currentIndex === -1 ? Date.now() : terms[currentIndex].id,
      name: formData.name,
      days: formData.days,
      earlyDiscount: formData.earlyDiscount,
      earlyDiscountPercent: formData.earlyDiscountPercent,
      earlyDiscountDays: formData.earlyDiscountDays,
      active: formData.active,
    };

    if (currentIndex === -1) {
      allTerms.push(termToSave);
    } else {
      allTerms = allTerms.map(t => t.id === termToSave.id ? termToSave : t);
    }

    localStorage.setItem('paymentTerms', JSON.stringify(allTerms));
    fetchTerms();
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < terms.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const isNew = currentIndex === -1;

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      
      <main className="container px-6 py-8">
        {/* Header with New and Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button onClick={handleNew} variant="outline">
            New
          </Button>
          {terms.length > 0 && (
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
                {isNew ? 'New Term' : `${currentIndex + 1} / ${terms.length}`}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                disabled={currentIndex >= terms.length - 1}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          )}
        </div>

        <Card className="p-8">
          <h1 className="text-2xl font-bold mb-6">Payment Terms</h1>

          <div className="space-y-6 max-w-2xl">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="15 Days"
              />
            </div>

            {/* Days Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Days</label>
              <Input
                type="number"
                value={formData.days}
                onChange={(e) => setFormData({ ...formData, days: parseInt(e.target.value) || 0 })}
                placeholder="15"
              />
            </div>

            {/* Early Discount Checkbox */}
            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.earlyDiscount}
                  onChange={(e) => setFormData({ ...formData, earlyDiscount: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm font-medium">Early Discount</span>
              </label>

              {formData.earlyDiscount && (
                <div className="ml-6 space-y-4 border-l-2 pl-4">
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.01"
                      className="w-20"
                      value={formData.earlyDiscountPercent}
                      onChange={(e) => setFormData({ ...formData, earlyDiscountPercent: parseFloat(e.target.value) || 0 })}
                    />
                    <span>% if paid within</span>
                    <Input
                      type="number"
                      className="w-20"
                      value={formData.earlyDiscountDays}
                      onChange={(e) => setFormData({ ...formData, earlyDiscountDays: parseInt(e.target.value) || 0 })}
                    />
                    <span>days</span>
                  </div>
                </div>
              )}
            </div>

            {/* Example Preview */}
            <div className="bg-muted/50 p-4 rounded-lg border space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Example Preview:</p>
              <div className="space-y-1">
                <p className="text-sm">
                  Payment Terms: {formData.days} days
                </p>
                {formData.earlyDiscount && formData.earlyDiscountPercent > 0 && (
                  <p className="text-sm">
                    Early payment discount: {calculateDiscountAmount()} if paid before {calculateDiscountDate()}
                  </p>
                )}
              </div>
            </div>

            {/* Active Checkbox */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm font-medium">Active</span>
              </label>
            </div>

            {/* Save Button */}
            <div>
              <Button onClick={handleSave} disabled={!formData.name}>
                Save
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default PaymentTerms;
