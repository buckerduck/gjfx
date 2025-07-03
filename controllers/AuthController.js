const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { User } = require('../models');
require('dotenv').config();

// JWT配置
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * 用户注册
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
exports.register = async (req, res) => {
  try {
    const { username, email, password, nickname } = req.body;

    // 检查用户名或邮箱是否已存在
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        message: '用户名或邮箱已被注册'
      });
    }

    // 创建新用户
    const user = await User.create({
      username,
      email,
      password,
      nickname: nickname || username
    });

    // 生成JWT令牌
    const token = generateToken(user.id);

    res.status(201).json({
      message: '注册成功',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('注册失败:', error);
    res.status(500).json({
      message: '注册失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 用户登录
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 查找用户（支持用户名或邮箱登录）
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { username },
          { email: username }
        ]
      }
    });

    // 检查用户是否存在及密码是否正确
    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({
        message: '用户名或密码不正确'
      });
    }

    // 检查用户状态
    if (user.status !== 'active') {
      return res.status(403).json({
        message: user.status === 'banned' ? '账号已被禁用' : '账号未激活'
      });
    }

    // 生成JWT令牌
    const token = generateToken(user.id);

    res.json({
      message: '登录成功',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({
      message: '登录失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 获取当前登录用户信息
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({
        message: '用户不存在'
      });
    }

    res.json({
      user: user.toJSON()
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({
      message: '获取用户信息失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 更新用户信息
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
exports.updateProfile = async (req, res) => {
  try {
    const { nickname, avatar } = req.body;
    const userId = req.userId;

    // 查找用户
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        message: '用户不存在'
      });
    }

    // 更新用户信息（不允许更新用户名、邮箱和密码）
    await user.update({
      nickname: nickname || user.nickname,
      avatar: avatar || user.avatar
    });

    res.json({
      message: '个人信息更新成功',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('更新个人信息失败:', error);
    res.status(500).json({
      message: '更新个人信息失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 生成JWT令牌
 * @param {number} userId - 用户ID
 * @returns {string} JWT令牌
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};