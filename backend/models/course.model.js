// models/course.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  thumbnail: {
    type: DataTypes.STRING,
    defaultValue: 'default_thumbnail.png',
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  level: {
    type: DataTypes.ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS'),
    defaultValue: 'ALL_LEVELS',
  },
  category_id: {
    type: DataTypes.INTEGER,
  }
}, {
  tableName: 'courses',
  timestamps: true,
});

module.exports = Course;