const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * PurchaseOrderLine Model
 * Represents individual line items in a purchase order
 */
const PurchaseOrderLine = sequelize.define('PurchaseOrderLine', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  purchaseOrderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'purchase_orders',
      key: 'id',
    },
    comment: 'Parent purchase order',
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id',
    },
    comment: 'Product in this line',
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Unit price at time of order',
  },
  taxRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
  },
  lineTotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  taxAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: 'purchase_order_lines',
  timestamps: true,
});

module.exports = PurchaseOrderLine;

