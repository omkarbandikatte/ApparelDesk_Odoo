const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * DiscountOffer Model
 * Defines discount offers that can be applied to sale orders
 * Available on 'sales' (manual orders) or 'website' (online orders)
 */
const DiscountOffer = sequelize.define('DiscountOffer', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4, // uuid_generate_v4() equivalent [web:5]
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Discount offer name',
  },
  discount_percentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    comment: 'Discount percentage (e.g., 10.00 for 10%)',
  },
  start_date: {
    type: DataTypes.DATEONLY, // DATE in Postgres [web:19]
    allowNull: false,
    comment: 'Offer validity start date',
  },
  end_date: {
    type: DataTypes.DATEONLY, // DATE in Postgres [web:19]
    allowNull: false,
    comment: 'Offer validity end date',
  },
  available_on: {
    type: DataTypes.ENUM('sales', 'website'),
    allowNull: false,
    comment: 'Available on: sales (manual orders) or website (online orders)',
  },
}, {
  tableName: 'discount_offers',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at', // snake_case timestamps [web:15][web:291]
});

module.exports = DiscountOffer;
