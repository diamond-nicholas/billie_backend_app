/* eslint-disable camelcase */
const pool = require('../config/db');

class UserModel {
  static async UserExists(email) {
    const users = await pool.query(
      'SELECT * FROM users WHERE email=$1',
      [email],
    );
    return users;
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

  static async RetrieveUserDetails({ email }) {
    const { rows: user } = await pool.query(
      'SELECT * FROM users WHERE email = $1', [email],
    );
    return user;
  }
}

module.exports = UserModel;
