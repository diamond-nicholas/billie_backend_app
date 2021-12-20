const pool = require('../config/db');

class CartModel {
  static async AddToCart({
    userid, productid, quantity,
  }) {
    const price = await pool.query('SELECT price FROM products WHERE productid = $1', [productid]);
    let itemPrice = price.rows[0].price;
    const subtotal = itemPrice * quantity;
    const cart = await pool.query('INSERT INTO cart(userid, productid, quantity, subtotal) VALUES($1,$2,$3,$4)',
      [userid, productid, quantity, subtotal]);
    const updateCart = await pool.query('UPDATE cart SET price = products.price FROM products WHERE cart.productid = products.productid');
    const cartItem = await pool.query(
      'SELECT cart.userid, cart.productid, products.product_title, products.displayimg, cart.price, cart.quantity, cart.subtotal FROM cart AS cart LEFT JOIN products AS products ON cart.productid = products.productid WHERE cart.productid = $1 AND cart.userid = $2;',
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
      'SELECT cart.userid, cart.productid, products.product_title, products.displayimg, products.price, cart.quantity, cart.subtotal FROM cart AS cart LEFT JOIN products AS products ON cart.productid = products.productid WHERE cart.productid = $1 AND cart.userid = $2;',
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
      'SELECT cart.userid, cart.productid, products.product_title, products.displayimg, products.price, cart.quantity, cart.subtotal FROM cart AS cart LEFT JOIN products AS products ON cart.productid = products.productid WHERE cart.productid = $1 AND cart.userid = $2;',
      [productid, userid],
    );
    return cartItem;
  }

  static async GetCart({ userid }) {
    const cart = await pool.query('SELECT cart.userid, cart.productid, products.product_title, products.displayimg, products.price, cart.quantity, cart.subtotal FROM cart AS cart LEFT JOIN products AS products ON cart.productid = products.productid WHERE cart.userid = $1;',
      [userid]);
    return cart;
  }

  static async GetCartItem({ userid, productid }) {
    const cart = await pool.query('SELECT cart.userid, cart.productid, products.product_title, products.displayimg, products.price, cart.quantity, cart.subtotal FROM cart AS cart LEFT JOIN products AS products ON cart.productid = products.productid WHERE cart.userid = $1 AND cart.productid = $2;',
      [userid, productid]);
    return cart;
  }

  static async DeleteCartItem({ userid, productid }) {
    const cart = await pool.query('DELETE FROM cart WHERE userid = $1 AND productid = $2 RETURNING *;',
      [userid, productid]);
    return cart;
  }

  static async ClearCart({ userid }) {
    const cart = await pool.query('DELETE FROM cart WHERE userid=$1 RETURNING *',
      [userid]);
    return cart;
  }
}

module.exports = CartModel;
