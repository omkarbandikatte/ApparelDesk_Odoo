const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * CustomerInvoice Model
 * Generated from confirmed sale orders
 * When invoice is confirmed, stock is reduced
 * Status: draft, confirmed, paid, cancelled
 */
const CustomerInvoice = sequelize.define('CustomerInvoice', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  invoiceNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'Unique invoice number (e.g., INV-001)',
  },
  saleOrderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'sale_orders',
      key: 'id',
    },
    comment: 'Source sale order',
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
  },
  invoiceDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'Invoice date',
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: 'Payment due date',
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  taxAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  paidAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Total amount paid so far',
  },
  status: {
    type: DataTypes.ENUM('draft', 'confirmed', 'paid', 'cancelled'),
    allowNull: false,
    defaultValue: 'draft',
  },
  stockReduced: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Whether stock has been reduced (happens on confirmation)',
  },
}, {
  tableName: 'customer_invoices',
  timestamps: true,
});

module.exports = CustomerInvoice;

