module.exports = (sequelize, DataTypes) => {
  const BlogTag = sequelize.define('BlogTag', {
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: { notEmpty: true }
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
    tableName: 'blog_tags',
    indexes: [
      { name: 'idx_tag_name', fields: ['name'], unique: true }
    ]
  });

  BlogTag.associate = function(models) {
    BlogTag.belongsToMany(models.BlogPost,
      { through: models.PostTagRelation,
        foreignKey: 'tagId',
        otherKey: 'postId',
        as: 'posts'
      }
    );
  };

  return BlogTag;
};