module.exports = (sequelize, DataTypes) => {
  const BlogPost = sequelize.define('BlogPost', {
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: { notEmpty: true }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: true }
    },
    category: {
      type: DataTypes.ENUM('frontend', 'backend', 'database', 'architecture'),
      allowNull: false
    },
    coverImage: DataTypes.STRING(255),
    author: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: { min: 0 }
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'blog_posts',
    indexes: [
      { name: 'idx_category_views', fields: ['category', { attribute: 'views', order: 'DESC' }] },
      { name: 'idx_created_at', fields: [{ attribute: 'createdAt', order: 'DESC' }] },
      { name: 'fulltext_idx_title_content', fields: ['title', 'content'], using: 'FULLTEXT' }
    ]
  });

  BlogPost.associate = function(models) {
    BlogPost.belongsToMany(models.BlogTag, {
      through: models.PostTagRelation,
      foreignKey: 'postId',
      otherKey: 'tagId',
      as: 'tags'
    });
    BlogPost.hasMany(models.BlogComment,
      { foreignKey: 'postId', as: 'comments' }
    );
  };

  return BlogPost;
};