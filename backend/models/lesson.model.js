// models/lesson.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Lesson = sequelize.define('Lesson', {
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
  video_url: {
    type: DataTypes.STRING,
  },
  lesson_order: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('VIDEO', 'TEXT', 'QUIZ'),
    defaultValue: 'VIDEO',
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  tableName: 'lessons',
  timestamps: false,
});

module.exports = Lesson;