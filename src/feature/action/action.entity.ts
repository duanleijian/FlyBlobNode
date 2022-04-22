import { DataType } from 'sequelize-typescript';
import sequelize from '../../db/sequelize';
export const ActionMap = {
  actionId: {
    type: DataType.BIGINT,
    allowNull: false,
    field: 'article_id',
  },
  articleId: {
    type: DataType.BIGINT,
    allowNull: false,
    field: 'article_id',
  },
  actionUserId: {
    type: DataType.BIGINT,
    allowNull: false,
    field: 'action_user_id',
  },
  actionLike: {
    type: DataType.INTEGER,
    allowNull: false,
    field: 'action_like',
  },
  actionCollect: {
    type: DataType.INTEGER,
    allowNull: false,
    field: 'action_collect',
  },
  actionLove: {
    type: DataType.INTEGER,
    allowNull: false,
    field: 'action_love',
  },
};
export const Action = sequelize.define('Action', ActionMap, {
  tableName: 'tb_action',
  timestamps: false,
});
