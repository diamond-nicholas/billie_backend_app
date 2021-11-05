const express = require('express');
const router = express.Router();

const CartController = require('../controllers/CartController');
const authenticateToken = require('../auth/auth');

router.post('/add/:userid', authenticateToken, CartController.AddToCart);

module.exports = router;