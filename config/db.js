const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

// 从环境变量获取数据库配置（开发环境默认值）
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || 'password';
const DB_NAME = process.env.DB_NAME || 'blog_platform';
const DB_PORT = process.env.DB_PORT || 3306;

// 初始化Sequelize实例
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  timezone: '+08:00' // 设置时区为东八区
});

// 模型存储对象
const db = {};

// 读取models目录下的所有模型文件
const modelsPath = path.join(__dirname, '../models');
fs.readdirSync(modelsPath)
  .filter(file => file.endsWith('.js') && file !== 'index.js')
  .forEach(file => {
    const model = require(path.join(modelsPath, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// 执行模型关联
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// 测试数据库连接
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');
  } catch (error) {
    console.error('数据库连接失败:', error.message);
    process.exit(1);
  }
};

db.sequelize = sequelize;
 db.Sequelize = Sequelize;
 db.testConnection = testConnection;

module.exports = db;