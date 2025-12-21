const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * CouponCode Model
 * Represents coupon codes generated from discount offers
 * Can be assigned to specific customers or be general use
 * Tracks usage status with expiration
 */
const CouponCode = sequelize.define('CouponCode', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4, // uuid_generate_v4() equivalent [web:5]
  },
  discount_offer_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'discount_offers',
      key: 'id',
    },
    onDelete: 'CASCADE', // matches ON DELETE CASCADE [web:56]
    comment: 'Links to the discount offer',
  },
  code: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    comment: 'Coupon code (e.g., "SAVE10")',
  },
  expiration_date: {
    type: DataTypes.DATEONLY, // DATE in Postgres [web:19]
    allowNull: true,
    comment: 'Coupon expiration date',
  },
  status: {
    type: DataTypes.ENUM('unused', 'used'),
    allowNull: false,
    defaultValue: 'unused',
    comment: 'Coupon status: unused or used',
  },
  contact_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'contacts',
      key: 'id',
    },
    onDelete: 'SET NULL', // matches ON DELETE SET NULL [web:56]
    comment: 'If assigned to specific customer, otherwise null for general use',
  },
}, {
  tableName: 'coupon_codes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at', // snake_case timestamps [web:15][web:291]
});

module.exports = CouponCode;
