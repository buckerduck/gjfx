import React, { useState, useEffect } from 'react';
import { getCategoryText } from '../../utils/formatDate';
import BlogCard from './BlogCard';
import { fetchPosts, fetchTags } from '../../services/api';

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    tag: '',
    page: 1,
    search: ''
  });
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    currentPage: 1
  });

  // 获取标签列表
  useEffect(() => {
    const loadTags = async () => {
      try {
        const data = await fetchTags();
        setTags(data);
      } catch (err) {
        console.error('加载标签失败:', err);
      }
    };
    loadTags();
  }, []);

  // 获取文章列表（带筛选条件）
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const response = await fetchPosts(filters);
        setPosts(response.data);
        setPagination({
          total: response.total,
          pages: response.pages,
          currentPage: response.currentPage
        });
      } catch (err) {
        setError('加载文章失败，请重试');
        console.error('加载文章错误:', err);
      } finally {
        setLoading(false);
      }
    };

    // 添加延迟防抖，避免频繁请求
    const timer = setTimeout(() => {
      loadPosts();
    }, 300);

    return () => clearTimeout(timer);
  }, [filters]);

  // 处理分类筛选
  const handleCategoryChange = (category) => {
    setFilters(prev => ({ ...prev, category, page: 1 }));
  };

  // 处理标签筛选
  const handleTagChange = (tag) => {
    setFilters(prev => ({ ...prev, tag, page: 1 }));
  };

  // 处理搜索
  const handleSearch = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };

  // 分页处理
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setFilters(prev => ({ ...prev, page: newPage }));
      window.scrollTo(0, 0);
    }
  };

  if (loading && posts.length === 0) {
    return (
      <div className="text-center py-12">
        <i className="fas fa-spinner fa-spin text-3xl text-gold mb-4"></i>
        <p className="text-gray-600">加载文章中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="blog-list-container">
      {/* 筛选工具栏 */}
      <div className="bg-cream p-4 rounded-lg mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* 分类筛选 */}
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filters.category === 'all' ? 'bg-deep-brown text-white' : 'bg-white text-deep-brown hover:bg-gray-100'}`}
              onClick={() => handleCategoryChange('all')}
            >
              全部
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filters.category === 'frontend' ? 'bg-deep-brown text-white' : 'bg-white text-deep-brown hover:bg-gray-100'}`}
              onClick={() => handleCategoryChange('frontend')}
            >
              前端开发
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filters.category === 'backend' ? 'bg-deep-brown text-white' : 'bg-white text-deep-brown hover:bg-gray-100'}`}
              onClick={() => handleCategoryChange('backend')}
            >
              后端开发
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filters.category === 'database' ? 'bg-deep-brown text-white' : 'bg-white text-deep-brown hover:bg-gray-100'}`}
              onClick={() => handleCategoryChange('database')}
            >
              数据库
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filters.category === 'architecture' ? 'bg-deep-brown text-white' : 'bg-white text-deep-brown hover:bg-gray-100'}`}
              onClick={() => handleCategoryChange('architecture')}
            >
              系统架构
            </button>
          </div>

          {/* 搜索框 */}
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              placeholder="搜索文章..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gold"
              value={filters.search}
              onChange={handleSearch}
            />
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>

        {/* 标签筛选 */}
        {tags.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">标签:</p>
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-3 py-1 rounded-full text-xs transition-colors ${!filters.tag ? 'bg-deep-brown text-white' : 'bg-white text-deep-brown hover:bg-gray-100'}`}
                onClick={() => handleTagChange('')}
              >
                全部
              </button>
              {tags.map(tag => (
                <button
                  key={tag.id}
                  className={`px-3 py-1 rounded-full text-xs transition-colors ${filters.tag === tag.name ? 'bg-deep-brown text-white' : 'bg-white text-deep-brown hover:bg-gray-100'}`}
                  onClick={() => handleTagChange(tag.name)}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 文章列表 */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <i className="fas fa-file-alt text-4xl text-gray-300 mb-4"></i>
          <h3 className="text-xl font-medium text-gray-500">未找到相关文章</h3>
          <p className="text-gray-400 mt-2">尝试调整筛选条件或搜索关键词</p>
        </div>
      )}

      {/* 分页控件 */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center mt-10 gap-2">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            <i className="fas fa-angle-left"></i>
          </button>
          {[...Array(pagination.pages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${pagination.currentPage === i + 1 ? 'bg-deep-brown text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.pages}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            <i className="fas fa-angle-right"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogList;