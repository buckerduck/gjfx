import React, { useState, useEffect } from 'react';
import { formatDate } from '../../utils/formatDate';
import { getCategoryText } from '../../utils/formatDate';
import { fetchPostDetail, createComment, fetchComments } from '../../services/api';
import authMiddleware from '../../middleware/authMiddleware';

const BlogDetail = ({ postId, visible, onClose }) => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 检查用户登录状态
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };
    checkAuth();
  }, []);

  // 获取文章详情
  useEffect(() => {
    if (!visible || !postId) return;

    const loadPostDetail = async () => {
      setLoading(true);
      try {
        const data = await fetchPostDetail(postId);
        setPost(data);
        // 加载评论
        const commentData = await fetchComments(postId);
        setComments(commentData);
      } catch (err) {
        setError('加载文章失败，请关闭重试');
        console.error('加载文章详情错误:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPostDetail();
  }, [visible, postId]);

  // 关闭模态框时重置状态
  useEffect(() => {
    if (!visible) {
      setPost(null);
      setComments([]);
      setError(null);
      setCommentText('');
    }
  }, [visible]);

  // 发表评论
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !isLoggedIn) return;

    setCommentLoading(true);
    try {
      const newComment = await createComment({
        postId,
        content: commentText
      });
      setComments([...comments, newComment]);
      setCommentText('');
    } catch (err) {
      alert('评论发表失败，请重试');
      console.error('发表评论错误:', err);
    } finally {
      setCommentLoading(false);
    }
  };

  // 点击模态框外部关闭
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleOverlayClick}>
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>

      {/* 模态框内容 */}
      <div className="relative bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-600 z-10"
        >
          <i className="fas fa-times"></i>
        </button>

        {/* 加载状态 */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-96">
            <i className="fas fa-spinner fa-spin text-3xl text-gold mb-4"></i>
            <p className="text-gray-600">加载文章中...</p>
          </div>
        )}

        {/* 错误状态 */}
        {error && (
          <div className="flex flex-col items-center justify-center h-96 p-6 text-center">
            <i className="fas fa-exclamation-triangle text-3xl text-red-500 mb-4"></i>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-deep-brown text-white rounded-full hover:bg-opacity-90"
            >
              关闭
            </button>
          </div>
        )}

        {/* 文章内容 */}
        {post && (
          <div className="divide-y divide-gray-100">
            {/* 文章头部 */}
            <div className="relative h-64 md:h-80">
              {post.coverImage ? (
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {e.target.src = '/public/images/default-cover.jpg';}}
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <i className="fas fa-file-alt text-6xl text-gray-300"></i>
                </div>
              )}
              <div className="absolute top-4 left-4 bg-deep-brown text-white text-xs font-medium px-3 py-1 rounded-full">
                {getCategoryText(post.category)}
              </div>
            </div>

            {/* 文章主体 */}
            <div className="p-6 md:p-8">
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-deep-brown mb-4">{post.title}</h1>

              {/* 文章元信息 */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center">
                  <i className="fas fa-user mr-2"></i>
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-calendar-alt mr-2"></i>
                  <span>{formatDate(post.createdAt)}</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-eye mr-2"></i>
                  <span>{post.views} 阅读</span>
                </div>
                {post.updatedAt !== post.createdAt && (
                  <div className="flex items-center">
                    <i className="fas fa-history mr-2"></i>
                    <span>最后更新: {formatDate(post.updatedAt)}</span>
                  </div>
                )}
              </div>

              {/* 标签 */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {post.tags.map(tag => (
                    <span key={tag.id || tag.name} className="px-3 py-1 bg-cream text-deep-brown text-xs rounded-full">
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* 文章内容 */}
              <div className="prose prose-lg max-w-none text-gray-700 mb-8">
                {/* 这里假设content是HTML格式，实际项目中应考虑XSS防护 */}
                <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
              </div>

              {/* 分享按钮 */}
              <div className="flex items-center gap-4 mb-8 pt-6 border-t border-gray-100">
                <span className="text-sm text-gray-500">分享:</span>
                <button className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1DA1F2] text-white hover:bg-opacity-90 transition-colors">
                  <i className="fab fa-twitter"></i>
                </button>
                <button className="w-9 h-9 flex items-center justify-center rounded-full bg-[#4267B2] text-white hover:bg-opacity-90 transition-colors">
                  <i className="fab fa-facebook"></i>
                </button>
                <button className="w-9 h-9 flex items-center justify-center rounded-full bg-[#25D366] text-white hover:bg-opacity-90 transition-colors">
                  <i className="fab fa-whatsapp"></i>
                </button>
                <button className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">
                  <i className="fas fa-link"></i>
                </button>
              </div>
            </div>

            {/* 评论区 */}
            <div className="p-6 md:p-8 bg-gray-50">
              <h2 className="text-xl font-serif font-bold text-deep-brown mb-6">评论 ({comments.length})</h2>

              {/* 评论表单 */}
              <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
                {isLoggedIn ? (
                  <form onSubmit={handleCommentSubmit}>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                      rows={3}
                      placeholder="写下你的评论..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      required
                    ></textarea>
                    <div className="flex justify-end mt-3">
                      <button
                        type="submit"
                        disabled={commentLoading}
                        className="px-5 py-2 bg-deep-brown text-white rounded-full text-sm hover:bg-opacity-90 disabled:opacity-70"
                      >
                        {commentLoading ? (
                          <i className="fas fa-spinner fa-spin mr-1"></i>
                        ) : null}
                        发表评论
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <p>请先登录后发表评论</p>
                    <button className="mt-2 text-gold hover:underline">登录</button>
                  </div>
                )}
              </div>

              {/* 评论列表 */}
              {comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map(comment => (
                    <div key={comment.id} className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 flex-shrink-0">
                          {comment.author.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-deep-brown">{comment.author}</span>
                            <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
                          </div>
                          <p className="text-sm text-gray-700">{comment.content}</p>
                          {/* 简单的回复功能占位 */}
                          <button className="text-xs text-gold mt-1 hover:underline">回复</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400 bg-white rounded-lg">
                  <i className="fas fa-comment-alt text-3xl mb-2"></i>
                  <p>暂无评论，来发表第一条评论吧</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetail;