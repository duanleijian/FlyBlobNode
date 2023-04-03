import sequelize from '../../db/sequelize';
import { createSet, filterSet, getValue } from '@/utils/format';
import { NoticeDTO } from './notice.dto';
import { Notice } from './notice.entity';
import { getNow } from '../../utils/date';
import { filterWhere, createWhere } from '@/utils/format';

export class NoticeRepository {
  findCount() {
    const sql = 'select count(*) as total from tb_notice';
    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT });
  }

  insertOne(notice: NoticeDTO) {
    const {
      noticeReceiverIds,
      noticeTip,
      noticeTitle,
      noticeReceiverName,
      noticeContent,
      noticeTime,
    } = notice;
    const sql = `insert into tb_notice(notice_tip, notice_title, notice_receiver_ids, notice_receiver_name, notice_content, notice_time, notice_status) values(${getValue(
      noticeTip,
    )},${getValue(noticeTitle)}, ${getValue(noticeReceiverIds)}, ${getValue(
      noticeReceiverName,
    )}, ${getValue(noticeContent)}, ${getValue(noticeTime)}, 0)`;
    return sequelize.query(sql);
  }

  findOne(id: number) {
    const sql = `select * from tb_notice where notice_id = ${id}`;
    return sequelize.query(sql, { model: Notice, mapToModel: true });
  }

  findAdminBySort(noticeParams: any) {
    const {
      pageNum,
      pageSize,
      sortType,
      noticeTitle,
      noticeContent,
      noticeTime,
      noticeStatus,
    } = noticeParams;
    const startTime = noticeTime ? noticeTime.split(' ')[0] : '';
    const endTime = noticeTime ? noticeTime.split(' ')[1] : '';
    const p1 = createWhere(
      () => noticeContent,
      `notice_content like '%${noticeContent}%'`,
    );
    const p2 = createWhere(
      () => noticeStatus,
      `notice_status = ${noticeStatus}`,
    );
    const p3 = createWhere(
      () => noticeTitle,
      `notice_title like '%${noticeTitle}%'`,
    );
    const p4 = createWhere(
      () => startTime && endTime,
      `notice_status >= '${startTime}' and notice_status <= '${endTime}'`,
    );
    const condition = filterWhere([p1, p2, p3, p4]);
    const sql = `select * from tb_notice ${condition} order by notice_time ${sortType} limit ${pageNum}, ${pageSize}`;
    return sequelize.query(sql, { model: Notice, mapToModel: true });
  }

  updateOne(noticeDTO: NoticeDTO) {
    const { noticeId, noticeContent, noticeTitle, noticeTip } = noticeDTO;
    const p1 = createSet(noticeContent, 'notice_content');
    const p2 = createSet(noticeTitle, 'notice_title');
    const p3 = createSet(noticeTip, 'notice_tip');
    const setSql = filterSet([p1, p2, p3]);
    const sql = `update tb_notice set ${setSql} where notice_id = ${noticeId}`;
    return sequelize.query(sql);
  }

  updateStatus(id: number, status: number) {
    const sql = `update tb_notice set notice_status = ${status} where notice_id = ${id}`;
    return sequelize.query(sql);
  }

  deleteOne(id: number) {
    const sql = `delete from tb_notice where notice_id = ${id}`;
    return sequelize.query(sql);
  }
}
