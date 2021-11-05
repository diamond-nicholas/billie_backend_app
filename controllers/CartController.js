const CartModel = require('../db/cart.db');
const pool = require('../config/db');

class CartController {
  static async AddToCart(req, res) {
    try {
      const { productid, quantity } = req.body;
      const { userid } = req.params;
      const productExists = await pool.query('SELECT * FROM cart WHERE productid = $1 AND userid = $2', [productid, userid]);
      if (productExists.rows.length > 0) { res.status(400).json({ message: 'Product already exists in cart' }); } else {
        const cart = await CartModel.AddToCart({ userid, productid, quantity });
        res.status(201).json({
          message: 'Successfully added to cart',
          cart,
        });
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}

module.exports = CartController;
