/* eslint-disable consistent-return */
/* eslint-disable camelcase */
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
// const hashPassword = require('../helpers/hashPassword');
const UserModel = require('../db/users.db');
const pool = require('../config/db');
const OAuth2Client = require('google-auth-library');
const client = new OAuth2Client('');

class UserController {
  static async CreateUser(req, res) {
    try {
      const { password, email, name } = req.body;
      if (!req.body)
        return res.status(402).json({ message: 'No request body' });
      if (!email || !password || !name)
        return res.status(402).json({ message: 'User field cannot be empty' });
      const hashedPassword = bcrypt.hashSync(password, 10);
      const date_created = moment().format();
      const token = jwt.sign({ email }, process.env.SECRET, {
        expiresIn: '2d',
      });
      console.log(req.body);
      const user = await UserModel.CreateNewUser({
        name,
        username: `user${nanoid(10)}`,
        email,
        password: hashedPassword,
        date_created,
      });
      return res
        .status(201)
        .json({ message: 'Account created successfully', token, user });
    } catch (err) {
      res.status(400).json(err.message);
    }
  }

  static async GetUser(req, res) {
    try {
      const users = await pool.query('SELECT * FROM users WHERE userid=$1', [
        parseInt(req.params.id),
      ]);
      if (users.rows.length === 0)
        res.status(200).json({ message: 'No such user exists' });
      res.status(200).json({
        message: 'User info retrieved successfully',
        user: users.rows[0],
      });
    } catch (err) {
      res.status(400).json(err.message);
    }
  }

  static async GetAllUsers(req, res) {
    try {
      const users = await pool.query('SELECT * FROM users');
      // if (users.rows.length === 0)res.status(200).json({ message: 'No users exist' });
      res.status(200).json({
        message: 'All users retrieved successfully',
        users: users.rows,
      });
    } catch (err) {
      res.status(400).json(err.message);
    }
  }

  static async LoginUser(req, res) {
    try {
      const { email, password } = req.body;
      const users = await pool.query('SELECT * FROM users WHERE email=$1', [
        email,
      ]);
      const user = users.rows[0];
      if (user.length === 0) {
        return res.status(401).json({ message: 'Invalid username or email' });
      }
      const validPassword = bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid password' });
      }
      const userid = await pool.query('SELECT * FROM users WHERE email=$1', [
        email,
      ]);
      const token = jwt.sign({ email }, process.env.SECRET, {
        expiresIn: '2d',
      });
      const currentTime = moment().format();
      const loggedInTime = await pool.query(
        'UPDATE users SET last_loggedin = $1 WHERE email = $2 RETURNING last_loggedin ',
        [currentTime, email]
      );

      res.json({
        message: 'User logged in successfully',
        userid: userid.rows[0].userid,
        token,
        lastLoggedIn: loggedInTime.rows[0],
      });
    } catch (err) {
      res.status(401).json(err.message);
    }
  }

  //login with google

  static async googlelogin(req, res) {
    try {
      const { tokenID } = req.body;
    } catch (error) {}
  }

  static async EditUser(req, res) {
    try {
      const last_edited = moment().format();
      const hashedPassword = bcrypt.hashSync(req.body.password, 10);
      const result = await pool.query(
        'UPDATE users SET name=$1, email=$2, password=$3, last_edited=$4 WHERE userid=$5 RETURNING *',
        // eslint-disable-next-line radix
        [
          req.body.name,
          req.body.email,
          hashedPassword,
          last_edited,
          parseInt(req.params.id),
        ]
      );
      return res
        .status(200)
        .json({ message: 'User updated successfully', result: result.rows[0] });
    } catch (err) {
      return res.status(403).json(err.message);
    }
  }

  static async AddProfileImage(req, res) {
    try {
      const profile_image = req.file.url;
      const profileImage = await pool.query(
        'UPDATE users SET profile_image=$1 WHERE userid=$2 RETURNING *',
        [profile_image, parseInt(req.params.id)]
      );
      return res.status(201).json({
        message: 'Profile image updated',
        data: profileImage.rows[0].profile_image,
      });
    } catch (error) {
      console.log('Server Error\n', error);
      return res.status(500).json(error.message);
    }
  }

  static async DeleteUser(req, res) {
    try {
      const result = await pool.query(
        'DELETE FROM users WHERE userid=$1 RETURNING *',
        [req.params.id]
      );
      return res.status(200).json({ message: 'Deleted', result });
    } catch (err) {
      return res.status(400).json(err.message);
    }
  }
}

module.exports = UserController;
