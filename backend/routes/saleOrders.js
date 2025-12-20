const express = require('express');
const router = express.Router();
const saleOrderController = require('../controllers/saleOrderController');
const { authenticate, requireAdmin } = require('../middlewares/auth');

// Customer routes (my orders)
router.get('/my-orders', authenticate, saleOrderController.getSaleOrders);

// Admin routes
router.get('/', authenticate, requireAdmin, saleOrderController.getSaleOrders);
router.get('/:id', authenticate, saleOrderController.getSaleOrder);
router.post('/', authenticate, saleOrderController.createSaleOrder);
router.put('/:id/status', authenticate, requireAdmin, saleOrderController.updateSaleOrderStatus);

module.exports = router;

