/* eslint-disable camelcase */
const { nanoid } = require('nanoid');
const moment = require('moment');
const { hashPassword } = require('../helpers/hashPassword');
const UserModel = require('../db/users.db');

class UserController {
  static async CreateUser(req, res) {
    const { password, email, name } = req.body;
    if (!req.body) return res.status(402).json({ message: 'No request body' });
    if (!email || !password || !name) return res.status(402).json({ message: 'User field cannot be empty' });
    if (UserModel.UserExists.length > 0) return res.status(402).json({ message: 'Already registered user' });
    const hashedPassword = hashPassword(password);
    const date_created = moment().format();
    const user = await UserModel.CreateNewUser({
      name, username: `user${nanoid(10)}`, email, password: hashedPassword, date_created,
    });
    return res.status(201).json({ message: 'Account created successfully', user });
  }
}

module.exports = UserController;
