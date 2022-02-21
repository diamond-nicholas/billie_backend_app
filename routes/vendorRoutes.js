const express = require('express');

const router = express.Router();
const VendorController = require('../controllers/VendorController');
const authenticateToken = require('../auth/auth');
const upload = require('../helpers/upload');

router.post('/create-vendor',upload.single('profileimg'), VendorController.CreateVendor);
router.patch('/bio/:id', VendorController.addBio);
router.post('/signin', VendorController.LoginUser);
router.patch('/edit/:id', authenticateToken, VendorController.EditVendor);
router.patch(
  '/profileimage/:id',
  authenticateToken,
  upload.single('image'),
  VendorController.AddProfileImage
);
router.delete('/delete/:id', authenticateToken, VendorController.DeleteVendor);
router.get('/get/:id', VendorController.GetVendor);
router.get('/get/', VendorController.GetAllVendors);
router.get('/category/:id', VendorController.GetCategories);
router.get('/orders/:id', VendorController.FetchOrders);

module.exports = router;
