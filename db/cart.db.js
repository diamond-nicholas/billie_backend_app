const pool = require('../config/db');

class CartModel {
  static async AddToCart({
    userid, productid, quantity,
  }) {
    const cart = await pool.query('INSERT INTO cart(userid, productid, quantity) VALUES($1,$2,$3)',
      [userid, productid, quantity]);
    const cartItem = await pool.query(
      'SELECT cart.userid, cart.productid, cart.quantity, products.product_title, products.displayimg, products.price FROM cart AS cart LEFT JOIN products AS products ON cart.productid = products.productid WHERE cart.productid = $1 AND cart.userid = $2;',
      [productid, userid],
    );
    return cartItem;
  }
}

module.exports = CartModel;
