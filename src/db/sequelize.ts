// import { Sequelize } from 'sequelize-typescript';
const { Sequelize } = require('sequelize');
import db from './db';

const sequelize = new Sequelize(
  db.mysql.database,
  db.mysql.user,
  db.mysql.password,
  {
    host: db.mysql.host,
    dialect: 'mysql',
    pool: {
      max: db.mysql.connectionLimit, // 连接池中最大连接数量
      min: 0, // 连接池中最小连接数量
      acquire: 30000,
      idle: 10000, // 如果一个线程 10 秒钟内没有被使用过的话，那么就释放线程
    },
  },
);
// 检测数据库能否链接
sequelize
  .authenticate()
  .then(() => {
    console.log('数据库连接成功');
  })
  .catch((err) => {
    // 数据库连接失败时打印输出
    console.error(err);
    throw err;
  });

export default sequelize;
