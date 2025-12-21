const { CouponCode, DiscountOffer, Contact } = require('../models');
const sequelize = require('sequelize');

// Validate coupon code
const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ 
        success: false, 
        error: 'Coupon code is required' 
      });
    }

    // Find coupon with discount offer (status must be 'unused')
    const coupon = await CouponCode.findOne({
      where: {
        code: code.toUpperCase(),
        status: 'unused', // new status field [web:16]
      },
      include: [{
        model: DiscountOffer,
        required: true, // only coupons with valid offers
      }],
    });

    if (!coupon || !coupon.DiscountOffer) {
      return res.json({
        success: true,
        valid: false,
        message: 'Invalid or expired coupon code',
      });
    }

    const discountOffer = coupon.DiscountOffer;
    const now = new Date();

    // Check if offer is active (date range + available_on)
    const isOfferActive = 
      new Date(discountOffer.start_date) <= now &&
      new Date(discountOffer.end_date) >= now &&
      discountOffer.available_on === 'website'; // only website coupons [web:102]

    if (!isOfferActive) {
      return res.json({
        success: true,
        valid: false,
        message: 'Coupon code is expired or not available on website',
      });
    }

    // Check if coupon is assigned to specific customer
    if (coupon.contact_id && req.user) {
      // Find customer's contact via user_id FK
      const customerContact = await Contact.findOne({ 
        where: { user_id: req.user.id } 
      });
      
      if (!customerContact || coupon.contact_id !== customerContact.id) {
        return res.json({
          success: true,
          valid: false,
          message: 'This coupon is not valid for your account',
        });
      }
    }

    // Check if coupon is expired (individual expiration)
    if (coupon.expiration_date && new Date(coupon.expiration_date) < now) {
      return res.json({
        success: true,
        valid: false,
        message: 'Coupon has expired',
      });
    }

    res.json({
      success: true,
      valid: true,
      couponId: coupon.id, // for later marking as used
      discountPercentage: parseFloat(discountOffer.discount_percentage),
      discountAmount: 0, // calculated frontend based on subtotal
      message: `Coupon applied! ${discountOffer.discount_percentage}% discount`,
      expiresAt: coupon.expiration_date, // inform user
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to validate coupon' 
    });
  }
};

// Mark coupon as used (call after successful order)
const useCoupon = async (req, res) => {
  try {
    const { couponId } = req.body;
    const userId = req.user.id;

    if (!couponId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Coupon ID is required' 
      });
    }

    const coupon = await CouponCode.findByPk(couponId, {
      include: [DiscountOffer],
    });

    if (!coupon) {
      return res.status(404).json({ 
        success: false, 
        error: 'Coupon not found' 
      });
    }

    // Verify coupon is still valid and belongs to user
    if (coupon.status !== 'unused') {
      return res.status(400).json({ 
        success: false, 
        error: 'Coupon already used' 
      });
    }

    // Check contact assignment
    if (coupon.contact_id) {
      const customerContact = await Contact.findOne({ 
        where: { user_id: userId } 
      });
      if (!customerContact || coupon.contact_id !== customerContact.id) {
        return res.status(403).json({ 
          success: false, 
          error: 'Not authorized to use this coupon' 
        });
      }
    }

    // Mark as used
    await coupon.update({
      status: 'used',
      // updated_at auto-handled
    });

    res.json({ 
      success: true, 
      message: 'Coupon marked as used successfully' 
    });
  } catch (error) {
    console.error('Use coupon error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to mark coupon as used' 
    });
  }
};


module.exports = {
  validateCoupon,
  useCoupon,
};
