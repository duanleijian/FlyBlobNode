import { DataType } from 'sequelize-typescript';
import sequelize from '../../db/sequelize';
export const UserMap = {
  userId: {
    type: DataType.BIGINT,
    allowNull: false,
    field: 'user_id',
  },
  userName: {
    type: DataType.STRING,
    allowNull: true,
    field: 'user_name',
  },
  userPwd: {
    type: DataType.STRING,
    allowNull: true,
    field: 'user_pwd',
  },
  roleId: {
    type: DataType.BIGINT,
    allowNull: true,
    field: 'role_id',
  },
  userNickName: {
    type: DataType.STRING,
    allowNull: true,
    field: 'user_nick_name',
  },
  userPhone: {
    type: DataType.STRING,
    allowNull: true,
    field: 'user_phone',
  },
  userEmail: {
    type: DataType.STRING,
    allowNull: true,
    field: 'user_email',
  },
  userAvatar: {
    type: DataType.STRING,
    allowNull: true,
    field: 'user_avatar',
  },
  userOrgnName: {
    type: DataType.STRING,
    allowNull: true,
    field: 'user_orgn_name',
  },
  userAddress: {
    type: DataType.STRING,
    allowNull: true,
    field: 'user_address',
  },
  userPosition: {
    type: DataType.STRING,
    allowNull: true,
    field: 'user_position',
  },
  userMajor: {
    type: DataType.STRING,
    allowNull: true,
    field: 'user_major',
  },
  userIntroduct: {
    type: DataType.STRING,
    allowNull: true,
    field: 'user_introduct',
  },
  userLoginTime: {
    type: DataType.DATE,
    allowNull: true,
    field: 'user_login_time',
  },
  createTime: {
    type: DataType.DATE,
    allowNull: true,
    field: 'create_time',
  },
  updateTime: {
    type: DataType.DATE,
    allowNull: true,
    field: 'update_time',
  },
  userRelate: {
    type: DataType.DATE,
    allowNull: true,
    field: 'user_relate',
  },
};
export const User = sequelize.define('User', UserMap, {
  tableName: 'tb_user',
  timestamps: false,
});
