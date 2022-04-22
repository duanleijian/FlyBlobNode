/* eslint-disable prettier/prettier */
import sequelize from '../../db/sequelize';
import CommentDTO from './comment.dto';
import { Comment } from './comment.entity';
import { getNow } from '../../utils/date'
export class CommentRepository {

  findAll(id: number) {
    const sql = `select * from tb_comment where article_id = ${id}`;
    return sequelize.query(sql, { model: Comment, mapToModel: true })
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
                  where article_id = ${id} order by comment_date desc`
    return sequelize.query(sql, { model: Comment, mapToModel: true })  
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
