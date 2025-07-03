const db = require('./config/db');
const BlogPost = require('./models/BlogPost');
const BlogTag = require('./models/BlogTag');
const PostTagRelation = require('./models/PostTagRelation');
const BlogComment = require('./models/BlogComment');

// 初始化数据库函数
const initDatabase = async () => {
  try {
    console.log('开始初始化数据库...');

    // 同步所有模型（创建数据表）
    await db.sequelize.sync({ force: true });
    console.log('数据表创建成功');

    // 创建初始标签
    const tags = await BlogTag.bulkCreate([
      { name: 'JavaScript' },
      { name: 'React' },
      { name: 'Node.js' },
      { name: 'MySQL' },
      { name: '前端开发' },
      { name: '后端开发' },
      { name: '数据库' },
      { name: '架构设计' }
    ]);
    console.log(`创建了 ${tags.length} 个初始标签`);

    // 创建测试文章
    const posts = await BlogPost.bulkCreate([
      {
        title: 'React Hooks 完全指南',
        content: '<p>React Hooks 是 React 16.8 引入的新特性，它允许你在不编写 class 的情况下使用 state 以及其他的 React 特性。本文将详细介绍常用的 Hooks 及其使用场景。</p><h3>useState</h3><p>useState 允许你在函数组件中添加 state...</p>',
        category: 'frontend',
        coverImage: '/public/images/react-hooks.jpg',
        author: '技术博主',
        views: 1250
      },
      {
        title: 'Node.js 异步编程模式详解',
        content: '<p>Node.js 采用非阻塞 I/O 模型，使其能够高效处理并发请求。本文将深入探讨 Node.js 中的异步编程模式，包括回调函数、Promise、async/await 等。</p><h3>回调函数</h3><p>回调函数是 Node.js 最基础的异步编程方式...</p>',
        category: 'backend',
        coverImage: '/public/images/nodejs-async.jpg',
        author: '技术博主',
        views: 980
      },
      {
        title: 'MySQL 索引优化实战',
        content: '<p>数据库索引是提高查询性能的关键。本文将介绍 MySQL 索引的基本原理、类型以及优化技巧，帮助你构建高效的数据库查询。</p><h3>索引类型</h3><p>MySQL 支持多种索引类型，包括 B-Tree 索引、哈希索引、全文索引等...</p>',
        category: 'database',
        coverImage: '/public/images/mysql-index.jpg',
        author: '技术博主',
        views: 1560
      },
      {
        title: '微服务架构设计原则',
        content: '<p>微服务架构已成为构建大型应用的主流方式。本文将讨论微服务架构的核心设计原则、优缺点以及实施策略。</p><h3>单一职责原则</h3><p>每个微服务应专注于解决特定业务领域的问题...</p>',
        category: 'architecture',
        coverImage: '/public/images/microservices.jpg',
        author: '技术博主',
        views: 870
      }
    ]);
    console.log(`创建了 ${posts.length} 篇测试文章`);

    // 关联文章和标签
    await PostTagRelation.bulkCreate([
      { postId: posts[0].id, tagId: tags[0].id }, // React Hooks -> JavaScript
      { postId: posts[0].id, tagId: tags[1].id }, // React Hooks -> React
      { postId: posts[0].id, tagId: tags[4].id }, // React Hooks -> 前端开发
      { postId: posts[1].id, tagId: tags[2].id }, // Node.js 异步 -> Node.js
      { postId: posts[1].id, tagId: tags[5].id }, // Node.js 异步 -> 后端开发
      { postId: posts[2].id, tagId: tags[3].id }, // MySQL 索引 -> MySQL
      { postId: posts[2].id, tagId: tags[6].id }, // MySQL 索引 -> 数据库
      { postId: posts[3].id, tagId: tags[7].id }  // 微服务 -> 架构设计
    ]);
    console.log('文章与标签关联成功');

    // 创建测试评论
    await BlogComment.bulkCreate([
      {
        postId: posts[0].id,
        content: '非常实用的 Hooks 指南，感谢分享！',
        author: '读者A',
        parentId: null
      },
      {
        postId: posts[0].id,
        content: '请问如何解决 useEffect 的依赖数组问题？',
        author: '读者B',
        parentId: null
      },
      {
        postId: posts[1].id,
        content: '异步编程一直是难点，这篇文章讲得很清晰',
        author: '读者C',
        parentId: null
      }
    ]);
    console.log('创建了测试评论');

    console.log('数据库初始化完成！');
  } catch (error) {
    console.error('数据库初始化失败:', error);
  } finally {
    // 关闭数据库连接
    await db.sequelize.close();
  }
};

// 执行初始化
initDatabase();