/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable indent */
/* eslint-disable prettier/prettier */
import sequelize from '../../db/sequelize'
import { User } from "./user.entity"
import { Article } from '../article/article.entity'
export class UserRepository {
    countFollow(userId: number) {
        const sql = `select count(*) as result from tb_user where locate('${userId}', user_relate)`
        return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })       
    }

    countFollowUser(userId: number) {
        const sql = `select user_relate as result from tb_user where user_id = ${userId}`
        return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
    }

    countArticles(userId: number) {
        const sql = `select count(*) as result from tb_article where user_id = ${userId}`
        return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
    }

    countAction(userId: number) {
        const sql = `select CAST(sum(action_like) as UNSIGNED) as likes, CAST(sum(action_love) as UNSIGNED) as loves, CAST(sum(action_collect) as UNSIGNED) as collects from tb_action where action_user_id = ${userId}`;
        return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
    }

    countAuthorCount(userId: number) {
        const sql = `select 
                     (select count(*) from tb_article where user_id = ${userId}) as articles,
                     (select count(*) from tb_user where locate('${userId}', user_relate)) as follows,
                     (select CAST(sum(action_like) as UNSIGNED) from tb_user where user_id = ${userId}) as likes  
                      from tb_action where action_user_id = ${userId}`
        return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
    }

    findAll(): Promise<any> {
        const sql = `select * from tb_user`
        return sequelize.query(sql, { model: User, mapToModel: true })
    }

    findOne(userName, passWord): Promise<any> {
        const sql = `select count(*) as result from tb_user where user_name = '${userName}' and user_pwd = '${passWord}'`
        return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
    }

    findOneById(id: number) {
        const sql = `select * from tb_user where user_id = ${id}`;
        return sequelize.query(sql, { model: User, mapToModel: true})
    }

    findOneDetail(userName, passWord): Promise<any> {
        const sql = `select * from tb_user where user_name = '${userName}' and user_pwd = '${passWord}'`
        return sequelize.query(sql, { model: User, mapToModel: true })
    }

    findFollowByIds(userIds: string) {
        const sql = `select * from tb_user where user_id in (${userIds})`
        return sequelize.query(sql, { model: User, mapToModel: true })
    }

    insertOne(user: any) {
        const { userName, userPwd, userNickName } = user
        const sql = `insert into tb_user (user_name, user_pwd, user_nick_name, user_relate) values('${userName}', '${userPwd}', '${userNickName}', '')`
        return sequelize.query(sql)
    }

    updateOne(user: any): Promise<any> {
        const {
            userId,
            userName,
            userPwd,
            roleId,
            userNickName,
            userPhone,
            userEmail,
            userAddress,
            userAvatar,
            userOrgnName,
            userPosition,
            userMajor,
            userIntroduct,
            userLoginTime,
            createTime,
            updateTime
        } = user
        const sql = `update tb_user set
                     user_nick_name='${userNickName ? userNickName : ''}',                     
                     user_email='${userEmail ? userEmail : ''}',
                     user_address='${userAddress ? userAddress : ''}',
                     user_orgn_name='${userOrgnName ? userOrgnName : ''}',
                     user_position='${userPosition ? userPosition : ''}',
                     user_major='${userMajor ? userMajor : ''}',
                     user_introduct='${userIntroduct ? userIntroduct : ''}'
                     where user_id = ${userId}`
        return sequelize.query(sql)
    }

    updateRelate(userId: number, userRelate: string) {
        const sql = `update tb_user set user_relate = '${userRelate}' where user_id = ${userId}`
        return sequelize.query(sql)
    }

    updateAvatar(userId: number, avatarUrl: string) {
        const sql = `update tb_user set user_avatar = '${avatarUrl}' where user_id = ${userId}`
        return sequelize.query(sql)
    }

    updateEmail(userId: number, email: string) {
        const sql = `update tb_user set user_email = '${email}' where user_id = ${userId}`
        return sequelize.query(sql)
    }

    updatePwd(userId: number, userPwd: string) {
        const sql = `update tb_user set user_pwd = '${userPwd}' where user_id = ${userId}`
        return sequelize.query(sql)
    }

    concatOne(ids: string, id: number) {
        const sql = `update tb_user set user_relate='${ids}' where user_id = ${id}`
        return sequelize.query(sql)
    }

    recommendAuthor() {
        const sql = `select *,
        (select count(*) from tb_article where user_id = u.user_id) as articles,
        (select count(*) from tb_user where locate(u.user_id, user_relate)) as fans,
        (select sum(article_likes) from tb_article where user_id = u.user_id) as likes,
        (select sum(article_collects) from tb_article where user_id = u.user_id) as collects,
        (select sum(article_loves) from tb_article where user_id = u.user_id) as loves        
        from tb_user u order by (articles * 0.3 + fans * 0.05 + likes * 0.2 + collects * 0.2 + loves * 0.2) desc`
        return sequelize.query(sql, { model: User, mapToModel: true })
    }

    queryArticleByUsers(userIds: Array<number>) {
        const sql = `select * from tb_article where user_id in (${userIds})`
        return sequelize.query(sql, { model: Article, mapToModel: true })
    }
}
