const express = require('express');
const router = express.Router();

const OrderController = require('../controllers/OrderController');
const authenticateToken = require('../auth/auth');

router.post('/create/:userid', authenticateToken, OrderController.CreateOrder);
router.patch('/modify/:userid', authenticateToken, OrderController.ModifyOrder);

module.exports = router;

