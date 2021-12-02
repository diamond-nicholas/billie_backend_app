const express = require('express');

const router = express.Router();
const VendorController = require('../controllers/VendorController');
const authenticateToken = require('../auth/auth');
const upload = require('../helpers/upload');

router.post('/create-vendor', VendorController.CreateVendor);
router.post('/signin', VendorController.LoginUser);
router.patch('/edit/:id', authenticateToken, VendorController.EditVendor);
router.patch(
  '/profileimage/:id',
  authenticateToken,
  upload.single('image'),
  VendorController.AddProfileImage
);
router.delete('/delete/:id', authenticateToken, VendorController.DeleteVendor);
router.get('/get/:id', authenticateToken, VendorController.GetVendor);
router.get('/get/', authenticateToken, VendorController.GetAllVendors);

module.exports = router;
