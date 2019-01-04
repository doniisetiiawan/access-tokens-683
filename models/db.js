import Sequelize from 'sequelize';
import config from '../config';

export const db = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    dialect: config.db.dialect,
    operatorsAliases: false,
  },
);
