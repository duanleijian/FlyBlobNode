import { DataType } from 'sequelize-typescript';
import sequelize from '../../db/sequelize';

export const NoticeMap = {
  noticeId: {
    type: DataType.BIGINT,
    allowNull: false,
    field: 'notice_id',
  },
  noticeTitle: {
    type: DataType.STRING,
    allowNull: false,
    field: 'notice_title',
  },
  noticeTip: {
    type: DataType.STRING,
    allowNull: false,
    field: 'notice_tip',
  },
  noticeReceiverIds: {
    type: DataType.STRING,
    allowNull: false,
    field: 'notice_receiver_ids',
  },
  noticeReceiverName: {
    type: DataType.STRING,
    allowNull: false,
    field: 'notice_receiver_name',
  },
  noticeContent: {
    type: DataType.STRING,
    allowNull: false,
    field: 'notice_content',
  },
  noticeTime: {
    type: DataType.STRING,
    allowNull: false,
    field: 'notice_time',
  },
  noticeStatus: {
    type: DataType.STRING,
    allowNull: false,
    field: 'notice_status',
  },
};

export const Notice = sequelize.define('Notice', NoticeMap);
