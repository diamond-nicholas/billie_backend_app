const express = require('express');
const router = express.Router();

const OrderController = require('../controllers/OrderController');
const authenticateToken = require('../auth/auth');

router.post('/create/:userid', authenticateToken, OrderController.CreateOrder);

module.exports = router;

