const { CouponCode, DiscountOffer } = require('../models');

// Validate coupon code
const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, error: 'Coupon code is required' });
    }

    const coupon = await CouponCode.findOne({
      where: {
        code: code.toUpperCase(),
        used: false,
      },
      include: [{
        model: DiscountOffer,
        as: 'discountOffer',
      }],
    });

    if (!coupon || !coupon.discountOffer) {
      return res.json({
        success: true,
        valid: false,
        message: 'Invalid or expired coupon code',
      });
    }

    const discountOffer = coupon.discountOffer;
    const now = new Date();

    // Check if offer is valid
    if (
      new Date(discountOffer.validFrom) > now ||
      new Date(discountOffer.validTo) < now ||
      !discountOffer.isActive ||
      !discountOffer.availableOnWebsite
    ) {
      return res.json({
        success: true,
        valid: false,
        message: 'Coupon code is expired or not available',
      });
    }

    // Check if coupon is assigned to specific customer
    if (coupon.contactId && req.user) {
      const { Contact } = require('../models');
      const contact = await Contact.findOne({ where: { userId: req.user.id } });
      if (contact && coupon.contactId !== contact.id) {
        return res.json({
          success: true,
          valid: false,
          message: 'This coupon is not valid for your account',
        });
      }
    }

    res.json({
      success: true,
      valid: true,
      discountPercentage: parseFloat(discountOffer.discountPercentage),
      discountAmount: 0, // Will be calculated on frontend based on subtotal
      message: `Coupon applied! ${discountOffer.discountPercentage}% discount`,
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({ success: false, error: 'Failed to validate coupon' });
  }
};

module.exports = {
  validateCoupon,
};

