const pool = require('../config/db');

const NewProduct = async ({
  vendorid, businessname, product_title, displayimg, price, description, status, date_created,
}) => {
  const product = await pool.query('INSERT INTO products(vendorid, businessname, product_title, displayimg, price, description, status, date_created) VALUES($1,$2,$3,$4,$5,$6,$7, $8) RETURNING *', [vendorid, businessname, product_title, displayimg, price, description, status, date_created]);
  return product;
};

const GetProduct = async (id) => {
  const product = await pool.query('SELECT * FROM products WHERE productid=$1', [parseInt(id)]);
  return product;
};

const EditProduct = async ({
  vendorid,
  businessname,
  product_title,
  displayimg,
  price,
  description,
  status,
  last_edited,
  productid,
}) => {
  const product = await pool.query('UPDATE products SET vendorid=$1, businessname=$2, product_title=$3, displayimg=$4, price=$5, description=$6, status=$7, last_edited=$8 WHERE productid=$9 RETURNING *', [vendorid, businessname, product_title, displayimg, price, description, status, last_edited, productid]);
  return product;
};

module.exports = { NewProduct, GetProduct, EditProduct };
