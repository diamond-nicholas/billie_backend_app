/* eslint-disable camelcase */
const pool = require('../config/db');

class UserModel {
  static async UserExists({ email }) {
    const { rows: user } = await pool.query('SELECT * FROM users WHERE email = $[email]', [email]);
    return user[0];
  }

  static async CreateNewUser({
    name, username, email, password, date_created,
  }) {
    const { rows: user } = await pool.query(
      'INSERT INTO users(name, username, email, password, date_created) VALUES($1, $2, $3, $4, $5) returning *',
      [name, username, email, password, date_created],
    );
    return user[0];
  }
}

module.exports = UserModel;
