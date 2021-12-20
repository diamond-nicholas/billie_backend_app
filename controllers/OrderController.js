const moment = require('moment');
const { nanoid } = require('nanoid');

// const OrderModel = require('../db/order.db');
const CartModel = require('../db/cart.db');
// const UserModel = require('../db/users.db');
const pool = require('../config/db');

class OrderController {
  static async CreateOrder(req, res) {
    try {
      const { userid } = req.params;
      const { address, payment_method, phone_number } = req.body;
      const orderid = `ord${nanoid(7)}`;
      const order_status = 'pending';
      const date_created = moment().format();
      const { rows: cart } = await CartModel.GetCart({ userid });
      if (cart.length === 0)
        return res.status(400).json({ message: 'Cart is empty' });
      const shipping_cost = 600;
      const itemsCost = cart
        .map((item) => item.subtotal)
        .reduce((prev, curr) => prev + curr, 0);
      const total_cost = shipping_cost + itemsCost;
      // eslint-disable-next-line camelcase
      const { rows: newOrder } = await pool.query(
        'INSERT INTO orders(orderid, userid, address, phone_number, shipping_cost, total_cost, payment_method, order_status, date_created) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',
        [
          orderid,
          userid,
          address,
          phone_number,
          shipping_cost,
          total_cost,
          payment_method,
          order_status,
          date_created,
        ]
      );
      const updateCart = await pool.query(
        'UPDATE cart SET orderid=$1 WHERE userid=$2',
        [orderid, userid]
      );
      const setOrderItems = await pool.query(
        'INSERT INTO orderitems (orderid, productid, price, quantity, subtotal) SELECT orderid, productid,price,quantity,subtotal FROM cart WHERE userid=$1',
        [userid]
      );
      const updateOrderItems = await pool.query(
        'UPDATE orderitems SET vendorid=(SELECT vendorid FROM products WHERE productid=orderitems.productid) WHERE orderid=$1',
        [orderid]
      );
      const { rows: orderItems } = await pool.query(
        'SELECT orderitems.orderid, orderitems.productid, orderitems.vendorid, products.product_title, products.businessname, products.displayimg, orderitems.price, orderitems.quantity, orderitems.subtotal FROM orderitems AS orderitems LEFT JOIN products AS products ON orderitems.productid = products.productid WHERE orderitems.orderid = $1;',
        [orderid]
      );
      const clearCart = await CartModel.ClearCart({ userid });
      res.status(201).json({ message: 'Order created', newOrder, orderItems });
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}

module.exports = OrderController;
