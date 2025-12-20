const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,               // matches UUID column
    defaultValue: DataTypes.UUIDV4,     // uses uuid_generate_v4() equivalent at ORM level [web:5][web:19]
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('internal', 'portal'), // matches CHECK constraint on role [web:16]
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mobile: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  address_city: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  address_state: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  address_pincode: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
}, {
  tableName: 'users',
  // use snake_case timestamps created_at / updated_at to match existing schema [web:3][web:18][web:15]
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = User;
