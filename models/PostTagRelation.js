module.exports = (sequelize, DataTypes) => {
  const PostTagRelation = sequelize.define('PostTagRelation', {
    postId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'blog_posts',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    tagId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'blog_tags',
        key: 'id'
      },
      onDelete: 'CASCADE'
    }
  }, {
    tableName: 'post_tag_relations',
    timestamps: false,
    indexes: [
      { name: 'idx_post_id', fields: ['postId'] },
      { name: 'idx_tag_id', fields: ['tagId'] }
    ]
  });

  return PostTagRelation;
};