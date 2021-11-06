const pool = require('../config/db');

class CartModel {
  static async AddToCart({
    userid, productid, quantity,
  }) {
    const price = await pool.query('SELECT price FROM products WHERE productid = $1', [productid]);
    const subtotal = price.rows[0].price * quantity;
    const cart = await pool.query('INSERT INTO cart(userid, productid, quantity, subtotal) VALUES($1,$2,$3,$4)',
      [userid, productid, quantity, subtotal]);
    const cartItem = await pool.query(
      'SELECT cart.userid, cart.productid, cart.quantity, cart.subtotal, products.product_title, products.displayimg, products.price FROM cart AS cart LEFT JOIN products AS products ON cart.productid = products.productid WHERE cart.productid = $1 AND cart.userid = $2;',
      [productid, userid],
    );
    return cartItem;
  }

  static async IncreaseQuantity({ userid, productid }) {
    const price = await pool.query('SELECT price FROM products WHERE productid = $1', [productid]);
    const subtotal = price.rows[0].price;
    const newQuantity = await pool.query('UPDATE cart SET quantity = cart.quantity + 1, subtotal = (quantity + 1) * $1 WHERE userid=$2 AND productid=$3',
      [subtotal, userid, productid]);
    const cartItem = await pool.query(
      'SELECT cart.userid, cart.productid, cart.quantity, cart.subtotal, products.product_title, products.displayimg, products.price FROM cart AS cart LEFT JOIN products AS products ON cart.productid = products.productid WHERE cart.productid = $1 AND cart.userid = $2;',
      [productid, userid],
    );
    return cartItem;
  }

  static async ReduceQuantity({ userid, productid }) {
    const price = await pool.query('SELECT price FROM products WHERE productid = $1', [productid]);
    const subtotal = price.rows[0].price;
    const newQuantity = await pool.query('UPDATE cart SET quantity = cart.quantity - 1, subtotal = (quantity - 1) * $1 WHERE userid=$2 AND productid=$3',
      [subtotal, userid, productid]);
    const cartItem = await pool.query(
      'SELECT cart.userid, cart.productid, cart.quantity, cart.subtotal, products.product_title, products.displayimg, products.price FROM cart AS cart LEFT JOIN products AS products ON cart.productid = products.productid WHERE cart.productid = $1 AND cart.userid = $2;',
      [productid, userid],
    );
    return cartItem;
  }
}

module.exports = CartModel;
