const express = require('express');

const router = express.Router();
const VendorController = require('../controllers/VendorController');

router.post('/create-vendor', VendorController.CreateVendor);

module.exports = router;
