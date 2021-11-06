/* eslint-disable space-before-blocks */
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
          cart: cart.rows[0],
        });
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  static async IncreaseQuantity(req, res){
    try {
      const { productid } = req.body;
      const { userid } = req.params;
      const updateCart = await CartModel.IncreaseQuantity({ userid, productid });
      res.status(200).json({
        message: 'Quantity of product increased',
        cart: updateCart.rows[0],
      });
    } catch (err){
      res.status(400).json({ message: err.message });
    }
  }

  static async ReduceQuantity(req, res){
    try {
      const { productid } = req.body;
      const { userid } = req.params;
      const updateCart = await CartModel.ReduceQuantity({ userid, productid });
      res.status(200).json({
        message: 'Quantity of product reduced',
        cart: updateCart.rows[0],
      });
    } catch (err){
      res.status(400).json({ message: err.message });
    }
  }
}

module.exports = CartController;
