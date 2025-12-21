const { DiscountOffer, CouponCode, Contact } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// Generate coupons from discount offer (admin only)
const generateCoupons = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { discountOfferId, quantity, assignToContactId } = req.body;
    
    if (!discountOfferId || !quantity || quantity <= 0) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        error: 'discountOfferId and valid quantity are required',
      });
    }

    const discountOffer = await DiscountOffer.findByPk(discountOfferId, { transaction: t });
    if (!discountOffer) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        error: 'Discount offer not found',
      });
    }

    const generatedCoupons = [];
    
    // FIXED: Safe percentage extraction
    const percentageNum = Number(discountOffer.discount_percentage);
    if (isNaN(percentageNum) || percentageNum <= 0) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        error: 'Invalid discount percentage in offer',
      });
    }
    
    const percentageStr = percentageNum.toFixed(0); // Now safe!

    // Generate unique codes
    for (let i = 0; i < quantity; i++) {
      let code;
      let unique = false;
      
      while (!unique) {
        code = `SAVE${percentageStr}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
        
        const exists = await CouponCode.findOne({ 
          where: { code }, 
          transaction: t 
        });
        unique = !exists;
      }

      const coupon = await CouponCode.create({
        discount_offer_id: discountOfferId,
        code,
        expiration_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        contact_id: assignToContactId || null,
      }, { transaction: t });
      
      generatedCoupons.push({
        id: coupon.id,
        code: coupon.code,
        assignedTo: assignToContactId ? 'Specific customer' : 'General use',
      });
    }

    await t.commit();
    
    res.status(201).json({
      success: true,
      message: `Generated ${quantity} coupons for ${percentageStr}% discount`,
      coupons: generatedCoupons,
    });
  } catch (error) {
    await t.rollback();
    console.error('Generate coupons error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate coupons',
    });
  }
};


// 2. Get all coupons (admin dashboard)
const getAllCoupons = async (req, res) => {
  try {
    const { status, contactId } = req.query;
    const where = {};

    if (status) where.status = status;
    
    const coupons = await CouponCode.findAll({
      where,
      include: [
        { 
          model: DiscountOffer, 
          attributes: ['name', 'discount_percentage'] 
        },
        { 
          model: Contact, 
          attributes: ['name', 'email'],
          required: false 
        },
      ],
      order: [['created_at', 'DESC']],
    });

    // FIXED: Safe navigation for associations
    const transformed = coupons.map(coupon => ({
      id: coupon.id,
      code: coupon.code,
      status: coupon.status,
      discount: coupon.DiscountOffer 
        ? `${coupon.DiscountOffer.discount_percentage}% - ${coupon.DiscountOffer.name}`
        : 'N/A',
      expires: coupon.expiration_date,
      assignedTo: coupon.Contact 
        ? `${coupon.Contact.name} (${coupon.Contact.email})` 
        : 'General',
      createdAt: coupon.created_at,
    }));

    res.json({
      success: true,
      coupons: transformed,
    });
  } catch (error) {
    console.error('Get coupons error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch coupons',
    });
  }
};

// 3. Get coupons for current customer
const getCustomerCoupons = async (req, res) => {
  try {
    const customerContact = await Contact.findOne({
      where: { user_id: req.user.id },
    });

    if (!customerContact) {
      return res.json({ success: true, coupons: [] });
    }

    const coupons = await CouponCode.findAll({
      where: {
        contact_id: customerContact.id,
        status: 'unused',
        [Op.or]: [
          { expiration_date: null },
          { expiration_date: { [Op.gte]: new Date() } },
        ],
      },
      include: [DiscountOffer],
      order: [['created_at', 'DESC']],
    });

    // FIXED: Safe navigation for DiscountOffer
    res.json({
      success: true,
      coupons: coupons.map(c => ({
        code: c.code,
        discount: c.DiscountOffer 
          ? `${c.DiscountOffer.discount_percentage}%`
          : 'N/A',
        expires: c.expiration_date,
      })),
    });
  } catch (error) {
    console.error('Get customer coupons error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch your coupons',
    });
  }
};
// Assign existing coupon to specific customer
const assignCouponToCustomer = async (req, res) => {
  try {
    const { couponId, contactId } = req.body;

    if (!couponId || !contactId) {
      return res.status(400).json({
        success: false,
        error: 'couponId and contactId are required',
      });
    }

    const coupon = await CouponCode.findByPk(couponId);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        error: 'Coupon not found',
      });
    }

    const contact = await Contact.findByPk(contactId);
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found',
      });
    }

    // Check if already used
    if (coupon.status === 'used') {
      return res.status(400).json({
        success: false,
        error: 'Cannot assign already used coupon',
      });
    }

    await coupon.update({
      contact_id: contactId,
    });

    res.json({
      success: true,
      message: `Coupon ${coupon.code} assigned to ${contact.name}`,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        assignedTo: `${contact.name} (${contact.email})`,
      },
    });
  } catch (error) {
    console.error('Assign coupon error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to assign coupon',
    });
  }
};


module.exports = {
  generateCoupons,
  getAllCoupons,
  getCustomerCoupons,
  assignCouponToCustomer
};
