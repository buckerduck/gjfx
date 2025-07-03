const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: '用户名不能为空' },
        len: { args: [3, 50], msg: '用户名长度必须在3到50个字符之间' }
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: '邮箱不能为空' },
        isEmail: { msg: '请输入有效的邮箱地址' }
      }
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: '密码不能为空' },
        len: { args: [6, 100], msg: '密码长度必须至少6个字符' }
      }
    },
    nickname: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: '用户昵称'
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '/public/images/default-avatar.jpg',
      comment: '用户头像URL'
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user',
      comment: '用户角色: user-普通用户, admin-管理员'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'banned'),
      defaultValue: 'active',
      comment: '用户状态: active-活跃, inactive-未激活, banned-禁用'
    }
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { name: 'idx_username', fields: ['username'] },
      { name: 'idx_email', fields: ['email'] },
      { name: 'idx_role_status', fields: ['role', 'status'] }
    ],
    hooks: {
      // 保存前加密密码
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        // 只有当密码字段被修改时才重新加密
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });

  // 模型关联
  User.associate = (models) => {
    // 用户与博客文章: 一对多
    User.hasMany(models.BlogPost, {
      foreignKey: 'author_id',
      as: 'posts'
    });

    // 用户与评论: 一对多
    User.hasMany(models.BlogComment, {
      foreignKey: 'user_id',
      as: 'comments'
    });
  };

  // 实例方法: 验证密码
  User.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

  // 实例方法: 获取用户信息（不含密码）
  User.prototype.toJSON = function() {
    const values = { ...this.get() };
    delete values.password;
    return values;
  };

  return User;
};