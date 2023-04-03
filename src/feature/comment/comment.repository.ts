/* eslint-disable prettier/prettier */
import sequelize from '../../db/sequelize';
import { CommentDTO } from './comment.dto';
import { Comment } from './comment.entity';
import { getNow } from '../../utils/date';
import { filterWhere, createWhere } from '@/utils/format';
export class CommentRepository {
  findCount() {
    const sql = 'select count(*) as total from tb_comment';
    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT });
  }
  findAll(id: number) {
    const sql = `select * from tb_comment where article_id = ${id}`;
    return sequelize.query(sql, { model: Comment, mapToModel: true });
  }

  findCommentByArticle(id: number) {
    const sql = `select
                  comment_id,
                  comment_creater_id,
                  u1.user_nick_name as comment_creater,
                  u1.user_introduct as comment_creater_prod,
                  u1.user_avatar as comment_creater_avatar,
                  comment_receivcer_id,
                  u2.user_nick_name as comment_receivcer,
                  u2.user_avatar as comment_receivcer_avatar,
                  comment_cont,
                  article_id,
                  comment_parent_id,
                  comment_date
                  from tb_comment c
                  left join tb_user u1 on c.comment_creater_id = u1.user_id
                  left join tb_user u2 on c.comment_receivcer_id = u2.user_id
                  where article_id = ${id} order by comment_date desc`;
    return sequelize.query(sql, { model: Comment, mapToModel: true });
  }

  findCommentAdminBySort(articleParam: any) {
    const {
      pageNum,
      pageSize,
      sortType,
      commentCreater,
      commentReceivcer,
      commentCont,
      commentDate,
      articleTitle
    } = articleParam;
    const startTime = commentDate? commentDate.split(' ')[0] : '';
    const endTime = commentDate?  commentDate.split(' ')[1] : '';
    const p1 = createWhere(
      () => commentCreater,
      `comment_creater = '${commentCreater}'`,
    );
    const p2 = createWhere(
      () => commentReceivcer,
      `comment_receivcer = '${commentReceivcer}'`,
    );
    const p3 = createWhere(
      () => commentCont,
      `comment_cont like '%${commentCont}%'`,
    );
    const p4 = createWhere(
      () => articleTitle,
      `a.article_title like '%${articleTitle}%'`
    )
    const p5 = createWhere(
      () => startTime && endTime,
      `comment_date >= '${startTime}' and comment_date <= '${endTime}'`,
    );
    const condition = filterWhere([p1, p2, p3, p4, p5]);
    const sql = `select c.*, a.article_title as articleTitle, u.user_nick_name as userNickName from tb_comment c
                 left join tb_article a on c.article_id = a.article_id
				 left join tb_user u on a.user_id = u.user_id
				 ${condition} order by comment_date ${sortType} limit ${pageNum}, ${pageSize}`;
    return sequelize.query(sql, { model: Comment, mapToModel: true });
  }s

  findOne(commentId: number): Promise<any> {
    const sql = `select * from tb_comment where comment_id = ${commentId}`;
    return sequelize.query(sql, { model: Comment, mapToModel: true });
  }

  deleteOne(commentId: number): Promise<any> {
    const sql = `delete from tb_comment where comment_id = ${commentId}`;
    return sequelize.query(sql);
  }

  updateStatusAndReply(commentId: number, reply: string, commentStatus: number): Promise<any> {
    const sql = `update tb_comment set comment_status = ${commentStatus}, comment_acceptance = ${reply} where comment_id = ${commentId}`;
    return sequelize.query(sql);
  }

  insertOne(commentDTO: CommentDTO): Promise<any> {
    const {
      commentCreaterId,
      commentCreater,
      commentCreaterProd,
      commentCreaterAvatar,
      commentReceivcerId,
      commentReceivcer,
      commentReceivcerAvatar,
      commentCont,
      articleId,
      commentParentId,
      commentDate,
    } = commentDTO;

    const sql = `insert into tb_comment(
      comment_creater_id,
      comment_creater,
      comment_creater_prod,
      comment_creater_avatar,
      comment_receivcer_id,
      comment_receivcer,
      comment_receivcer_avatar,
      comment_cont,
      article_id,
      comment_parent_id,
      comment_date) values(
        ${commentCreaterId ? commentCreaterId : null},
        '${commentCreater ? commentCreater : ''}',
        '${commentCreaterProd ? commentCreaterProd : ''}',
        '${commentCreaterAvatar ? commentCreaterAvatar : ''}',
        ${commentReceivcerId ? commentReceivcerId : null},
        '${commentReceivcer ? commentReceivcer : ''}',
        '${commentReceivcerAvatar ? commentReceivcerAvatar : ''}',
        '${commentCont ? commentCont : ''}',
        ${articleId ? articleId : null},
        ${commentParentId ? commentParentId : null},
        '${getNow()}')`;
    return sequelize.query(sql);
  }
}
