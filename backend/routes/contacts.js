const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authenticate, requireAdmin } = require('../middlewares/auth');

// Admin routes
router.get('/', authenticate, requireAdmin, contactController.getContacts);
router.get('/:id', authenticate, requireAdmin, contactController.getContact);
router.post('/', authenticate, requireAdmin, contactController.createContact);
router.put('/:id', authenticate, requireAdmin, contactController.updateContact);
router.delete('/:id', authenticate, requireAdmin, contactController.deleteContact);

module.exports = router;

