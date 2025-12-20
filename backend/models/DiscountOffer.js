const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * DiscountOffer Model
 * Defines discount offers that can be applied to sale orders
 * Can be available on Sales (manual orders) or Website (online orders) or both
 */
const DiscountOffer = sequelize.define('DiscountOffer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Discount offer name',
  },
  discountPercentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Discount percentage (e.g., 10.00 for 10%)',
  },
  validFrom: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: 'Offer validity start date',
  },
  validTo: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: 'Offer validity end date',
  },
  availableOnSales: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Available on manual sale orders',
  },
  availableOnWebsite: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Available on website orders',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'discount_offers',
  timestamps: true,
});

module.exports = DiscountOffer;

