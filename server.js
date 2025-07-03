const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/db');
const BlogRoutes = require('./routes/BlogRoutes');
const AuthRoutes = require('./routes/AuthRoutes');

// 初始化Express应用
const app = express();
const PORT = process.env.PORT || 3001;

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use('/public', express.static(path.join(__dirname, 'public')));

// API路由
app.use('/api/blog', BlogRoutes);
app.use('/api/auth', AuthRoutes);

// 根路由测试
app.get('/', (req, res) => {
  res.json({ message: '博客系统API服务运行中' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: '服务器内部错误',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 连接数据库并启动服务器
const startServer = async () => {
  try {
    await db.testConnection();
    // 开发环境自动同步模型（生产环境应使用迁移）
    if (process.env.NODE_ENV === 'development') {
      await db.sequelize.sync({ alter: true });
      console.log('数据库模型同步完成');
    }
    app.listen(PORT, () => {
      console.log(`服务器运行在 http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('启动服务器失败:', error.message);
  }
};

// 启动服务器
startServer();