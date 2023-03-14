import sequelize from '../../db/sequelize';
const { QueryTypes } = require('sequelize');
import { Action } from './action.entity';
import { ActionDTO } from './action.dto';
export class ActionRepository {
  insertOne(actionDTO: ActionDTO) {
    const { articleId, actionUserId, actionLike, actionCollect, actionLove } =
      actionDTO;
    const sql = `insert into tb_action(article_id, action_user_id, action_like, action_collect, action_love) values(${articleId}, ${actionUserId}, ${actionLike}, ${actionCollect}, ${actionLove})`;
    return sequelize.query(sql);
  }

  async updateOne(actionDTO: ActionDTO) {
    const { actionId, actionLike, actionCollect, actionLove, articleId } =
      actionDTO;
    const param = {};
    ![undefined, null].includes(actionLike) &&
      (param['actionLike'] = actionLike);

    ![undefined, null].includes(actionCollect) &&
      (param['actionCollect'] = actionCollect);

    ![undefined, null].includes(actionLove) &&
      (param['actionLove'] = actionLove);
    return Action.update(param, { where: { articleId } });
  }

  countOne(articleId: number, userId: number) {
    const sql = `select count(*) as result from tb_action where article_id = ${articleId} and action_user_id = ${userId}`;
    return sequelize.query(sql, { type: QueryTypes.SELECT });
  }

  findArticleActions(articleId: number, actionUserId: number) {
    const sql = `select action_like as likes, action_love as loves, action_collect as collects from tb_action where article_id = ${articleId} and action_user_id = ${actionUserId}`;
    return sequelize.query(sql, { type: QueryTypes.SELECT });
  }

  staticsAuthorCount(userId: number) {
    const sql = `select 
                      (select count(*) from tb_article where user_id = ${userId}) as articles,
                      (select count(*) from tb_user where locate('${userId}', user_relate)) as follows,
                      (select CAST(sum(article_views) as UNSIGNED) from tb_article where user_id = ${userId}) as views,
                      (select CAST(sum(article_likes) as UNSIGNED) from tb_article where user_id = ${userId}) as likes,
                      (select CAST(sum(article_loves) as UNSIGNED) from tb_article where user_id = ${userId}) as loves,
                      (select CAST(sum(article_collects) as UNSIGNED) from tb_article where user_id = ${userId}) as collects
                      from tb_user where user_id = ${userId}`;
    return sequelize.query(sql, { type: QueryTypes.SELECT });
  }
}
