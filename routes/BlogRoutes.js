const express = require('express');
const router = express.Router();
const BlogController = require('../controllers/BlogController');
const authMiddleware = require('../middleware/authMiddleware');

// 博客文章路由
router.get('/posts', BlogController.getPosts);
router.get('/posts/:id', BlogController.getPostById);
router.post('/posts', authMiddleware, BlogController.createPost);
router.put('/posts/:id', authMiddleware, BlogController.updatePost);
router.delete('/posts/:id', authMiddleware, BlogController.deletePost);

// 评论路由
router.get('/posts/:postId/comments', BlogController.getComments);
router.post('/comments', BlogController.addComment);

// 标签路由
router.get('/tags', BlogController.getTags);
router.post('/tags', authMiddleware, BlogController.createTag);

module.exports = router;