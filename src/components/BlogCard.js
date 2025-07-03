import React from 'react';
import { getCategoryText } from '../../utils/formatDate';
import { formatDate } from '../../utils/formatDate';

const BlogCard = ({ post, onViewPost }) => {
  // 处理文章点击事件
  const handleClick = () => {
    if (onViewPost) {
      onViewPost(post);
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer" onClick={handleClick}>
      {/* 文章封面图 */}
      <div className="relative h-48 bg-gray-100">
        {post.coverImage ? (
          <img 
            src={post.coverImage} 
            alt={post.title} 
            className="w-full h-full object-cover"
            onError={(e) => {e.target.src = '/public/images/default-cover.jpg';}}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <i className="fas fa-file-alt text-5xl text-gray-300"></i>
          </div>
        )}
        {/* 分类标签 */}
        <div className="absolute top-3 left-3 bg-deep-brown text-white text-xs font-medium px-2 py-1 rounded-full">
          {getCategoryText(post.category)}
        </div>
      </div>

      {/* 文章内容 */}
      <div className="p-5">
        <h3 className="text-lg font-serif font-bold mb-2 line-clamp-2 text-deep-brown hover:text-gold transition-colors">{post.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.content.substring(0, 120)}...</p>

        {/* 标签列表 */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map(tag => (
              <span key={tag.id || tag.name} className="text-xs bg-cream text-deep-brown px-2 py-1 rounded-full">
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* 底部信息 */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="flex items-center text-xs text-gray-500">
            <i className="fas fa-calendar-alt mr-1"></i>
            <span>{formatDate(post.createdAt)}</span>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <i className="fas fa-eye mr-1"></i>
            <span>{post.views} 阅读</span>
          </div>
          <button className="text-gold font-medium hover:text-deep-brown transition-colors text-sm">
            阅读全文 <i className="fas fa-angle-right ml-1"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;