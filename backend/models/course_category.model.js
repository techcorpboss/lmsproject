// models/course_category.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CourseCategory = sequelize.define('CourseCategory', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'course_categories',
  timestamps: false, // Bảng này không cần timestamps
});

module.exports = CourseCategory;