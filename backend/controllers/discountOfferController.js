const { DiscountOffer } = require('../models');
const { Op } = require('sequelize');

// Get all discount offers (admin only)
const getDiscountOffers = async (req, res) => {
  try {
    const { active } = req.query;
    const where = {};

    if (active === 'true') {
      const now = new Date();
      where[Op.and] = [
        { start_date: { [Op.lte]: now } },
        { end_date: { [Op.gte]: now } },
      ];
    } else if (active === 'false') {
      where[Op.or] = [
        { start_date: { [Op.gt]: new Date() } },
        { end_date: { [Op.lt]: new Date() } },
      ];
    }

    const offers = await DiscountOffer.findAll({
      where,
      order: [['start_date', 'ASC'], ['created_at', 'DESC']],
    });

    const transformed = offers.map(offer => ({
      id: offer.id,
      name: offer.name,
      discountPercentage: parseFloat(offer.discount_percentage),
      startDate: offer.start_date,
      endDate: offer.end_date,
      availableOn: offer.available_on,
      isActive: new Date(offer.start_date) <= new Date() && 
                new Date(offer.end_date) >= new Date(),
      durationDays: Math.ceil(
        (new Date(offer.end_date) - new Date(offer.start_date)) / (1000 * 60 * 60 * 24)
      ),
      createdAt: offer.created_at,
    }));

    res.json({
      success: true,
      offers: transformed,
    });
  } catch (error) {
    console.error('Get discount offers error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch discount offers',
    });
  }
};

// Get single discount offer
const getDiscountOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await DiscountOffer.findByPk(id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        error: 'Discount offer not found',
      });
    }

    const transformed = {
      id: offer.id,
      name: offer.name,
      discountPercentage: parseFloat(offer.discount_percentage),
      startDate: offer.start_date,
      endDate: offer.end_date,
      availableOn: offer.available_on,
      isActive: new Date(offer.start_date) <= new Date() && 
                new Date(offer.end_date) >= new Date(),
      durationDays: Math.ceil(
        (new Date(offer.end_date) - new Date(offer.start_date)) / (1000 * 60 * 60 * 24)
      ),
    };

    res.json({
      success: true,
      offer: transformed,
    });
  } catch (error) {
    console.error('Get discount offer error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch discount offer',
    });
  }
};

// Create discount offer (admin only)
const createDiscountOffer = async (req, res) => {
  try {
    const {
      name,
      discountPercentage,
      startDate,
      endDate,
      availableOn,
    } = req.body;

    // Validation
    if (!name || !discountPercentage || !startDate || !endDate || !availableOn) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required',
      });
    }

    if (!['sales', 'website'].includes(availableOn)) {
      return res.status(400).json({
        success: false,
        error: 'availableOn must be "sales" or "website"',
      });
    }

    if (parseFloat(discountPercentage) <= 0 || parseFloat(discountPercentage) > 100) {
      return res.status(400).json({
        success: false,
        error: 'Discount percentage must be between 0 and 100',
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      return res.status(400).json({
        success: false,
        error: 'Start date must be before end date',
      });
    }

    const offer = await DiscountOffer.create({
      name,
      discount_percentage: parseFloat(discountPercentage),
      start_date: startDate, // YYYY-MM-DD format
      end_date: endDate,
      available_on: availableOn,
    });

    res.status(201).json({
      success: true,
      message: 'Discount offer created successfully',
      offer: {
        id: offer.id,
        name: offer.name,
        discountPercentage: parseFloat(offer.discount_percentage),
        startDate: offer.start_date,
        endDate: offer.end_date,
        availableOn: offer.available_on,
      },
    });
  } catch (error) {
    console.error('Create discount offer error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create discount offer',
    });
  }
};

// Update discount offer (admin only)
const updateDiscountOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const offer = await DiscountOffer.findByPk(id);
    if (!offer) {
      return res.status(404).json({
        success: false,
        error: 'Discount offer not found',
      });
    }

    // Basic validation
    if (updateData.discountPercentage && 
        (parseFloat(updateData.discountPercentage) <= 0 || 
         parseFloat(updateData.discountPercentage) > 100)) {
      return res.status(400).json({
        success: false,
        error: 'Discount percentage must be between 0 and 100',
      });
    }

    if (updateData.availableOn && !['sales', 'website'].includes(updateData.availableOn)) {
      return res.status(400).json({
        success: false,
        error: 'availableOn must be "sales" or "website"',
      });
    }

    await offer.update({
      name: updateData.name ?? offer.name,
      discount_percentage: updateData.discountPercentage !== undefined 
        ? parseFloat(updateData.discountPercentage) 
        : offer.discount_percentage,
      start_date: updateData.startDate ?? offer.start_date,
      end_date: updateData.endDate ?? offer.end_date,
      available_on: updateData.availableOn ?? offer.available_on,
    });

    await offer.reload();

    res.json({
      success: true,
      message: 'Discount offer updated successfully',
      offer: {
        id: offer.id,
        name: offer.name,
        discountPercentage: parseFloat(offer.discount_percentage),
        startDate: offer.start_date,
        endDate: offer.end_date,
        availableOn: offer.available_on,
      },
    });
  } catch (error) {
    console.error('Update discount offer error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update discount offer',
    });
  }
};

// Delete discount offer (admin only) - cascades to coupons
const deleteDiscountOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await DiscountOffer.findByPk(id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        error: 'Discount offer not found',
      });
    }

    // Delete cascades to CouponCode due to ON DELETE CASCADE
    await offer.destroy();

    res.json({
      success: true,
      message: 'Discount offer deleted successfully (all related coupons also deleted)',
    });
  } catch (error) {
    console.error('Delete discount offer error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete discount offer',
    });
  }
};

module.exports = {
  getDiscountOffers,
  getDiscountOffer,
  createDiscountOffer,
  updateDiscountOffer,
  deleteDiscountOffer,
};
