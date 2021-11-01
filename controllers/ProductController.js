const moment = require('moment');
const pool = require('../config/db');

const ProductModel = require('../db/product.db');
const { NewProduct, GetProduct, EditProduct } = require('../db/vendor.db');

class ProductController {
  static async Create(req, res) {
    try {
      const { email } = req.user;
      const vendors = await pool.query(
        'SELECT * FROM vendors WHERE email=$1', [email],
      );
      const vendor = vendors.rows[0];
      if (vendor.length < 1) res.status(403).json({ message: 'Only authorized vendors can post products' });
      else {
        req.vendor = vendor;
      }
      if (!req.body) res.status(400).json({ message: 'No input ' });
      const {
        product_title, price, description, status,
      } = req.body;
      if (!product_title || !price || !description, !status) res.status(400).json({ message: 'No fields should be empty' });

      const { vendorid, businessname } = req.vendor;
      const displayimg = req.file.url;
      const date_created = moment().format();
      const product = await pool.query('INSERT INTO products(vendorid, businessname, product_title, displayimg, price, description, status, date_created) VALUES($1,$2,$3,$4,$5,$6,$7, $8) RETURNING *',
        [vendorid,
          businessname,
          product_title,
          displayimg,
          price,
          description,
          status,
          date_created]);
      res.status(201).json({ message: 'Product successfully added', product: product.rows[0] });
    } catch (err) {
      res.status(400).json(err);
    }
  }

  static async GetOne(req, res) {
    try {
      const { id: productid } = req.params;
      const product = await pool.query('SELECT * FROM products WHERE productid=$1', [parseInt(productid)]);
      if (product.rows.length < 1) res.status(200).json({ message: 'Product does not exist' });
      res.status(200).json({ product: product.rows[0] });
    } catch (err) {
      res.status(403).json(err);
    }
  }

  static async GetAll(req, res) {
    try {
      const product = await pool.query('SELECT * FROM products');
      res.status(200).json({ product: product.rows[0] });
    } catch (err) {
      res.status(403).json(err);
    }
  }

  static async Edit(req, res) {
    try {
      const { email } = req.user;
      const vendors = await pool.query(
        'SELECT * FROM vendors WHERE email=$1', [email],
      );
      const vendor = vendors.rows[0];
      if (vendor.length < 1) res.status(403).json({ message: 'Only authorized vendors can post products' });
      else {
        req.vendor = vendor;
      }

      const { id: productid } = req.params;
      const getId = await pool.query('SELECT * FROM products WHERE productid=$1', [parseInt(productid)]);
      if (getId.rows[0].length < 1) res.status(400).json({ message: 'No such product exists' });

      const {
        product_title, price, description, status,
      } = req.body;
      const { vendorid, businessname } = req.vendor;
      const displayimg = req.file.url;
      const last_edited = moment().format();
      const product = await pool.query('UPDATE products SET vendorid=$1, businessname=$2, product_title=$3, displayimg=$4, price=$5, description=$6, status=$7, last_edited=$8 WHERE productid=$9 RETURNING *', [vendorid, businessname, product_title, displayimg, price, description, status, last_edited, productid]);
      res.status(200).json({ message: 'Edited product successfully', product: product.rows[0] });
    } catch (err) {
      res.status(400).json(err);
    }
  }
}

module.exports = ProductController;
