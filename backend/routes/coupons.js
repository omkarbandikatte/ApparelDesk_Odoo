const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const couponAdminController = require('../controllers/couponAdminController');
const { authenticate, requireAdmin } = require('../middlewares/auth');

// Customer routes
router.post('/validate', authenticate, couponController.validateCoupon);
router.post('/use', authenticate, couponController.useCoupon);
router.get('/mine', authenticate, couponAdminController.getCustomerCoupons);

// Admin routes
router.post('/generate', authenticate, requireAdmin, couponAdminController.generateCoupons);
router.get('/admin', authenticate, requireAdmin, couponAdminController.getAllCoupons);
router.post('/assign', authenticate, requireAdmin, couponAdminController.assignCouponToCustomer);


module.exports = router;
