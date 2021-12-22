/* eslint-disable space-before-blocks */
const CartModel = require('../db/cart.db');
const pool = require('../config/db');

class CartController {
  static async AddToCart(req, res) {
    try {
      const { productid, quantity } = req.body;
      const { userid } = req.params;
      const productExists = await pool.query(
        'SELECT * FROM cart WHERE productid = $1 AND userid = $2',
        [productid, userid]
      );
      if (productExists.rows.length > 0) {
        return res
          .status(400)
          .json({ message: 'Product already exists in cart' });
      }else if(quantity < 1) return res.status(400).json({ message: 'Quantity must be greater than 0' });
       else {
        const cart = await CartModel.AddToCart({ userid, productid, quantity });
        return res.status(201).json({
          message: 'Successfully added to cart',
          cart: cart.rows[0],
        });
      }
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  static async IncreaseQuantity(req, res) {
    try {
      const { productid } = req.body;
      const { userid } = req.params;
      const updateCart = await CartModel.IncreaseQuantity({
        userid,
        productid,
      });
      return res.status(200).json({
        message: 'Quantity of product increased',
        cart: updateCart.rows[0],
      });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  static async ReduceQuantity(req, res) {
    try {
      const { productid } = req.body;
      const { userid } = req.params;
      const updateCart = await CartModel.ReduceQuantity({ userid, productid });
      if (quantity === 0){
        const {rows:deleteItem} = await CartModel.DeleteCartItem({ userid, productid });
        return res.status(200).json({message:'Item deleted from cart', cart:deleteItem[0]});
      }
      return res.status(200).json({
        message: 'Quantity of product reduced',
        cart: updateCart.rows[0],
      });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  static async GetCart(req, res) {
    try {
      const { userid } = req.params;
      const cart = await CartModel.GetCart({ userid });
      return res.status(200).json({ cart: cart.rows });
    } catch (err) {
      return res.status(200).json(err.message);
    }
  }

  static async DeleteCartItem(req, res) {
    try {
      const { productid } = req.body;
      const { userid } = req.params;
      const deleteItem = await CartModel.DeleteCartItem({ userid, productid });
      return res.status(200).json({
        message: 'Deleted',
        deleteItem: deleteItem.rows[0],
      });
    } catch (err) {
      return res.status(400).json(err.message);
    }
  }

  static async ClearCart(req, res) {
    try {
      const { userid } = req.params;
      const clearCart = await CartModel.ClearCart({ userid });
      return res.status(200).json({
        message: 'Cleared',
      });
    } catch (err) {
      return res.status(400).json(err.message);
    }
  }
}

module.exports = CartController;
