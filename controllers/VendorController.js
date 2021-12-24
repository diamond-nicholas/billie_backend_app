const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const moment = require('moment');
const jwt = require('jsonwebtoken');

const VendorModel = require('../db/vendor.db');
const pool = require('../config/db');
const { types } = require('pg');

class VendorController {
  static async CreateVendor(req, res) {
    try {
      const { businessname, vendortype, address, email, password } = req.body;
      if (!req.body)
        return res.status(402).json({ message: 'No request body' });
      if (!businessname || !vendortype || !address || !email || !password)
        return res.status(402).json({ message: 'User field cannot be empty' });
      const hashedPassword = bcrypt.hashSync(password, 10);
      const date_created = moment().format();
      const token = jwt.sign({ email }, process.env.SECRET, {
        expiresIn: '2d',
      });
      const vendor = await VendorModel.CreateNewVendor({
        username: `vendor${nanoid(10)}`,
        businessname,
        vendortype,
        address,
        email,
        password: hashedPassword,
        date_created,
      });
      return res
        .status(201)
        .json({ message: 'Account created successfully', token, vendor });
    } catch (err) {
      return res.status(400).json(err.message);
    }
  }

  static async GetVendor(req, res) {
    try {
      const vendors = await pool.query(
        'SELECT * FROM vendors WHERE vendorid=$1',
        [parseInt(req.params.id)]
      );
      if (vendors.rows.length === 0)
        return res.status(200).json({ message: 'No such vendor exists' });
      return res.status(200).json({
        message: 'Vendor info retrieved successfully',
        vendor: vendors.rows[0],
      });
    } catch (err) {
      return res.status(400).json(err);
    }
  }
  static async GetCategories(req, res) {
    try {
      const categories = await pool.query(
        'SELECT type.typname, enum.enumlabel AS value FROM pg_enum AS enum JOIN pg_type AS type ON (type.oid = enum.enumtypid) GROUP BY enum.enumlabel, type.typname'
      );
      const getAllVendors = await pool.query(
        'SELECT * FROM vendors WHERE vendorid=$1',
        [parseInt(req.params.id)]
      );
      const getVendorCategories = categories.rows;
      // console.log(getVendorCategories);
      const getVendorType = getAllVendors.rows;
      getVendorType.forEach((vendor) => {
        const type = vendor.vendortype;
        if (type == 'health') {
          function getHealthCat(categories) {
            return categories
              .filter((category) => category.typname == 'health_category')
              .map((category) => category.value);
          }
          // console.log(getHealthCat(getVendorCategories));
          const health = getHealthCat(getVendorCategories);
          return res.status(201).json({
            message: 'Health category fetched successfully',
            health,
          });
        } else if (type == 'food') {
          function getFoodCat(categories) {
            return categories
              .filter((category) => category.typname == 'food_category')
              .map((category) => category.value);
          }
          // console.log(getFoodCat(getVendorCategories));
          const food = getFoodCat(getVendorCategories);
          return res.status(201).json({
            message: 'Food category fetched successfully',
            food,
          });
        } else if (type == 'beauty') {
          function getBeautyCat(categories) {
            return categories
              .filter((category) => category.typname == 'beauty_category')
              .map((category) => category.value);
          }
          // console.log(getBeautyCat(getVendorCategories));
          const beauty = getBeautyCat(getVendorCategories);
          return res.status(201).json({
            message: 'Food category fetched successfully',
            beauty,
          });
        } else if (type == 'drinks') {
          function getDrinksCat(categories) {
            return categories
              .filter((category) => category.typname == 'drinks_category')
              .map((category) => category.value);
          }
          // console.log(getDrinksCat(getVendorCategories));
          const drinks = getDrinksCat(getVendorCategories);
          return res.status(201).json({
            message: 'Food category fetched successfully',
            drinks,
          });
        }
      });
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  static async GetAllVendors(req, res) {
    try {
      const vendors = await pool.query('SELECT * FROM vendors');
      if (vendors.rows.length === 0)
        return res.status(200).json({ message: 'No such vendors exists' });
      return res.status(200).json({
        message: 'Vendors retrieved successfully',
        vendor: vendors.rows,
      });
    } catch (err) {
      return res.status(400).json(err);
    }
  }

  static async LoginUser(req, res) {
    try {
      const { email, password } = req.body;
      const vendors = await pool.query('SELECT * FROM vendors WHERE email=$1', [
        email,
      ]);
      const vendor = vendors.rows[0];
      if (vendor.length === 0) {
        return res.status(401).json({ message: 'Invalid username or email' });
      }
      const validPassword = bcrypt.compare(password, vendor.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid password' });
      }
      const token = jwt.sign({ email }, process.env.SECRET, {
        expiresIn: '2d',
      });
      const currentTime = moment().format();
      const loggedInTime = await pool.query(
        'UPDATE vendors SET last_loggedin = $1 WHERE email = $2 RETURNING last_loggedin ',
        [currentTime, email]
      );
      // console.log(vendors.rows[0].vendorid);
      return res.json({
        message: 'Vendor logged in successfully',
        vendorid: vendors.rows[0].vendorid,
        token,
        lastLoggedIn: loggedInTime.rows[0],
      });
    } catch (err) {
      return res.status(401).json(err.message);
    }
  }

  static async EditVendor(req, res) {
    try {
      const { businessname, vendortype, address, email, password } = req.body;
      const last_edited = moment().format();
      const hashedPassword = bcrypt.hashSync(password, 10);
      
      const result = await pool.query(
        'UPDATE vendors SET businessname=$1, vendortype=$2, address=$3, email=$4, password=$5, last_edited=$6 WHERE vendorid=$7 RETURNING *',
        // eslint-disable-next-line radix
        [businessname,
          vendortype,
          address,
          email,
          password,
          last_edited,
          parseInt(req.params.id)]
      );
      return res.status(200).json({
        message: 'Vendor updated successfully',
        result: result.rows[0],
      });
    } catch (err) {
      return res.status(403).json(err.message);
    }
  }

  static async AddProfileImage(req, res) {
    try {
      const last_edited = moment().format();
      const profile_image = req.file.url;
      const {rows:profileImage} = await pool.query(
        'UPDATE vendors SET profile_image=$1,last_edited=$2 WHERE vendorid=$3 RETURNING *',
        [profile_image, last_edited, parseInt(req.params.id)]
      );
      return res.status(201).json({
        message: 'Profile image updated',
        data: profileImage
      });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  //add bio to vendor

  static async addBio(req, res) {
    try {
      const bio = req.body.bio;
      console.log(bio);
      if (!req.body)
        return res.status(402).json({ message: 'No request body' });
      if (!bio)
        return res.status(402).json({ message: 'Bio field cannot be empty' });

      const last_edited = moment().format();
      const vendor = await pool.query(
        'UPDATE vendors SET bio=$1, last_edited= $2 WHERE id=$3 returning *',
        [bio, last_edited, parseInt(req.params.id)]
      );
      console.log(bio);
      return res.status(201).json({
        status: 'Biography added successfully',
        data: vendor.rows,
      });
    } catch (err) {
      return res.status(400).json(err.message);
    }
  }

  static async DeleteVendor(req, res) {
    try {
      const result = await pool.query(
        'DELETE FROM vendors WHERE vendorid=$1 RETURNING *',
        [req.params.id]
      );
      return res.status(200).json({ message: 'Deleted', result });
    } catch (err) {
      return res.status(400).json(err.message);
    }
  }
}

module.exports = VendorController;
