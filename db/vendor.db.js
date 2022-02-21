/* eslint-disable linebreak-style */
const pool = require('../config/db');
const authenticateToken = require('../auth/auth');

class VendorModel {
  static async CreateNewVendor({
    username, businessname, vendortype, address, profileimg, email, password, date_created,
  }) {
    const { rows: user } = await pool.query(
      'INSERT INTO vendors(username, businessname, vendortype, address, profileimg, email, password, date_created) VALUES($1, $2, $3, $4, $5, $6, $7, $8) returning *',
      [username, businessname, vendortype, address, profileimg, email, password, date_created],
    );
    return user[0];
  }

  static async GetVendor(email) {
    const users = await pool.query(
      'SELECT * FROM vendors WHERE email=$1',
      [email],
    );
    return users;
  }
}

module.exports = VendorModel;
