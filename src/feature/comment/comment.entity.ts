import { DataType } from 'sequelize-typescript';
import sequelize from '../../db/sequelize';

export const CommentMap = {
  commentId: {
    type: DataType.BIGINT,
    allowNull: false,
    field: 'comment_id',
  },
  commentCreaterId: {
    type: DataType.BIGINT,
    allowNull: false,
    field: 'comment_creater_id',
  },
  commentCreater: {
    type: DataType.STRING,
    allowNull: false,
    field: 'comment_creater',
  },
  commentCreaterProd: {
    type: DataType.STRING,
    allowNull: false,
    field: 'comment_creater_prod',
  },
  commentCreaterAvatar: {
    type: DataType.STRING,
    allowNull: false,
    field: 'comment_creater_avatar',
  },
  commentReceivcerId: {
    type: DataType.BIGINT,
    allowNull: false,
    field: 'comment_receivcer_id',
  },
  commentReceivcer: {
    type: DataType.STRING,
    allowNull: false,
    field: 'comment_receivcer',
  },
  commentReceivcerAvatar: {
    type: DataType.STRING,
    allowNull: false,
    field: 'comment_receivcer_avatar',
  },
  commentCont: {
    type: DataType.STRING,
    allowNull: false,
    field: 'comment_cont',
  },
  articleId: {
    type: DataType.BIGINT,
    allowNull: false,
    field: 'article_id',
  },
  commentParentId: {
    type: DataType.BIGINT,
    allowNull: false,
    field: 'comment_parent_id',
  },
  commentDate: {
    type: DataType.STRING,
    allowNull: false,
    field: 'comment_date',
  },
};

export const Comment = sequelize.define('Comment', CommentMap);
