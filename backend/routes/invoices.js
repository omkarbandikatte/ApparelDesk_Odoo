const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const { authenticate, requireAdmin } = require('../middlewares/auth');

// Customer routes (my invoices)
router.get('/my-invoices', authenticate, invoiceController.getInvoices);
router.get('/:id', authenticate, invoiceController.getInvoice);

// Admin routes
router.get('/', authenticate, requireAdmin, invoiceController.getInvoices);
router.post('/generate', authenticate, requireAdmin, invoiceController.generateInvoice);
router.post('/:id/confirm', authenticate, requireAdmin, invoiceController.confirmInvoice);
router.post('/:id/payment', authenticate, requireAdmin, invoiceController.recordPayment);

module.exports = router;

