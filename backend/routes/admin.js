const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, requireAdmin } = require('../middlewares/auth');

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// Dashboard
router.get('/dashboard/kpis', adminController.getDashboardKPIs);

// Payments
router.get('/payments', adminController.getPayments);

// Purchase Orders
router.get('/purchase-orders', adminController.getPurchaseOrders);
router.post('/purchase-orders', adminController.createPurchaseOrder);
router.put('/purchase-orders/:id/status', adminController.updatePurchaseOrderStatus);

// Vendor Bills
router.get('/vendor-bills', adminController.getVendorBills);
router.post('/vendor-bills/generate', adminController.generateVendorBill);
router.post('/vendor-bills/:id/confirm', adminController.confirmVendorBill);
router.post('/vendor-bills/:id/payment', adminController.recordVendorBillPayment);

// Payment Terms
router.get('/payment-terms', adminController.getPaymentTerms);
router.post('/payment-terms', adminController.createPaymentTerm);
router.put('/payment-terms/:id', adminController.updatePaymentTerm);

// Discount Offers
router.get('/discount-offers', adminController.getDiscountOffers);
router.post('/discount-offers', adminController.createDiscountOffer);
router.put('/discount-offers/:id', adminController.updateDiscountOffer);
router.post('/discount-offers/generate-coupons', adminController.generateCouponCodes);

// Reports
router.get('/reports/:reportType', adminController.getReports);

module.exports = router;

