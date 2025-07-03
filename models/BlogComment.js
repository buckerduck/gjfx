module.exports = (sequelize, DataTypes) => {
  const BlogComment = sequelize.define('BlogComment', {
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'blog_posts',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    userId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    author: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: true }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: true }
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'blog_comments',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'blog_comments',
    indexes: [
      { name: 'idx_post_id', fields: ['postId'] },
      { name: 'idx_parent_id', fields: ['parentId'] }
    ]
  });

  BlogComment.associate = function(models) {
    BlogComment.belongsTo(models.BlogPost, { foreignKey: 'postId', as: 'post' });
    BlogComment.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    BlogComment.hasMany(models.BlogComment, { foreignKey: 'parentId', as: 'replies' });
  };

  return BlogComment;
};