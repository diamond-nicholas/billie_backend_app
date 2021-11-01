const express = require('express');

const router = express.Router();
const ProductController = require('../controllers/ProductController');
const authenticateToken = require('../auth/auth');
// const authorizedVendor = require('../auth/auth');
// const isVendor = require('../auth/auth');
const upload = require('../helpers/upload');

router.post('/create-product', authenticateToken, upload.single('image'), ProductController.Create);
router.get('/get/:id', authenticateToken, ProductController.GetOne);
router.get('/get/', authenticateToken, ProductController.GetAll);
router.patch('/edit/:id', authenticateToken, upload.single('image'), ProductController.Edit);

module.exports = router;
