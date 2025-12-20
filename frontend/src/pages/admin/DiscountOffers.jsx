import { useState, useEffect } from 'react';
import AdminHeader from '../../components/AdminHeader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const DiscountOffers = () => {
  const [offers, setOffers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [coupons, setCoupons] = useState([]);
  const [currentCouponIndex, setCurrentCouponIndex] = useState(0);
  const [showCoupons, setShowCoupons] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    discountPercentage: 10,
    startDate: '',
    endDate: '',
    availableOn: 'both', // 'both', 'sales', 'website'
    active: true,
  });

  useEffect(() => {
    fetchOffers();
  }, []);

  useEffect(() => {
    if (offers.length > 0 && currentIndex >= 0 && currentIndex < offers.length) {
      loadOffer(offers[currentIndex]);
      loadCouponsForOffer(offers[currentIndex].id);
    }
  }, [currentIndex]);

  const fetchOffers = () => {
    const stored = localStorage.getItem('discountOffers');
    if (stored) {
      const parsed = JSON.parse(stored);
      setOffers(parsed.filter(o => !o.archived));
      if (parsed.length > 0) {
        setCurrentIndex(0);
      }
    } else {
      handleNew();
    }
  };

  const loadOffer = (offer) => {
    setFormData({
      name: offer.name || '',
      discountPercentage: offer.discountPercentage || 10,
      startDate: offer.startDate || offer.validFrom || '',
      endDate: offer.endDate || offer.validTo || '',
      availableOn: offer.availableOn || 
        (offer.availableOnSales && offer.availableOnWebsite ? 'both' :
         offer.availableOnSales ? 'sales' : 'website'),
      active: offer.active !== undefined ? offer.active : true,
    });
  };

  const loadCouponsForOffer = (offerId) => {
    const stored = localStorage.getItem('couponCodes');
    if (stored) {
      const allCoupons = JSON.parse(stored);
      const offerCoupons = allCoupons.filter(c => c.discountOfferId === offerId);
      setCoupons(offerCoupons);
      setCurrentCouponIndex(0);
      setShowCoupons(false);
    } else {
      setCoupons([]);
      setShowCoupons(false);
    }
  };

  const handleNew = () => {
    setFormData({
      name: '',
      discountPercentage: 10,
      startDate: '',
      endDate: '',
      availableOn: 'both',
      active: true,
    });
    setCurrentIndex(-1);
    setCoupons([]);
    setShowCoupons(false);
  };

  const handleSave = () => {
    const stored = localStorage.getItem('discountOffers');
    let allOffers = stored ? JSON.parse(stored) : [];

    const offerToSave = {
      id: currentIndex === -1 ? Date.now() : offers[currentIndex].id,
      name: formData.name,
      discountPercentage: formData.discountPercentage,
      startDate: formData.startDate,
      endDate: formData.endDate,
      validFrom: formData.startDate,
      validTo: formData.endDate,
      availableOn: formData.availableOn,
      availableOnSales: formData.availableOn === 'both' || formData.availableOn === 'sales',
      availableOnWebsite: formData.availableOn === 'both' || formData.availableOn === 'website',
      active: formData.active,
    };

    if (currentIndex === -1) {
      allOffers.push(offerToSave);
    } else {
      allOffers = allOffers.map(o => o.id === offerToSave.id ? offerToSave : o);
    }

    localStorage.setItem('discountOffers', JSON.stringify(allOffers));
    fetchOffers();
  };

  const handleGenerateCoupon = () => {
    const code = prompt('Enter coupon code:');
    if (code && offers[currentIndex]) {
      const stored = localStorage.getItem('couponCodes');
      let allCoupons = stored ? JSON.parse(stored) : [];

      const newCoupon = {
        id: Date.now(),
        discountOfferId: offers[currentIndex].id,
        code: code.toUpperCase(),
        used: false,
        usedAt: null,
      };

      allCoupons.push(newCoupon);
      localStorage.setItem('couponCodes', JSON.stringify(allCoupons));
      loadCouponsForOffer(offers[currentIndex].id);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < offers.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handleCouponPrevious = () => {
    if (currentCouponIndex > 0) setCurrentCouponIndex(currentCouponIndex - 1);
  };

  const handleCouponNext = () => {
    if (currentCouponIndex < coupons.length - 1) setCurrentCouponIndex(currentCouponIndex + 1);
  };

  const isNew = currentIndex === -1;
  const currentCoupon = coupons[currentCouponIndex];

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      
      <main className="container px-6 py-8">
        {/* Header with New, Generate Coupon, and Coupons Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button onClick={handleNew} variant="outline">
              New
            </Button>
            {!isNew && (
              <Button onClick={handleGenerateCoupon} variant="outline">
                Generate Coupon Codes
              </Button>
            )}
          </div>
          
          {!isNew && coupons.length > 0 && (
            <div className="flex items-center gap-4">
              <Button
                variant={showCoupons ? 'default' : 'outline'}
                onClick={() => {
                  setShowCoupons(!showCoupons);
                  if (!showCoupons && coupons.length > 0) {
                    setCurrentCouponIndex(0);
                  }
                }}
              >
                Coupons {coupons.length}
              </Button>
              {showCoupons && coupons.length > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCouponPrevious}
                    disabled={currentCouponIndex <= 0}
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </Button>
                  <span className="text-sm text-muted-foreground min-w-[60px] text-center">
                    {currentCouponIndex + 1} / {coupons.length}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCouponNext}
                    disabled={currentCouponIndex >= coupons.length - 1}
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </>
              )}
            </div>
          )}

          {offers.length > 0 && !showCoupons && (
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
                {isNew ? 'New Offer' : `${currentIndex + 1} / ${offers.length}`}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                disabled={currentIndex >= offers.length - 1}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          )}
        </div>

        <Card className="p-8">
          {showCoupons && currentCoupon ? (
            <>
              <h1 className="text-2xl font-bold mb-6">Coupon Details</h1>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Code</label>
                  <p className="text-2xl font-mono font-bold">{currentCoupon.code}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <p className={`inline-block px-3 py-1 rounded-full text-sm ${
                    currentCoupon.used
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {currentCoupon.used ? 'Used' : 'Unused'}
                  </p>
                </div>
                {currentCoupon.usedAt && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Used At</label>
                    <p>{new Date(currentCoupon.usedAt).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-6">Offers</h1>

              <div className="space-y-6 max-w-2xl">
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="10% Discount Coupons"
                  />
                </div>

                {/* Discount Percentage */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Discount Percentage</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.01"
                      className="w-32"
                      value={formData.discountPercentage}
                      onChange={(e) => setFormData({ ...formData, discountPercentage: parseFloat(e.target.value) || 0 })}
                    />
                    <span>%</span>
                  </div>
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>

                {/* Available On */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Available On</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.availableOn}
                    onChange={(e) => setFormData({ ...formData, availableOn: e.target.value })}
                  >
                    <option value="both">Both</option>
                    <option value="sales">Sales</option>
                    <option value="website">Website</option>
                  </select>
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
            </>
          )}
        </Card>
      </main>
    </div>
  );
};

export default DiscountOffers;
