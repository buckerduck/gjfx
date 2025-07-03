import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BlogList from './components/BlogList';
import BlogDetail from './components/BlogDetail';
import './styles/main.css';

// 主应用组件
const App = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  // 处理查看文章详情
  const handleViewPost = (post) => {
    setSelectedPost(post);
    setShowDetail(true);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* 顶部导航栏 */}
        <header className="bg-deep-brown text-white shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <i className="fas fa-book-open text-gold text-2xl"></i>
              <h1 className="text-xl font-serif font-bold">文化典籍与技术博客平台</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className="hover:text-gold transition-colors">首页</Link>
              <Link to="/classics" className="hover:text-gold transition-colors">典籍</Link>
              <Link to="/blog" className="hover:text-gold transition-colors">技术博客</Link>
              <Link to="/about" className="hover:text-gold transition-colors">关于</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <button className="hidden md:block px-4 py-2 bg-gold text-deep-brown rounded-full text-sm font-medium hover:bg-opacity-90">
                登录
              </button>
              <button className="md:hidden text-xl">
                <i className="fas fa-bars"></i>
              </button>
            </div>
          </div>
        </header>

        {/* 主要内容区 */}
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blog" element={
              <BlogList onViewPost={handleViewPost} />
            } />
            <Route path="/classics" element={<ClassicsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        {/* 页脚 */}
        <footer className="bg-deep-brown text-white py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-serif font-bold mb-4 flex items-center">
                  <i className="fas fa-book-open text-gold mr-2"></i>文化典籍与技术博客平台
                </h3>
                <p className="text-gray-300 text-sm">
                  融合传统文化与现代技术的知识分享平台，致力于传播经典智慧与技术洞见。
                </p>
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold mb-4">快速链接</h3>
                <ul className="space-y-2 text-gray-300">
                  <li><a href="/" className="hover:text-gold transition-colors">首页</a></li>
                  <li><a href="/classics" className="hover:text-gold transition-colors">典籍</a></li>
                  <li><a href="/blog" className="hover:text-gold transition-colors">技术博客</a></li>
                  <li><a href="/about" className="hover:text-gold transition-colors">关于我们</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold mb-4">联系我们</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center"><i className="fas fa-envelope mr-2"></i> contact@example.com</li>
                  <li className="flex items-center"><i className="fas fa-phone mr-2"></i> +86 123 4567 8910</li>
                  <li className="flex items-center"><i className="fas fa-map-marker-alt mr-2"></i> 中国河南省郑州市</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">© 2025 文化典籍与技术博客平台. 保留所有权利.</p>
              <div className="flex space-x-4">
                <a href="https://beian.miit.gov.cn/#/Integrated/index" className="text-gray-400 hover:text-gold transition-colors text-sm" target="_blank" rel="noopener noreferrer">
                  豫ICP备2025132893号-1
                </a>
              </div>
            </div>
          </div>
        </footer>

        {/* 文章详情模态框 */}
        {selectedPost && (
          <BlogDetail
            postId={selectedPost.id}
            visible={showDetail}
            onClose={() => setShowDetail(false)}
          />
        )}
      </div>
    </Router>
  );
};

// 首页组件
const HomePage = () => {
  return (
    <div className="text-center py-12">
      <h2 className="text-3xl font-serif font-bold text-deep-brown mb-6">欢迎来到文化典籍与技术博客平台</h2>
      <p className="text-gray-600 max-w-2xl mx-auto mb-8">
        探索传统文化智慧，分享现代技术洞见。这里既有佛教、道教、中医等经典典籍，也有前端、后端、数据库等技术文章。
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <a href="/classics"
          className="px-6 py-3 bg-deep-brown text-white rounded-full hover:bg-opacity-90 transition-colors"
        >
          浏览典籍
        </a>
        <a href="/blog"
          className="px-6 py-3 bg-gold text-deep-brown rounded-full hover:bg-opacity-90 transition-colors"
        >
          查看技术博客
        </a>
      </div>
    </div>
  );
};

// 典籍页面组件（占位）
const ClassicsPage = () => {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-serif font-bold text-deep-brown mb-4">典籍模块</h2>
      <p className="text-gray-500">典籍内容正在整理中，敬请期待...</p>
    </div>
  );
};

// 关于页面组件（占位）
const AboutPage = () => {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-2xl font-serif font-bold text-deep-brown mb-6">关于我们</h2>
      <p className="text-gray-700 mb-4">
        文化典籍与技术博客平台致力于融合传统文化与现代技术，打造一个知识分享与交流的综合性平台。
      </p>
      <p className="text-gray-700 mb-4">
        我们希望通过这个平台，让更多人了解和传承优秀的传统文化，同时分享前沿的技术知识和实践经验。
      </p>
    </div>
  );
};

// 404页面组件
const NotFoundPage = () => {
  return (
    <div className="text-center py-12">
      <i className="fas fa-exclamation-triangle text-5xl text-gold mb-4"></i>
      <h2 className="text-2xl font-serif font-bold text-deep-brown mb-2">页面未找到</h2>
      <p className="text-gray-500 mb-6">您访问的页面不存在或已被移动</p>
      <a href="/"
        className="px-6 py-2 bg-deep-brown text-white rounded-full hover:bg-opacity-90 transition-colors"
      >
        返回首页
      </a>
    </div>
  );
};

export default App;