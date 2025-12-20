const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * PaymentTerm Model
 * Defines payment terms for sale orders and invoices
 * Examples: Immediate Payment, Net 30, Net 60
 * Supports early payment discounts
 */
const PaymentTerm = sequelize.define('PaymentTerm', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Payment term name (e.g., "Immediate Payment", "Net 30")',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  days: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Number of days until payment is due',
  },
  earlyPaymentDiscount: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Early payment discount percentage',
  },
  discountDays: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Number of days within which discount applies',
  },
  discountComputation: {
    type: DataTypes.ENUM('base', 'total'),
    allowNull: false,
    defaultValue: 'base',
    comment: 'Whether discount is computed on base amount or total amount',
  },
}, {
  tableName: 'payment_terms',
  timestamps: true,
});

module.exports = PaymentTerm;

