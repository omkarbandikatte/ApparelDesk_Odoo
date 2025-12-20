const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * SaleOrderLine Model
 * Represents individual line items in a sale order
 * Each line has a product, quantity, price, and tax
 */
const SaleOrderLine = sequelize.define('SaleOrderLine', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  saleOrderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'sale_orders',
      key: 'id',
    },
    comment: 'Parent sale order',
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
    comment: 'Quantity ordered',
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
    comment: 'Tax rate for this line',
  },
  lineTotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Line total (quantity * unitPrice)',
  },
  taxAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Tax amount for this line',
  },
}, {
  tableName: 'sale_order_lines',
  timestamps: true,
});

module.exports = SaleOrderLine;

