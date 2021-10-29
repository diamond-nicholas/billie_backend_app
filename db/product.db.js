const pool = require('../config/db');

class ProductModel {
  static async NewProduct({
    vendorid, businessname, product_title, displayimg, price, description, status,date_created
  }) {
    const product = await pool.query('INSERT INTO products(vendorid, businessname, product_title, displayimg, price, description, status, date_created) VALUES($1,$2,$3,$4,$5,$6,$7, $8) RETURNING *', [vendorid, businessname, product_title, displayimg, price, description, status, date_created]);
    return product;
  }
}

module.exports = ProductModel;
