const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Product Model
 * Represents products in the system
 * Used in both sales and purchases
 */
const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Product category (e.g., Shirts, Pants, Shoes)',
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Product type (e.g., T-Shirt, Jeans)',
  },
  material: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Material (e.g., Cotton, Polyester)',
  },
  colors: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Comma-separated colors (e.g., "Red,Blue,Green")',
  },
  sizes: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Comma-separated sizes (e.g., "S,M,L,XL")',
  },
  salesPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Selling price to customers',
  },
  purchasePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Purchase price from vendors',
  },
  taxRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Tax rate percentage (e.g., 18.00 for 18%)',
  },
  stockQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Current stock quantity',
  },
  published: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Whether product is visible on website',
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Main product image URL',
  },
}, {
  tableName: 'products',
  timestamps: true,
});

module.exports = Product;

