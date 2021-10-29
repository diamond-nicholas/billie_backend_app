const express = require('express');

const router = express.Router();
const ProductController = require('../controllers/ProductController');
const authenticateToken = require('../auth/auth');
// const isVendor = require('../auth/auth');
const upload = require('../helpers/upload');

router.post('/create-product', authenticateToken, upload.single('image'), ProductController.Create);
router.get('/', authenticateToken, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
