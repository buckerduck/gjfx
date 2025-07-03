'use strict';

// 直接导出 config/db.js 中已配置好的数据库模型
// 这样可以避免模型被重复加载
module.exports = require('../config/db');