import { DataType } from 'sequelize-typescript';
import sequelize from '../../db/sequelize';
import { ArticleMap } from './article.entity';
import { UserMap } from '../user/user.entity';
export const ArticleUserMap = Object.assign({}, ArticleMap, UserMap);
export const ArticleUser = sequelize.define('ArticleUser', ArticleUserMap);
