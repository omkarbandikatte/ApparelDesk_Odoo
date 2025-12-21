const express = require('express');
const router = express.Router();
const discountOfferController = require('../controllers/discountOfferController');
const { authenticate, requireAdmin } = require('../middlewares/auth');

// Public: Get active offers (for frontend display)
router.get('/', discountOfferController.getDiscountOffers);

// Admin CRUD
router.get('/:id', authenticate, requireAdmin, discountOfferController.getDiscountOffer);
router.post('/', authenticate, requireAdmin, discountOfferController.createDiscountOffer);
router.put('/:id', authenticate, requireAdmin, discountOfferController.updateDiscountOffer);
router.delete('/:id', authenticate, requireAdmin, discountOfferController.deleteDiscountOffer);

module.exports = router;
