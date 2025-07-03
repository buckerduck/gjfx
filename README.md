# 文化典籍与技术博客平台

一个融合传统文化典籍与现代技术博客的综合性Web平台，支持文章发布、分类筛选、标签管理、用户评论等功能。

## ✨ 功能特点

- **双模块设计**：传统文化典籍模块 + 技术博客模块
- **响应式布局**：适配桌面端与移动端设备
- **分类与标签**：支持按分类（前端/后端/数据库/架构）和标签筛选内容
- **评论系统**：集成基于JWT认证的用户评论功能
- **全文搜索**：支持文章标题和内容的关键词搜索
- **数据可视化**：阅读量统计与图表展示
- **MySQL数据库**：使用Sequelize ORM进行数据管理
- **RESTful API**：规范的接口设计，支持前后端分离

## 🛠️ 技术栈

### 前端
- React 18
- React Router v6
- Tailwind CSS v3
- Font Awesome
- Axios
- Chart.js

### 后端
- Node.js
- Express
- Sequelize ORM
- MySQL
- JWT认证
- CORS跨域处理

## 🚀 快速开始

### 环境要求
- Node.js v14+ 和 npm v6+
- MySQL 5.7+ 数据库

### 安装步骤

1. **克隆项目**
```bash
# 克隆仓库
git clone <repository-url>
cd bokewangzhan
```

2. **安装依赖**
```bash
# 安装后端依赖
npm install

# 安装前端依赖
cd src
npm install
```

3. **配置数据库**

创建`.env`文件在项目根目录，添加以下配置：
```env
# 数据库配置
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=blog_platform
DB_PORT=3306

# 服务器配置
PORT=3001
NODE_ENV=development

# JWT配置
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

4. **初始化数据库**
```bash
# 运行数据库迁移（开发环境自动同步模型）
npm run dev
```

5. **启动应用**

```bash
# 启动后端服务器（开发模式）
npm run dev

# 启动前端开发服务器（在新终端中运行）
npm run frontend:dev
```

6. **访问应用**
- 前端: http://localhost:10086
- 后端API: http://localhost:3001

## 📁 项目结构

```
bokewangzhan/
├── config/              # 配置文件
│   └── db.js            # 数据库配置
├── controllers/         # 控制器
│   └── BlogController.js # 博客控制器
├── middleware/          # 中间件
│   └── authMiddleware.js # JWT认证中间件
├── models/              # 数据模型
│   ├── BlogPost.js      # 文章模型
│   ├── BlogTag.js       # 标签模型
│   └── ...
├── routes/              # 路由
│   └── BlogRoutes.js    # 博客路由
├── src/                 # 前端React应用
│   ├── components/      # React组件
│   ├── services/        # API服务
│   ├── styles/          # 样式文件
│   ├── App.js           # 应用入口组件
│   └── index.js         # 渲染入口
├── public/              # 静态资源
├── utils/               # 工具函数
├── server.js            # 后端入口
├── package.json         # 项目依赖
└── vite.config.js       # Vite配置
```

## 🔧 开发指南

### 添加新功能
1. 创建数据模型（如需要）
2. 实现控制器逻辑
3. 添加API路由
4. 开发前端组件
5. 连接API服务

### 代码规范
- 使用ESLint进行代码检查
- 遵循React组件设计原则
- API接口遵循RESTful规范
- 数据库模型使用Sequelize关联

## 📄 许可证

本项目采用MIT许可证 - 详见LICENSE文件

## 📧 联系我们

如有问题或建议，请联系：contact@example.com