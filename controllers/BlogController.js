const { Op } = require('sequelize');
const { BlogPost, BlogTag, BlogComment, PostTagRelation } = require('../models');

// 获取博客文章列表（支持分类筛选、标签筛选、分页）
exports.getPosts = async (req, res) => {
  try {
    const { category, tag, page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;
    const whereClause = {};

    // 分类筛选
    if (category && category !== 'all') {
      whereClause.category = category;
    }

    // 搜索功能
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } }
      ];
    }

    // 构建查询选项
    const options = {
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{ model: BlogTag, through: { attributes: [] }, as: 'tags' }],
      order: [['views', 'DESC'], ['createdAt', 'DESC']],
      distinct: true
    };

    // 标签筛选（多对多关系查询）
    if (tag) {
      const tagRecord = await BlogTag.findOne({ where: { name: tag } });
      if (!tagRecord) {
        return res.status(200).json({ total: 0, pages: 0, currentPage: parseInt(page), data: [] });
      }
      const posts = await tagRecord.getPosts(options);
      const total = await tagRecord.countPosts({ where: whereClause });
      return res.json({
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        data: posts
      });
    }

    // 执行主查询
    const { count, rows } = await BlogPost.findAndCountAll(options);

    res.json({
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: rows
    });
  } catch (error) {
    res.status(500).json({ error: '获取文章列表失败: ' + error.message });
  }
};

// 获取单篇博客文章详情
exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await BlogPost.findByPk(id, {
      include: [
        { model: BlogTag, through: { attributes: [] }, as: 'tags' },
        { model: BlogComment, as: 'comments', include: [{ model: BlogComment, as: 'replies' }] }
      ]
    });

    if (!post) {
      return res.status(404).json({ error: '文章未找到' });
    }

    // 更新阅读量
    await post.increment('views');

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: '获取文章详情失败: ' + error.message });
  }
};

// 创建新博客文章
exports.createPost = async (req, res) => {
  try {
    const { title, content, category, coverImage, author, tagIds } = req.body;

    // 创建文章
    const post = await BlogPost.create({
      title,
      content,
      category,
      coverImage,
      author
    });

    // 关联标签
    if (tagIds && tagIds.length > 0) {
      const tagRelations = tagIds.map(tagId => ({ postId: post.id, tagId }));
      await PostTagRelation.bulkCreate(tagRelations);
    }

    // 返回包含标签的完整文章
    const newPost = await BlogPost.findByPk(post.id, {
      include: [{ model: BlogTag, through: { attributes: [] }, as: 'tags' }]
    });

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: '创建文章失败: ' + error.message });
  }
};

// 更新博客文章
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, coverImage, tagIds } = req.body;

    const post = await BlogPost.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: '文章未找到' });
    }

    // 更新文章基本信息
    await post.update({
      title,
      content,
      category,
      coverImage
    });

    // 更新标签关联
    if (tagIds) {
      // 删除现有关联
      await PostTagRelation.destroy({ where: { postId: id } });
      // 创建新关联
      if (tagIds.length > 0) {
        const tagRelations = tagIds.map(tagId => ({ postId: id, tagId }));
        await PostTagRelation.bulkCreate(tagRelations);
      }
    }

    // 返回更新后的文章
    const updatedPost = await BlogPost.findByPk(id, {
      include: [{ model: BlogTag, through: { attributes: [] }, as: 'tags' }]
    });

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: '更新文章失败: ' + error.message });
  }
};

// 删除博客文章
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await BlogPost.findByPk(id);

    if (!post) {
      return res.status(404).json({ error: '文章未找到' });
    }

    await post.destroy();
    res.json({ message: '文章已成功删除' });
  } catch (error) {
    res.status(500).json({ error: '删除文章失败: ' + error.message });
  }
};

// 获取文章评论
exports.getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await BlogComment.findAll({
      where: { postId, parentId: null },
      include: [{ model: BlogComment, as: 'replies' }],
      order: [['createdAt', 'DESC']]
    });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: '获取评论失败: ' + error.message });
  }
};

// 添加评论
exports.addComment = async (req, res) => {
  try {
    const { postId, userId, author, content, parentId } = req.body;

    // 验证文章是否存在
    const post = await BlogPost.findByPk(postId);
    if (!post) {
      return res.status(404).json({ error: '文章不存在' });
    }

    const comment = await BlogComment.create({
      postId,
      userId,
      author,
      content,
      parentId
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: '添加评论失败: ' + error.message });
  }
};

// 获取所有标签
exports.getTags = async (req, res) => {
  try {
    const tags = await BlogTag.findAll();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: '获取标签列表失败: ' + error.message });
  }
};

// 创建标签
exports.createTag = async (req, res) => {
  try {
    const { name } = req.body;
    const [tag, created] = await BlogTag.findOrCreate({
      where: { name },
      defaults: { name }
    });

    if (!created) {
      return res.status(409).json({ error: '标签已存在' });
    }

    res.status(201).json(tag);
  } catch (error) {
    res.status(500).json({ error: '创建标签失败: ' + error.message });
  }
};