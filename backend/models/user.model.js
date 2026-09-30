// models/user.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  // Model attributes are defined here
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  full_name: {
    type: DataTypes.STRING,
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
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'student',
  },
  avatar: { type: DataTypes.STRING(255) },
  faculty_id: { type: DataTypes.STRING(50) },
  faculty_name: { type: DataTypes.STRING(150) },
  department: { type: DataTypes.STRING(150) },
  title: { type: DataTypes.STRING(50) },
  student_code: { type: DataTypes.STRING(50) },
  class_name: { type: DataTypes.STRING(50) },
  cohort: { type: DataTypes.STRING(50) },
  two_factor_enabled: { type: DataTypes.BOOLEAN, defaultValue: false },
  two_factor_secret: { type: DataTypes.STRING(255), allowNull: true },
  two_factor_backup_codes: { type: DataTypes.JSON, allowNull: true },
  two_factor_enforced: { type: DataTypes.BOOLEAN, defaultValue: false },
  failed_login_attempts: { type: DataTypes.INTEGER, defaultValue: 0 },
  locked_until: { type: DataTypes.DATE, allowNull: true },
  last_login_at: { type: DataTypes.DATE, allowNull: true },
  last_login_ip: { type: DataTypes.STRING(50), allowNull: true }
}, {
  tableName: 'users',
  timestamps: true, // Tự động quản lý createdAt và updatedAt
  hooks: {
    beforeCreate: async (user) => {
      if (user.password_hash) {
        const salt = await bcrypt.genSalt(10);
        user.password_hash = await bcrypt.hash(user.password_hash, salt);
      }
    },
  },
});

// Thêm một phương thức để kiểm tra mật khẩu
User.prototype.isValidPassword = async function(password) {
  return await bcrypt.compare(password, this.password_hash);
};

module.exports = User;