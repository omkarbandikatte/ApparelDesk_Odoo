const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * SaleOrder Model
 * Represents customer sale orders
 * Can be created from website (cart) or manually by admin
 * Website orders have paymentTerm = "Immediate Payment"
 * Status: draft, confirmed, cancelled
 */
const SaleOrder = sequelize.define('SaleOrder', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  orderNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'Unique order number (e.g., SO-001)',
  },
  contactId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'contacts',
      key: 'id',
    },
    comment: 'Customer contact',
  },
  paymentTermId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'payment_terms',
      key: 'id',
    },
    comment: 'Payment terms for this order',
  },
  couponCodeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'coupon_codes',
      key: 'id',
    },
    comment: 'Applied coupon code if any',
  },
  discountPercentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Applied discount percentage',
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Subtotal before tax and discount',
  },
  taxAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Total tax amount',
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Total discount amount',
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Final total amount',
  },
  status: {
    type: DataTypes.ENUM('draft', 'confirmed', 'cancelled'),
    allowNull: false,
    defaultValue: 'draft',
  },
  source: {
    type: DataTypes.ENUM('website', 'manual'),
    allowNull: false,
    defaultValue: 'manual',
    comment: 'Whether order came from website or was created manually',
  },
}, {
  tableName: 'sale_orders',
  timestamps: true,
});

module.exports = SaleOrder;

