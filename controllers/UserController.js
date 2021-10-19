/* eslint-disable consistent-return */
/* eslint-disable camelcase */
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
// const hashPassword = require('../helpers/hashPassword');
const UserModel = require('../db/users.db');
const pool = require('../config/db');

class UserController {
  static async CreateUser(req, res) {
    try {
      const { password, email, name } = req.body;
      if (!req.body) return res.status(402).json({ message: 'No request body' });
      if (!email || !password || !name) return res.status(402).json({ message: 'User field cannot be empty' });
      const hashedPassword = bcrypt.hashSync(password, 10);
      const date_created = moment().format();
      const user = await UserModel.CreateNewUser({
        name, username: `user${nanoid(10)}`, email, password: hashedPassword, date_created,
      });
      return res.status(201).json({ message: 'Account created successfully', user });
    } catch (err) {
      res.status(400).json({ message: err });
    }
  }

  static async LoginUser(req, res) {
    try {
      const { email, password } = req.body;
      const users = await pool.query(
        'SELECT * FROM users WHERE email=$1',
        [email],
      );
      const user = users.rows[0];
      if (user.length === 0) {
        return res.status(401).json({ message: 'Invalid username or email' });
      }
      const validPassword = bcrypt.compare(password, user.password);
      if (!validPassword) { return res.status(401).json({ message: 'Invalid password' }); }
      const token = jwt.sign({ email }, process.env.SECRET, { expiresIn: '2d' });
      const currentTime = moment().format();
      const loggedInTime = await pool.query('UPDATE users SET last_loggedin = $1 WHERE email = $2 RETURNING last_loggedin ', [currentTime, email]);

      res.json({ message: 'User logged in successfully', token, lastLoggedIn: loggedInTime.rows[0] });
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  }
}

module.exports = UserController;
