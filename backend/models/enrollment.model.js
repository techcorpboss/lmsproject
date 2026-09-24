// models/enrollment.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Enrollment = sequelize.define('Enrollment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED'),
    allowNull: false,
    defaultValue: 'PENDING',
  },
  progress: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
  },
  user_id: { // Foreign key
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  course_id: { // Foreign key
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  tableName: 'enrollments',
  timestamps: true,
  createdAt: 'enrollment_date',
  updatedAt: false, // Thường không cần update timestamp cho enrollment
});

module.exports = Enrollment;