const express = require('express');

const router = express.Router();
const VendorController = require('../controllers/VendorController');

router.post('/create-vendor', VendorController.CreateVendor);
router.post('/signin', VendorController.LoginUser);

module.exports = router;
