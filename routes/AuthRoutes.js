const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * 用户认证相关路由
 * 前缀: /api/auth
 */

// 公开路由
router.post('/register', AuthController.register); // 用户注册
router.post('/login', AuthController.login);       // 用户登录

// 需要认证的路由
router.get('/me', authMiddleware, AuthController.getCurrentUser); // 获取当前用户信息
router.put('/profile', authMiddleware, AuthController.updateProfile); // 更新个人信息

module.exports = router;