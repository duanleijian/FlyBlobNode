const dbConfig = {
  mysql: {
    port: '3306',
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'blog',
    connectionLimit: 10,
    // timezone: '-08:00',
  },
};
export default dbConfig;
