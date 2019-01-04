export default {
  db: {
    dialect: 'mysql',
    host: 'localhost',
    database: 'blog',
    user: 'root',
    password: '',
  },
  security: {
    secretKey: 'C0d3j0bs',
    expiresIn: '1h',
  },
};
