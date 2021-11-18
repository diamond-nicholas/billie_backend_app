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
      res.status(400).json(err.message);
    }
  }

  static async GetVendor(req, res) {
    try {
      const vendors = await pool.query(
        'SELECT * FROM vendors WHERE vendorid=$1',
        [parseInt(req.params.id)],
      );
      if (vendors.rows.length === 0) res.status(200).json({ message: 'No such vendor exists' });
      res.status(200).json({ message: 'Vendor info retrieved successfully', vendor: vendors.rows[0] });
    } catch (err) {
      res.status(400).json(err);
    }
  }

  static async GetAllVendors(req, res) {
    try {
      const vendors = await pool.query(
        'SELECT * FROM vendors',
      );
      if (vendors.rows.length === 0) res.status(200).json({ message: 'No such vendors exists' });
      res.status(200).json({ message: 'Vendors retrieved successfully', vendor: vendors.rows[0] });
    } catch (err) {
      res.status(400).json(err);
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
      res.status(401).json(err.message);
    }
  }

  static async EditVendor(req, res) {
    try {
      const {
        businessname, vendortype, address, email, password,
      } = req.body;
      const last_edited = moment().format();
      const hashedPassword = bcrypt.hashSync(password, 10);
      const edited = {
        businessname: businessname.toLower(),
        vendortype: vendortype.toLower(),
        address,
        email,
        password,
        last_edited
      }
      const result = await pool.query(
        'UPDATE vendors SET businessname=$1, vendortype=$2, address=$3, email=$4, password=$5, last_edited=$6 WHERE vendorid=$7 RETURNING *',
        // eslint-disable-next-line radix
        [edited,
          parseInt(req.params.id)],
      );
      return res.status(200).json({ message: 'Vendor updated successfully', result: result.rows[0] });
    } catch (err) {
      return res.status(403).json(err.message);
    }
  }

  static async AddProfileImage(req, res) {
    try {
      const last_edited = moment().format();
      const profile_image = req.file.url;
      const profileImage = await pool.query('UPDATE vendors SET profile_image=$1,last_edited=$2 WHERE vendorid=$3 RETURNING *', [profile_image, last_edited, parseInt(req.params.id)]);
      return res.status(201).json({ message: 'Profile image updated', data: profileImage.rows[0].profileimg });
    } catch (error) {
      console.log('Server Error\n', error);
      return res.status(500).json(error.message);
    }
  }

  static async DeleteVendor(req, res) {
    try {
      const result = await pool.query('DELETE FROM vendors WHERE vendorid=$1 RETURNING *', [
        req.params.id,
      ]);
      return res.status(200).json({ message: 'Deleted', result });
    } catch (err) {
      return res.status(400).json(err.message);
    }
  }
}

module.exports = VendorController;
