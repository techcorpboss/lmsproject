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
    type: DataTypes.ENUM('STUDENT', 'TEACHER', 'MANAGER', 'ADMIN'),
    allowNull: false,
    defaultValue: 'STUDENT',
  },
  // Các trường khác như avatar, phone_number... có thể thêm sau
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