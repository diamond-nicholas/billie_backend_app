const express = require('express');
const router = express.Router();

const CartController = require('../controllers/CartController');
const authenticateToken = require('../auth/auth');

router.post('/add/:userid', authenticateToken, CartController.AddToCart);
router.patch('/increase/:userid', authenticateToken, CartController.IncreaseQuantity);
router.patch('/reduce/:userid', authenticateToken, CartController.ReduceQuantity);

module.exports = router;