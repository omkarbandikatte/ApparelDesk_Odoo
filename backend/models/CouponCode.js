const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * CouponCode Model
 * Represents coupon codes generated from discount offers
 * Can be assigned to specific customers or be general use
 * Tracks usage status
 */
const CouponCode = sequelize.define('CouponCode', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  discountOfferId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'discount_offers',
      key: 'id',
    },
    comment: 'Links to the discount offer',
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'Coupon code (e.g., "SAVE10")',
  },
  contactId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'contacts',
      key: 'id',
    },
    comment: 'If assigned to specific customer, otherwise null for general use',
  },
  used: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Whether coupon has been used',
  },
  usedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Date when coupon was used',
  },
}, {
  tableName: 'coupon_codes',
  timestamps: true,
});

module.exports = CouponCode;

