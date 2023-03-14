/* eslint-disable indent */
import sequelize from '../../db/sequelize';
import { Article } from './article.entity';
import { ArticleUser } from './article_user.entity';
import ArticleDTO from './article.dto';
import { getNow } from '../../utils/date';
export class ArticleRepository {
  countArticles(userId: number) {
    const sql = `select count(*) as result from tb_article where user_id = ${userId}`;
    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT });
  }
  findByNearWeek(userId: number) {
    const sql = `select * from tb_article where user_id = ${userId} and DATE_SUB(CURDATE(), INTERVAL 7 DAY) < date(article_date)`;
    return sequelize.query(sql, { model: ArticleUser, mapToModel: true });
  }
  findCount() {
    const sql = 'select count(*) as total from tb_article';
    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT });
  }
  findCountByKey(keyWord: string) {
    const sql = `select count(*) as total from tb_article where article_content like '%${keyWord}%' or article_title like '%${keyWord}%'`;
    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT });
  }
  findBySort(sortType: string, page: any): Promise<any> {
    let sql = '';
    if (sortType.includes('default')) {
      sql = `select a.article_id, a.user_id, a.article_title, a.article_tip, a.article_content, a.article_views, a.article_likes, a.article_collects, a.article_loves, a.article_date, (select count(*) from tb_comment where article_id = a.article_id) as article_comments, u.* from tb_article a inner join tb_user u on a.user_id = u.user_id order by (a.article_views * 0.5 + a.article_likes * 0.2 + a.article_loves * 0.15 + a.article_collects * 0.15) desc limit ${page.start}, ${page.pageSize}`;
    } else if (sortType.includes('hot')) {
      sql = `select a.article_id, a.user_id, a.article_title, a.article_tip, a.article_content, a.article_views, a.article_likes, a.article_collects, a.article_loves, a.article_date, (select count(*) from tb_comment where article_id = a.article_id) as article_comments, u.* from tb_article a inner join tb_user u on a.user_id = u.user_id order by (a.article_views * 0.1 + a.article_likes * 0.6 + a.article_loves * 0.15 + a.article_collects * 0.15) desc limit ${page.start}, ${page.pageSize}`;
    } else if (sortType.includes('new')) {
      sql = `select a.article_id, a.user_id, a.article_title, a.article_tip, a.article_content, a.article_views, a.article_likes, a.article_collects, a.article_loves, a.article_date, (select count(*) from tb_comment where article_id = a.article_id) as article_comments, u.* from tb_article a inner join tb_user u on a.user_id = u.user_id order by a.article_date desc limit ${page.start}, ${page.pageSize}`;
    }
    return sequelize.query(sql, { model: ArticleUser, mapToModel: true });
  }
  findBySearch(
    keyWord: string,
    sortType: string,
    dateRange: string,
    page: any,
  ): Promise<any> {
    let sql = '';
    const dateCompare = dateRange
      ? `and (a.article_date >= '${
          dateRange.split(',')[0]
        }' and a.article_date <= '${dateRange.split(',')[1]}')`
      : '';
    if (sortType.includes('default')) {
      sql = `select a.article_id, a.user_id, a.article_title, a.article_tip, a.article_content, a.article_views, a.article_likes, a.article_collects, a.article_loves, a.article_date, (select count(*) from tb_comment where article_id = a.article_id) as article_comments, u.* from tb_article a inner join tb_user u on a.user_id = u.user_id where (a.article_content like '%${keyWord}%' or a.article_title like '%${keyWord}%') ${
        dateRange ? dateCompare : ''
      } order by (a.article_views * 0.5 + a.article_likes * 0.2 + a.article_loves * 0.15 + a.article_collects * 0.15) desc limit ${
        page.start
      }, ${page.pageSize}`;
    } else if (sortType.includes('hot')) {
      sql = `select a.article_id, a.user_id, a.article_title, a.article_tip, a.article_content, a.article_views, a.article_likes, a.article_collects, a.article_loves, a.article_date, (select count(*) from tb_comment where article_id = a.article_id) as article_comments, u.* from tb_article a inner join tb_user u on a.user_id = u.user_id where (a.article_content like '%${keyWord}%' or a.article_title like '%${keyWord}%') ${
        dateRange ? dateCompare : ''
      } order by (a.article_views * 0.1 + a.article_likes * 0.6 + a.article_loves * 0.15 + a.article_collects * 0.15) desc limit ${
        page.start
      }, ${page.pageSize}`;
    } else if (sortType.includes('new')) {
      sql = `select a.article_id, a.user_id, a.article_title, a.article_tip, a.article_content, a.article_views, a.article_likes, a.article_collects, a.article_loves, a.article_date, (select count(*) from tb_comment where article_id = a.article_id) as article_comments, u.* from tb_article a inner join tb_user u on a.user_id = u.user_id where (a.article_content like '%${keyWord}%' or a.article_title like '%${keyWord}%') ${
        dateRange ? dateCompare : ''
      } order by a.article_date desc limit ${page.start}, ${page.pageSize}`;
    }
    return sequelize.query(sql, { model: ArticleUser, mapToModel: true });
  }
  findByUserId(userId: number) {
    const sql = `select a.*,u.* from tb_article a inner join tb_user u on a.user_id = u.user_id where a.user_id = ${userId}`;
    return sequelize.query(sql, { model: ArticleUser, mapToModel: true });
  }
  findByAction(userId: number, type: string) {
    const sql = `
      select a.*,u.* from tb_article a 
      right join tb_action c on a.article_id = c.article_id
      inner join tb_user u on a.user_id = u.user_id      
      where c.action_user_id = ${userId} and c.${type} > 0
    `;
    return sequelize.query(sql, { model: ArticleUser, mapToModel: true });
  }
  findByAllAction(userId: number) {
    const sql = `
      select a.*,u.*,c.action_like, c.action_collect, c.action_love from tb_article a 
      right join tb_action c on a.article_id = c.article_id
      inner join tb_user u on a.user_id = u.user_id      
      where c.action_user_id = ${userId} and (c.action_like > 0 or c.action_collect > 0 or c.action_love > 0)
    `;
    return sequelize.query(sql, { model: ArticleUser, mapToModel: true });
  }
  findOne(id: number): Promise<any> {
    const sql = `select a.*,u.* from tb_article a inner join tb_user u on a.user_id = u.user_id where a.article_id=${id}`;
    return sequelize.query(sql, { model: ArticleUser, mapToModel: true });
  }
  findActions(id: number) {
    const sql = `select article_views as views, article_likes as likes, article_collects as collects, article_loves as loves from tb_article where article_id = ${id}`;
    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT });
  }
  findConcatArticles(keys: string) {
    const sql = `select * from tb_article where article_title REGEXP '${keys}' or article_tip REGEXP '${keys}'`;
    return sequelize.query(sql, { model: ArticleUser, mapToModel: true });
  }
  insertOne(articleDTO: ArticleDTO): Promise<any> {
    const {
      userId,
      articleTitle,
      articleTip,
      articleContent,
      articleViews,
      articleLikes,
      articleCollects,
      articleComments,
      articleLoves,
    } = articleDTO;
    const sql = `insert into tb_article(user_id, article_title, article_tip, article_content, article_views, article_likes, article_collects, article_comments, article_loves, article_date) values(${userId},'${articleTitle}','${articleTip}','${articleContent}',${articleViews},${articleLikes},${articleCollects},${articleComments},${articleLoves}, '${getNow()}')`;
    return sequelize.query(sql);
  }

  updateOne(articleDTO: ArticleDTO): Promise<any> {
    const param = {};
    const {
      articleId,
      articleTitle,
      articleTip,
      articleContent,
      articleViews,
      articleLikes,
      articleCollects,
      articleComments,
      articleLoves,
    } = articleDTO;
    ![undefined, null].includes(articleTitle) &&
      (param['articleTitle'] = articleTitle);
    ![undefined, null].includes(articleTip) &&
      (param['articleTip'] = articleTip);
    ![undefined, null].includes(articleContent) &&
      (param['articleContent'] = articleContent);
    ![undefined, null].includes(articleViews) &&
      (param['articleViews'] = articleViews);
    ![undefined, null].includes(articleLikes) &&
      (param['articleLikes'] = articleLikes);
    ![undefined, null].includes(articleCollects) &&
      (param['articleCollects'] = articleCollects);
    ![undefined, null].includes(articleComments) &&
      (param['articleComments'] = articleComments);
    ![undefined, null].includes(articleLoves) &&
      (param['articleLoves'] = articleLoves);

    return Article.update(param, { where: { articleId } });
  }

  delArticle(id: number) {
    const sql = `delete from tb_article where article_id = ${id}`;
    return sequelize.query(sql);
  }

  recommendArticle() {
    const sql = `select a.*,u.* from tb_article a inner join tb_user u on a.user_id = u.user_id order by (a.article_views * 0.1 + a.article_likes * 0.15 + a.article_loves * 0.15 + a.article_collects * 0.4) desc`;
    return sequelize.query(sql, { model: ArticleUser, mapToModel: true });
  }

  readNumIncrement(id: number) {
    const sql = `update tb_article set article_views = article_views + 1 where article_id = ${id}`;
    return sequelize.query(sql);
  }
}
