import Sequelize from 'sequelize';

import { db } from './db';

const queryType = {
  type: Sequelize.QueryTypes.SELECT,
};

export function login(username, password, callback) {
  db.query(`
  SELECT
    id,
    username,
    email,
    fullName
  FROM
    users
  WHERE username = '${username}'
    AND PASSWORD = '${password}'
`, queryType).then(data => callback(data));
}
