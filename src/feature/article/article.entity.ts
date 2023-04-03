import { DataType } from 'sequelize-typescript';
import sequelize from '../../db/sequelize';
export const ArticleMap = {
  articleId: {
    type: DataType.BIGINT,
    allowNull: false,
    field: 'article_id',
  },
  userId: {
    type: DataType.BIGINT,
    allowNull: false,
    field: 'user_id',
  },
  articleTitle: {
    type: DataType.STRING,
    allowNull: false,
    field: 'article_title',
  },
  articleTip: {
    type: DataType.STRING,
    allowNull: false,
    field: 'article_tip',
  },
  articleContent: {
    type: DataType.STRING,
    allowNull: false,
    field: 'article_content',
  },
  articleViews: {
    type: DataType.BIGINT,
    allowNull: false,
    field: 'article_views',
  },
  articleLikes: {
    type: DataType.BIGINT,
    allowNull: false,
    field: 'article_likes',
  },
  articleCollects: {
    type: DataType.BIGINT,
    allowNull: false,
    field: 'article_collects',
  },
  articleComments: {
    type: DataType.BIGINT,
    allowNull: false,
    field: 'article_comments',
  },
  articleLoves: {
    type: DataType.BIGINT,
    allowNull: false,
    field: 'article_loves',
  },
  articleDate: {
    type: DataType.DATE,
    allowNull: false,
    field: 'article_date',
  },
  articleStatus: {
    type: DataType.INET,
    allowNull: false,
    field: 'article_status',
  },
};
export const Article = sequelize.define('Article', ArticleMap, {
  tableName: 'tb_article',
  timestamps: false,
});
