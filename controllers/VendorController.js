const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const moment = require('moment');
const jwt = require('jsonwebtoken');

const VendorModel = require('../db/vendor.db');
const pool = require('../config/db');

class VendorController {
  static async CreateVendor(req, res) {
    try {
      const {
        businessname, vendortype, address, email, password,
      } = req.body;
      if (!req.body) return res.status(402).json({ message: 'No request body' });
      if (!businessname || !vendortype || !address || !email || !password) return res.status(402).json({ message: 'User field cannot be empty' });
      const hashedPassword = bcrypt.hashSync(password, 10);
      const date_created = moment().format();
      const vendor = await VendorModel.CreateNewVendor({
        username: `vendor${nanoid(10)}`, businessname, vendortype, address, email, password: hashedPassword, date_created,
      });
      return res.status(201).json({ message: 'Account created successfully', vendor });
    } catch (err) {
      res.status(400).json({ message: err });
    }
  }

  static async LoginUser(req, res) {
    try {
      const { email, password } = req.body;
      const vendors = await pool.query(
        'SELECT * FROM vendors WHERE email=$1',
        [email],
      );
      const vendor = vendors.rows[0];
      if (vendor.length === 0) {
        return res.status(401).json({ message: 'Invalid username or email' });
      }
      const validPassword = bcrypt.compare(password, vendor.password);
      if (!validPassword) { return res.status(401).json({ message: 'Invalid password' }); }
      const token = jwt.sign({ email }, process.env.SECRET, { expiresIn: '2d' });
      const currentTime = moment().format();
      const loggedInTime = await pool.query('UPDATE vendors SET last_loggedin = $1 WHERE email = $2 RETURNING last_loggedin ', [currentTime, email]);

      res.json({ message: 'Vendor logged in successfully', token, lastLoggedIn: loggedInTime.rows[0] });
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  }

}

module.exports = VendorController;