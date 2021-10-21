const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const moment = require('moment');

const VendorModel = require('../db/vendor.db');

class VendorController {
  static async CreateVendor(req, res) {
    try {
      const {
        businessname, vendortype, address, email, password,
      } = req.body;
      if (!req.body) return res.status(402).json({ message: 'No request body' });
      if (!businessname || !vendortype || !address || !email || !password) return res.status(402).json({ message: 'User field cannot be empty' });
      const hashedPassword = bcrypt.hashSync(password, 10);
      const date_created = moment().format();
      const vendor = await VendorModel.CreateNewVendor({
        username: `vendor${nanoid(10)}`, businessname, vendortype, address, email, password: hashedPassword, date_created,
      });
      return res.status(201).json({ message: 'Account created successfully', vendor });
    } catch (err) {
      res.status(400).json({ message: err });
    }
  }
}

module.exports = VendorController;