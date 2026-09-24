// models/payment.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  method: {
    type: DataTypes.ENUM('MOMO', 'ZALOPAY', 'BANK_TRANSFER', 'CASH'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'SUCCESS', 'FAILED'),
    allowNull: false,
    defaultValue: 'PENDING',
  },
  transaction_code: {
    type: DataTypes.STRING,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  enrollment_id: {
    type: DataTypes.INTEGER,
  }
}, {
  tableName: 'payments',
  timestamps: true,
  createdAt: 'payment_date',
  updatedAt: 'updated_at'
});

module.exports = Payment;