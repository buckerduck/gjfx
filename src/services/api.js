import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// 请求拦截器 - 添加认证token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // 处理401未授权错误
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * 博客文章相关API
 */

// 获取文章列表（支持分页和筛选）
export const fetchPosts = async (filters = {}) => {
  const { category, tag, page = 1, limit = 10, search = '' } = filters;
  const params = { page, limit };
  if (category && category !== 'all') params.category = category;
  if (tag) params.tag = tag;
  if (search) params.search = search;
  return api.get('/blog/posts', { params });
};

// 获取文章详情
export const fetchPostDetail = async (postId) => {
  return api.get(`/blog/posts/${postId}`);
};

// 创建文章（需要认证）
export const createPost = async (postData) => {
  return api.post('/blog/posts', postData);
};

// 更新文章（需要认证）
export const updatePost = async (postId, postData) => {
  return api.put(`/blog/posts/${postId}`, postData);
};

// 删除文章（需要认证）
export const deletePost = async (postId) => {
  return api.delete(`/blog/posts/${postId}`);
};

/**
 * 标签相关API
 */

// 获取所有标签
export const fetchTags = async () => {
  return api.get('/blog/tags');
};

// 创建标签（需要认证）
export const createTag = async (tagData) => {
  return api.post('/blog/tags', tagData);
};

/**
 * 评论相关API
 */

// 获取文章评论
export const fetchComments = async (postId) => {
  return api.get(`/blog/posts/${postId}/comments`);
};

// 创建评论（需要认证）
export const createComment = async (commentData) => {
  return api.post('/blog/comments', commentData);
};

/**
 * 用户认证相关API
 */

// 用户登录
export const login = async (credentials) => {
  return api.post('/auth/login', credentials);
};

// 用户注册
export const register = async (userData) => {
  return api.post('/auth/register', userData);
};

// 获取当前用户信息
export const getCurrentUser = async () => {
  return api.get('/auth/me');
};

// 登出
export const logout = () => {
  localStorage.removeItem('token');
};

/**
 * 分类相关API
 */

// 获取所有分类
export const fetchCategories = async () => {
  return api.get('/blog/categories');
};

// 上传图片（需要认证）
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return api.post('/blog/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// 导出默认API实例
export default api;