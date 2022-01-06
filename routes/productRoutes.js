const express = require('express');

const router = express.Router();
const ProductController = require('../controllers/ProductController');
const authenticateToken = require('../auth/auth');
// const authorizedVendor = require('../auth/auth');
// const isVendor = require('../auth/auth');
const upload = require('../helpers/upload');

router.post(
  '/create-product',
  authenticateToken,
  upload.single('image'),
  ProductController.Create
);
router.get('/get/:id', authenticateToken, ProductController.GetOne);
router.get('/get/', ProductController.GetAll);

router.patch(
  '/edit/:id',
  authenticateToken,
  upload.single('image'),
  ProductController.Edit
);
router.delete('/delete/:id', authenticateToken, ProductController.Delete);
router.get(
  '/vendor/:id',
  authenticateToken,
  ProductController.ProductsVendorId
);
// router.get('/vendor/:businessname', authenticateToken, ProductController.ProductsBusinessName);

module.exports = router;
