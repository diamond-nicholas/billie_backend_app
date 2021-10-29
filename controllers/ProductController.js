const moment = require('moment');
const pool = require('../config/db');

const ProductModel = require('../db/product.db');
const VendorModel = require('../db/vendor.db');


class ProductController {
  static async Create(req, res) {
    try {
      const { email } = req.user;
      const vendors = await pool.query(
        'SELECT * FROM vendors WHERE email=$1', [email],
      );
      const vendor = vendors.rows[0];
      if (vendor.length < 1)res.status(403).json({ message: 'Only authorized vendors can post products' });
      else {
        req.vendor = vendor;
      }
      if (!req.body)res.status(400).json({ message: 'No input ' });
      const {
        product_title, price, description, status,
      } = req.body;
      if (!product_title || !price || !description, !status)res.status(400).json({ message: 'No fields should be empty' });

      const { vendorid, businessname } = req.vendor;
      const displayimg = req.file.url;
      const date_created = moment().format();
      const product = ProductModel.NewProduct({
        vendorid, businessname, product_title, displayimg, price, description, status,date_created
      });
      res.status(201).json({ message: 'Product successfully added'});
    } catch (err) {
      res.status(400).json(err);
    }
  }
}

module.exports = ProductController;
