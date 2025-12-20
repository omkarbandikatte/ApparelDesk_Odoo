const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4, // uuid_generate_v4() equivalent at ORM level [web:5]
  },
  product_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  product_category: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  product_type: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  material: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  colors: {
    type: DataTypes.ARRAY(DataTypes.TEXT), // TEXT[] in Postgres [web:19][web:288]
    allowNull: true,
  },
  current_stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  sales_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  sales_tax: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
  },
  purchase_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  purchase_tax: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
  },
  published: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.TEXT), // TEXT[] for image URLs/paths [web:288][web:296]
    allowNull: true,
  },
}, {
  tableName: 'products',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at', // map to existing snake_case columns [web:15][web:291]
});

module.exports = Product;
