import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'; // Import Chart.js

// 模拟后端API和数据库操作
const mockApi = {
  // 模拟用户数据
  users: [
    { id: 'user123', username: 'testuser', email: 'test@example.com', password: 'password123' },
  ],
  // 模拟文章数据
  blogPosts: [
    {
      id: 'blog1',
      title: 'React Hooks 深度解析',
      content: 'React Hooks 是 React 16.8 版本引入的新特性，它让你在不编写 class 的情况下使用 state 以及其他的 React 特性。本文将深入探讨 useState, useEffect, useContext 等常用 Hooks 的使用方法和最佳实践...',
      category: 'frontend',
      coverImage: 'https://placehold.co/600x400/4A2C2A/DAA520?text=React+Hooks',
      author: '前端老王',
      views: 1250,
      tags: ['React', 'Hooks', 'JavaScript'],
      createdAt: '2023-01-15T10:00:00Z',
    },
    {
      id: 'blog2',
      title: 'MySQL 数据库性能优化实践',
      content: '数据库性能优化是后端开发中不可或缺的一环。本文将从索引优化、查询优化、表结构设计等方面，分享 MySQL 数据库性能优化的实战经验，帮助你构建更高效的后端系统...',
      category: 'database',
      coverImage: 'https://placehold.co/600x400/4A2C2A/DAA520?text=MySQL+Optimization',
      author: '后端小李',
      views: 890,
      tags: ['MySQL', '数据库', '性能'],
      createdAt: '2023-02-20T14:30:00Z',
    },
    {
      id: 'blog3',
      title: '微服务架构设计与实践',
      content: '微服务架构作为一种流行的软件开发范式，旨在将大型应用拆分为一系列小型、独立的服务。本文将探讨微服务的设计原则、技术选型以及在实际项目中的落地实践...',
      category: 'architecture',
      coverImage: 'https://placehold.co/600x400/4A2C2A/DAA520?text=Microservices',
      author: '架构师张',
      views: 1560,
      tags: ['微服务', '架构', '分布式'],
      createdAt: '2023-03-10T09:15:00Z',
    },
    {
      id: 'blog4',
      title: 'Node.js 事件循环机制详解',
      content: 'Node.js 的非阻塞 I/O 和高性能得益于其独特的事件循环机制。理解事件循环对于编写高效的 Node.js 应用至关重要。本文将深入剖析事件循环的各个阶段，以及宏任务和微任务的区别...',
      category: 'backend',
      coverImage: 'https://placehold.co/600x400/4A2C2A/DAA520?text=Node.js+Event+Loop',
      author: '后端小李',
      views: 720,
      tags: ['Node.js', 'JavaScript', '后端'],
      createdAt: '2023-04-05T11:00:00Z',
    },
  ],
  // 模拟评论数据
  comments: [
    { id: 'comment1', postId: 'blog1', userId: 'user123', author: 'testuser', content: '非常棒的文章，对 Hooks 的理解更深了！', createdAt: '2023-01-16T09:00:00Z' },
    { id: 'comment2', postId: 'blog1', userId: 'user456', author: '匿名用户', content: '希望有更多关于性能优化的内容。', createdAt: '2023-01-17T11:20:00Z' },
  ],
  // 模拟典籍数据
  classics: [
    {
      id: 'classic1',
      title: '《金刚经》',
      content: '《金刚般若波罗蜜经》，简称《金刚经》，是大乘佛教般若部的重要经典之一。它以对话体形式，阐述了“一切有为法，如梦幻泡影，如露亦如电，应作如是观”的核心思想，强调空性与无相...',
      category: 'buddhism',
      coverImage: 'https://placehold.co/600x400/4A2C2A/DAA520?text=Vajracchedika+Prajnaparamita+Sutra',
      author: '佛陀',
      views: 2500,
      createdAt: 'Unknown',
    },
    {
      id: 'classic2',
      title: '《道德经》',
      content: '《道德经》，又称《老子》，是中国古代先秦诸子百家之一道家学派的经典著作。其内容涵盖哲学、政治、军事、伦理等诸多领域，以“道”为核心概念，阐述了道法自然、无为而治等思想...',
      category: 'taoism',
      coverImage: 'https://placehold.co/600x400/4A2C2A/DAA520?text=Tao+Te+Ching',
      author: '老子',
      views: 3200,
      createdAt: 'Unknown',
    },
    {
      id: 'classic3',
      title: '《黄帝内经》',
      content: '《黄帝内经》是中国现存最早、最完整的中医理论著作。它奠定了中医学的理论基础，包括阴阳五行、藏象经络、病因病机、诊法治则等，对后世中医学的发展产生了深远影响...',
      category: 'tcm',
      coverImage: 'https://placehold.co/600x400/4A2C2A/DAA520?text=Huangdi+Neijing',
      author: '黄帝',
      views: 1800,
      createdAt: 'Unknown',
    },
  ],

  // 模拟 API 延迟
  _delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

  // 模拟登录
  async login(username, password) {
    await this._delay(500);
    const user = this.users.find(u => u.username === username && u.password === password);
    if (user) {
      // 模拟 JWT token
      return { token: 'mock-jwt-token-for-' + user.id, user: { id: user.id, username: user.username } };
    }
    throw new Error('用户名或密码错误');
  },

  // 模拟注册
  async register(username, email, password) {
    await this._delay(500);
    if (this.users.some(u => u.username === username || u.email === email)) {
      throw new Error('用户名或邮箱已存在');
    }
    const newUser = { id: `user${Date.now()}`, username, email, password };
    this.users.push(newUser);
    return { message: '注册成功，请登录', user: { id: newUser.id, username: newUser.username } };
  },

  // 模拟获取博客文章
  async getBlogPosts(category = null, tag = null, page = 1, limit = 10) {
    await this._delay(300);
    let filteredPosts = this.blogPosts;
    if (category && category !== 'all') {
      filteredPosts = filteredPosts.filter(post => post.category === category);
    }
    if (tag) {
      filteredPosts = filteredPosts.filter(post => post.tags.includes(tag));
    }

    const total = filteredPosts.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    return {
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: paginatedPosts,
    };
  },

  // 模拟获取单篇文章
  async getBlogPost(id) {
    await this._delay(200);
    const post = this.blogPosts.find(p => p.id === id);
    if (post) {
      // 增加阅读量
      post.views += 1;
      return { ...post };
    }
    throw new Error('文章未找到');
  },

  // 模拟获取文章评论
  async getCommentsForPost(postId) {
    await this._delay(200);
    return this.comments.filter(comment => comment.postId === postId);
  },

  // 模拟添加评论
  async addComment(postId, userId, author, content) {
    await this._delay(300);
    const newComment = {
      id: `comment${Date.now()}`,
      postId,
      userId,
      author,
      content,
      createdAt: new Date().toISOString(),
    };
    this.comments.push(newComment);
    return newComment;
  },

  // 模拟获取典籍
  async getClassics(category = null) {
    await this._delay(300);
    let filteredClassics = this.classics;
    if (category && category !== 'all') {
      filteredClassics = filteredClassics.filter(classic => classic.category === category);
    }
    return filteredClassics;
  }
};

// 辅助函数：获取分类文本
const getCategoryText = (category) => {
  switch (category) {
    case 'frontend': return '前端开发';
    case 'backend': return '后端开发';
    case 'database': return '数据库';
    case 'architecture': return '系统架构';
    case 'buddhism': return '佛教典籍';
    case 'taoism': return '道教典籍';
    case 'tcm': return '中医典籍';
    default: return '其他';
  }
};

// 辅助函数：格式化日期
const formatDate = (isoString) => {
  if (!isoString) return '未知日期';
  const date = new Date(isoString);
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
};

// -----------------------------------------------------------------------------
// 组件定义
// -----------------------------------------------------------------------------

// Header 组件
const Header = ({ currentPage, onNavigate, isAuthenticated, onLogout }) => {
  return (
    <header className="bg-deep-brown text-gold p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold cursor-pointer" onClick={() => onNavigate('home')}>
          文化与技术
        </h1>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <button
                className={`text-lg font-medium hover:text-white transition-colors ${currentPage === 'home' ? 'text-white underline' : ''}`}
                onClick={() => onNavigate('home')}
              >
                首页
              </button>
            </li>
            <li>
              <button
                className={`text-lg font-medium hover:text-white transition-colors ${currentPage === 'blog' ? 'text-white underline' : ''}`}
                onClick={() => onNavigate('blog')}
              >
                技术博客
              </button>
            </li>
            <li>
              <button
                className={`text-lg font-medium hover:text-white transition-colors ${currentPage === 'classics' ? 'text-white underline' : ''}`}
                onClick={() => onNavigate('classics')}
              >
                文化典籍
              </button>
            </li>
            <li>
              <button
                className={`text-lg font-medium hover:text-white transition-colors ${currentPage === 'profile' ? 'text-white underline' : ''}`}
                onClick={() => onNavigate('profile')}
              >
                个人中心
              </button>
            </li>
            {isAuthenticated ? (
              <li>
                <button
                  className="text-lg font-medium hover:text-white transition-colors"
                  onClick={onLogout}
                >
                  退出登录
                </button>
              </li>
            ) : (
              <li>
                <button
                  className="text-lg font-medium hover:text-white transition-colors"
                  onClick={() => onNavigate('auth')}
                >
                  登录/注册
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

// Footer 组件
const Footer = () => {
  return (
    <footer className="bg-deep-brown text-gold p-6 text-center mt-12 shadow-inner">
      <div className="container mx-auto">
        <p className="text-sm">&copy; {new Date().getFullYear()} 文化与技术. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-3">
          <a href="#" className="text-gold hover:text-white transition-colors">
            <i className="fab fa-weibo fa-lg"></i>
          </a>
          <a href="#" className="text-gold hover:text-white transition-colors">
            <i className="fab fa-weixin fa-lg"></i>
          </a>
          <a href="#" className="text-gold hover:text-white transition-colors">
            <i className="fab fa-github fa-lg"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

// 消息提示框组件
const MessageBox = ({ message, type, onClose }) => {
  if (!message) return null;

  const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';
  const borderColor = type === 'error' ? 'border-red-700' : 'border-green-700';

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-xl text-white z-[100] flex items-center justify-between ${bgColor} ${borderColor} border`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white font-bold text-xl leading-none">
        &times;
      </button>
    </div>
  );
};


// 登录/注册模态框
const AuthModal = ({ onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      if (isLogin) {
        const result = await mockApi.login(username, password);
        onLoginSuccess(result.user);
        setMessage('登录成功！');
        setMessageType('success');
        onClose(); // 登录成功后关闭模态框
      } else {
        const result = await mockApi.register(username, email, password);
        setMessage(result.message);
        setMessageType('success');
        setIsLogin(true); // 注册成功后切换到登录界面
      }
    } catch (error) {
      setMessage(error.message);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl font-bold leading-none"
        >
          &times;
        </button>
        <h2 className="text-3xl font-serif font-bold text-center mb-6 text-deep-brown">
          {isLogin ? '登录' : '注册'}
        </h2>

        {message && (
          <div className={`p-3 mb-4 rounded-lg text-sm ${messageType === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-gray-700 text-sm font-medium mb-1">
              用户名
            </label>
            <input
              type="text"
              id="username"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          {!isLogin && (
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">
                邮箱
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}
          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-1">
              密码
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gold text-white p-3 rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center"
            disabled={loading}
          >
            {loading && <i className="fas fa-spinner fa-spin mr-2"></i>}
            {isLogin ? '登录' : '注册'}
          </button>
        </form>
        <p className="text-center text-sm mt-6 text-gray-600">
          {isLogin ? '还没有账号？' : '已有账号？'}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-deep-brown font-medium hover:underline ml-1"
          >
            {isLogin ? '立即注册' : '立即登录'}
          </button>
        </p>
      </div>
    </div>
  );
};


// 博客文章卡片组件
const BlogCard = ({ post, onReadMore }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <div className="relative h-48">
        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/4A2C2A/DAA520?text=No+Image'; }} />
        <div className="absolute top-3 left-3 bg-deep-brown text-gold text-xs font-medium px-2 py-1 rounded-full">
          {getCategoryText(post.category)}
        </div>
      </div>
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-xl font-serif font-bold mb-2 line-clamp-2 text-deep-brown">{post.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">{post.content.substring(0, 120)}...</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags && post.tags.map(tag => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-xs text-gray-500"><i className="fas fa-eye mr-1"></i> {post.views} 次阅读</span>
          <button
            className="text-deep-brown font-medium hover:underline flex items-center view-post"
            onClick={() => onReadMore(post.id)}
          >
            阅读全文 <i className="fas fa-angle-right ml-1 text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

// 典籍卡片组件
const ClassicCard = ({ classic }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <div className="relative h-48">
        <img src={classic.coverImage} alt={classic.title} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/4A2C2A/DAA520?text=No+Image'; }} />
        <div className="absolute top-3 left-3 bg-deep-brown text-gold text-xs font-medium px-2 py-1 rounded-full">
          {getCategoryText(classic.category)}
        </div>
      </div>
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-xl font-serif font-bold mb-2 line-clamp-2 text-deep-brown">{classic.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">{classic.content.substring(0, 120)}...</p>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-xs text-gray-500"><i className="fas fa-eye mr-1"></i> {classic.views} 次阅读</span>
          {/* For simplicity, classics don't have a detail modal in this implementation */}
          <button className="text-deep-brown font-medium hover:underline flex items-center">
            查看详情 <i className="fas fa-angle-right ml-1 text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  );
};


// 评论区组件
const CommentsSection = ({ postId, isAuthenticated, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const fetchedComments = await mockApi.getCommentsForPost(postId);
        setComments(fetchedComments);
      } catch (error) {
        setMessage('加载评论失败: ' + error.message);
        setMessageType('error');
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      setMessage('评论内容不能为空！');
      setMessageType('error');
      return;
    }
    if (!isAuthenticated || !currentUser) {
      setMessage('请先登录才能发表评论！');
      setMessageType('error');
      return;
    }

    setLoading(true);
    try {
      const addedComment = await mockApi.addComment(postId, currentUser.id, currentUser.username, newComment);
      setComments([...comments, addedComment]);
      setNewComment('');
      setMessage('评论发表成功！');
      setMessageType('success');
    } catch (error) {
      setMessage('发表评论失败: ' + error.message);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-xl shadow-inner">
      <h3 className="text-2xl font-serif font-bold mb-4 text-deep-brown">评论区</h3>

      {message && <MessageBox message={message} type={messageType} onClose={() => setMessage(null)} />}

      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-gray-500"><i className="fas fa-spinner fa-spin mr-2"></i>加载评论中...</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-600 text-center">暂无评论，快来发表第一条评论吧！</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-2">
                <i className="fas fa-user-circle text-deep-brown text-xl mr-2"></i>
                <span className="font-semibold text-deep-brown">{comment.author}</span>
                <span className="text-gray-500 text-xs ml-auto">{formatDate(comment.createdAt)}</span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{comment.content}</p>
            </div>
          ))
        )}
      </div>

      <div className="mt-6">
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all resize-y min-h-[100px]"
          placeholder={isAuthenticated ? "发表你的评论..." : "请登录后发表评论..."}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={!isAuthenticated || loading}
        ></textarea>
        <button
          onClick={handleAddComment}
          className="mt-3 bg-gold text-white px-6 py-2 rounded-lg font-bold hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center"
          disabled={!isAuthenticated || loading}
        >
          {loading && <i className="fas fa-spinner fa-spin mr-2"></i>}
          发表评论
        </button>
      </div>
    </div>
  );
};

// 阅读量统计图表组件
const ViewsChart = ({ postId, views }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null); // Store chart instance

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy(); // Destroy existing chart before creating a new one
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['当前阅读量'],
        datasets: [{
          label: '阅读量',
          data: [views],
          backgroundColor: 'rgba(74, 44, 42, 0.8)', // Deep brown with transparency
          borderColor: 'rgba(218, 165, 32, 1)', // Gold
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // Allow chart to fill container
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: '#4A2C2A' // Deep brown for ticks
            },
            grid: {
              color: 'rgba(74, 44, 42, 0.1)' // Light deep brown grid
            }
          },
          x: {
            ticks: {
              color: '#4A2C2A' // Deep brown for ticks
            },
            grid: {
              color: 'rgba(74, 44, 42, 0.1)' // Light deep brown grid
            }
          }
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: '文章阅读量统计',
            color: '#4A2C2A', // Deep brown title
            font: {
              size: 16,
              family: 'serif',
              weight: 'bold'
            }
          }
        }
      }
    });

    // Cleanup function to destroy chart on component unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [views, postId]); // Re-render chart if views or postId changes

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-xl shadow-inner h-64"> {/* Fixed height for chart container */}
      <canvas ref={chartRef}></canvas>
    </div>
  );
};


// 博客文章详情模态框
const BlogDetailModal = ({ postId, onClose, isAuthenticated, currentUser }) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const fetchedPost = await mockApi.getBlogPost(postId);
        setPost(fetchedPost);
      } catch (error) {
        setMessage('加载文章详情失败: ' + error.message);
        setMessageType('error');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  const handleShare = (platform) => {
    let shareUrl = window.location.href; // Current URL for sharing
    let text = `我正在阅读《${post.title}》，快来看看！`;

    if (platform === 'weibo') {
      window.open(`https://service.weibo.com/share/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(text)}`, '_blank');
    } else if (platform === 'weixin') {
      setMessage('请使用微信“扫一扫”分享此页面。');
      setMessageType('success');
      // For real WeChat sharing, you'd need a QR code or JSSDK
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(`${text} ${shareUrl}`).then(() => {
        setMessage('链接已复制到剪贴板！');
        setMessageType('success');
      }).catch(err => {
        setMessage('复制失败，请手动复制。');
        setMessageType('error');
        console.error('Failed to copy: ', err);
      });
    }
  };

  if (!post && loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-8 shadow-2xl animate-pulse">
          <p className="text-deep-brown text-lg"><i className="fas fa-spinner fa-spin mr-2"></i>加载中...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-8 shadow-2xl">
          <p className="text-red-600 text-lg">文章加载失败或不存在。</p>
          <button onClick={onClose} className="mt-4 bg-deep-brown text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors">关闭</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-4xl relative my-8 animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl font-bold leading-none"
        >
          &times;
        </button>
        <h2 className="text-4xl font-serif font-bold text-deep-brown mb-4">{post.title}</h2>
        <div className="text-gray-600 text-sm mb-6 flex items-center space-x-4">
          <span><i className="fas fa-user mr-1"></i> {post.author}</span>
          <span><i className="fas fa-calendar-alt mr-1"></i> {formatDate(post.createdAt)}</span>
          <span><i className="fas fa-eye mr-1"></i> {post.views} 次阅读</span>
          <span className="bg-deep-brown text-gold text-xs font-medium px-2 py-1 rounded-full">
            {getCategoryText(post.category)}
          </span>
        </div>

        {message && <MessageBox message={message} type={messageType} onClose={() => setMessage(null)} />}

        <div className="prose max-w-none text-gray-800 leading-relaxed text-lg mb-8" style={{ lineHeight: '1.8' }}>
          <p>{post.content}</p>
          {/* 这里可以放置更多文章内容，例如图片、代码块等 */}
        </div>

        <div className="flex items-center justify-between border-t border-b border-gray-200 py-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {post.tags && post.tags.map(tag => (
              <span key={tag} className="text-sm bg-gold text-white px-3 py-1 rounded-full">
                <i className="fas fa-tag mr-1"></i> {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-gray-700 font-medium">分享到:</span>
            <button onClick={() => handleShare('weibo')} className="text-gray-600 hover:text-deep-brown transition-colors text-2xl">
              <i className="fab fa-weibo"></i>
            </button>
            <button onClick={() => handleShare('weixin')} className="text-gray-600 hover:text-deep-brown transition-colors text-2xl">
              <i className="fab fa-weixin"></i>
            </button>
            <button onClick={() => handleShare('copy')} className="text-gray-600 hover:text-deep-brown transition-colors text-2xl">
              <i className="fas fa-link"></i>
            </button>
          </div>
        </div>

        {post.views && <ViewsChart postId={postId} views={post.views} />}

        <CommentsSection postId={postId} isAuthenticated={isAuthenticated} currentUser={currentUser} />
      </div>
    </div>
  );
};


// 博客主页
const BlogPage = ({ onReadMore }) => {
  const categories = ['all', 'frontend', 'backend', 'database', 'architecture'];
  const tags = ['React', 'Hooks', 'JavaScript', 'MySQL', '数据库', '性能', '微服务', '架构', '分布式', 'Node.js']; // 模拟标签云
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState(null);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setMessage(null);
      try {
        const response = await mockApi.getBlogPosts(selectedCategory, selectedTag);
        setBlogPosts(response.data);
      } catch (error) {
        setMessage('加载博客文章失败: ' + error.message);
        setMessageType('error');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [selectedCategory, selectedTag]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedTag(null); // 切换分类时清除标签筛选
  };

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
    setSelectedCategory('all'); // 切换标签时清除分类筛选
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h2 className="text-4xl font-serif font-bold text-deep-brown mb-8 text-center">技术博客</h2>

      {message && <MessageBox message={message} type={messageType} onClose={() => setMessage(null)} />}

      {/* 分类筛选 */}
      <div className="mb-8 flex flex-wrap justify-center gap-3">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-5 py-2 rounded-full font-medium transition-all duration-300
              ${selectedCategory === cat ? 'bg-gold text-white shadow-md' : 'bg-gray-100 text-deep-brown hover:bg-gold hover:text-white'}`}
          >
            {getCategoryText(cat === 'all' ? '全部' : cat)}
          </button>
        ))}
      </div>

      {/* 标签云 */}
      <div className="mb-10 text-center">
        <h3 className="text-2xl font-serif font-bold text-deep-brown mb-4">热门标签</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-4 py-1 rounded-full text-sm transition-all duration-300
                ${selectedTag === tag ? 'bg-deep-brown text-gold shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-deep-brown hover:text-gold'}`}
            >
              <i className="fas fa-tag mr-1"></i> {tag}
            </button>
          ))}
          {selectedTag && (
            <button
              onClick={() => setSelectedTag(null)}
              className="px-4 py-1 rounded-full text-sm bg-red-100 text-red-700 hover:bg-red-200 transition-all duration-300"
            >
              <i className="fas fa-times-circle mr-1"></i> 清除标签
            </button>
          )}
        </div>
      </div>

      {/* 文章列表 */}
      {loading ? (
        <p className="text-center text-gray-600 text-lg"><i className="fas fa-spinner fa-spin mr-2"></i>加载文章中...</p>
      ) : blogPosts.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">没有找到相关文章。</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map(post => (
            <BlogCard key={post.id} post={post} onReadMore={onReadMore} />
          ))}
        </div>
      )}
    </main>
  );
};

// 典籍主页
const ClassicsPage = () => {
  const categories = ['all', 'buddhism', 'taoism', 'tcm'];
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [classics, setClassics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');

  useEffect(() => {
    const fetchClassics = async () => {
      setLoading(true);
      setMessage(null);
      try {
        const response = await mockApi.getClassics(selectedCategory);
        setClassics(response);
      } catch (error) {
        setMessage('加载典籍失败: ' + error.message);
        setMessageType('error');
      } finally {
        setLoading(false);
      }
    };
    fetchClassics();
  }, [selectedCategory]);

  return (
    <main className="container mx-auto px-4 py-8">
      <h2 className="text-4xl font-serif font-bold text-deep-brown mb-8 text-center">文化典籍</h2>

      {message && <MessageBox message={message} type={messageType} onClose={() => setMessage(null)} />}

      {/* 分类筛选 */}
      <div className="mb-8 flex flex-wrap justify-center gap-3">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-full font-medium transition-all duration-300
              ${selectedCategory === cat ? 'bg-gold text-white shadow-md' : 'bg-gray-100 text-deep-brown hover:bg-gold hover:text-white'}`}
          >
            {getCategoryText(cat === 'all' ? '全部' : cat)}
          </button>
        ))}
      </div>

      {/* 典籍列表 */}
      {loading ? (
        <p className="text-center text-gray-600 text-lg"><i className="fas fa-spinner fa-spin mr-2"></i>加载典籍中...</p>
      ) : classics.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">没有找到相关典籍。</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {classics.map(classic => (
            <ClassicCard key={classic.id} classic={classic} />
          ))}
        </div>
      )}
    </main>
  );
};

// 个人中心页面
const UserProfile = ({ currentUser, isAuthenticated, onNavigate }) => {
  if (!isAuthenticated) {
    return (
      <main className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-4xl font-serif font-bold text-deep-brown mb-8">个人中心</h2>
        <p className="text-lg text-gray-700 mb-6">您尚未登录。请登录以查看您的个人信息。</p>
        <button
          onClick={() => onNavigate('auth')}
          className="bg-gold text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all duration-300"
        >
          前往登录/注册
        </button>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h2 className="text-4xl font-serif font-bold text-deep-brown mb-8 text-center">个人中心</h2>
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <i className="fas fa-user-circle text-gold text-6xl mr-4"></i>
          <div>
            <p className="text-2xl font-bold text-deep-brown">{currentUser.username}</p>
            <p className="text-gray-600 text-sm">用户ID: {currentUser.id}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-xl font-serif font-bold text-deep-brown mb-2">我的阅读记录</h3>
            <ul className="list-disc list-inside text-gray-700">
              <li>React Hooks 深度解析 <span className="text-gray-500 text-sm">(2023-01-15)</span></li>
              <li>MySQL 数据库性能优化实践 <span className="text-gray-500 text-sm">(2023-02-20)</span></li>
              {/* 模拟阅读记录 */}
            </ul>
            <button className="mt-3 text-deep-brown font-medium hover:underline text-sm">查看更多</button>
          </div>

          <div>
            <h3 className="text-xl font-serif font-bold text-deep-brown mb-2">我的收藏</h3>
            <ul className="list-disc list-inside text-gray-700">
              <li>《道德经》</li>
              <li>微服务架构设计与实践</li>
              {/* 模拟收藏 */}
            </ul>
            <button className="mt-3 text-deep-brown font-medium hover:underline text-sm">查看更多</button>
          </div>
        </div>
      </div>
    </main>
  );
};

// 主页组件
const HomePage = ({ onNavigate }) => (
  <main className="container mx-auto px-4 py-8 text-center">
    <h2 className="text-5xl font-serif font-bold text-deep-brown mb-6 animate-fade-in-down">
      欢迎来到文化与技术交汇之地
    </h2>
    <p className="text-xl text-gray-700 mb-10 animate-fade-in-up">
      探索古老智慧，洞察前沿科技
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 animate-slide-in-left">
        <h3 className="text-3xl font-serif font-bold text-deep-brown mb-4">技术博客</h3>
        <p className="text-gray-700 mb-4">分享前端、后端、数据库和架构的最新技术文章和实践经验。</p>
        <button
          onClick={() => onNavigate('blog')}
          className="bg-gold text-white px-6 py-2 rounded-lg font-bold hover:bg-opacity-90 transition-all duration-300"
        >
          前往博客 <i className="fas fa-arrow-right ml-2"></i>
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 animate-slide-in-right">
        <h3 className="text-3xl font-serif font-bold text-deep-brown mb-4">文化典籍</h3>
        <p className="text-gray-700 mb-4">品读佛教、道教、中医等传统文化典籍，汲取古人智慧。</p>
        <button
          onClick={() => onNavigate('classics')}
          className="bg-gold text-white px-6 py-2 rounded-lg font-bold hover:bg-opacity-90 transition-all duration-300"
        >
          探索典籍 <i className="fas fa-arrow-right ml-2"></i>
        </button>
      </div>
    </div>
  </main>
);

// 主应用组件
function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'blog', 'classics', 'profile', 'auth'
  const [selectedBlogPostId, setSelectedBlogPostId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setSelectedBlogPostId(null); // 切换页面时关闭详情模态框
  };

  const handleReadMore = (postId) => {
    setSelectedBlogPostId(postId);
  };

  const handleCloseBlogDetail = () => {
    setSelectedBlogPostId(null);
  };

  const handleLoginSuccess = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    setMessage('登录成功！');
    setMessageType('success');
    handleNavigate('profile'); // 登录成功后跳转到个人中心
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setMessage('您已退出登录。');
    setMessageType('success');
    handleNavigate('home');
  };

  useEffect(() => {
    // 页面加载时尝试自动登录或检查认证状态 (模拟)
    // 实际应用中，这里会检查 localStorage 中的 JWT token
    const storedToken = localStorage.getItem('mock_jwt_token');
    if (storedToken) {
      // 模拟 token 验证和用户信息获取
      // const user = decodeJwt(storedToken); // 实际中需要解码 JWT
      setCurrentUser({ id: 'user123', username: 'testuser' }); // 假设是 testuser
      setIsAuthenticated(true);
    }
  }, []);

  let PageComponentToRender;
  let pageProps = {}; // 用于向组件传递属性

  switch (currentPage) {
    case 'home':
      PageComponentToRender = HomePage;
      pageProps = { onNavigate: handleNavigate };
      break;
    case 'blog':
      PageComponentToRender = BlogPage;
      pageProps = { onReadMore: handleReadMore };
      break;
    case 'classics':
      PageComponentToRender = ClassicsPage;
      pageProps = {};
      break;
    case 'profile':
      PageComponentToRender = UserProfile;
      pageProps = { currentUser, isAuthenticated, onNavigate: handleNavigate };
      break;
    case 'auth':
      PageComponentToRender = AuthModal;
      pageProps = { onClose: () => handleNavigate(isAuthenticated ? 'profile' : 'home'), onLoginSuccess: handleLoginSuccess };
      break;
    default:
      PageComponentToRender = () => <div>Page Not Found</div>; // 默认组件
  }

  return (
    <div className="min-h-screen flex flex-col bg-beige text-gray-900 font-sans">
      {/* Font Awesome CDN */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" xintegrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0V4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      {/* Tailwind CSS CDN */}
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Noto+Serif+SC:wght@400;700&display=swap');
        body {
          font-family: 'Inter', sans-serif;
        }
        h1, h2, h3, .font-serif {
          font-family: 'Noto Serif SC', serif;
        }
        .bg-deep-brown { background-color: #4A2C2A; }
        .text-deep-brown { color: #4A2C2A; }
        .bg-gold { background-color: #DAA520; }
        .text-gold { color: #DAA520; }
        .bg-beige { background-color: #F5F5DC; } /* Light beige for background */

        /* Custom animations */
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-down { animation: fadeInDown 0.8s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-slide-in-left { animation: slideInLeft 0.8s ease-out forwards; }
        .animate-slide-in-right { animation: slideInRight 0.8s ease-out forwards; }
        `}
      </style>

      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />

      {message && <MessageBox message={message} type={messageType} onClose={() => setMessage(null)} />}

      <div className="flex-grow">
        {PageComponentToRender && <PageComponentToRender {...pageProps} />}
      </div>

      {selectedBlogPostId && (
        <BlogDetailModal
          postId={selectedBlogPostId}
          onClose={handleCloseBlogDetail}
          isAuthenticated={isAuthenticated}
          currentUser={currentUser}
        />
      )}

      <Footer />
    </div>
  );
}

export default App;
