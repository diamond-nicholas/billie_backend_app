const jwt = require('jsonwebtoken');

const pool = require('../config/db');
const VendorModel = require('../db/vendor.db');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.body.token || req.query.token || req.headers['x-access-token'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token === null) return res.status(401).json({ error: 'Null token' });
  // eslint-disable-next-line consistent-return
  jwt.verify(token, process.env.SECRET, (error, user) => {
    if (error) return res.status(403).json({ error: error.message });
    req.user = user;
    next();
  });
};

// const isVendor = async (req, res, next) => {
//   const { email } = req.user;
//   const vendors = await pool.query(
//     'SELECT * FROM vendors WHERE email=$1', [email],
//   );
//   const vendor = vendors.rows[0];
//   if (vendor.length < 1)res.status(403).json({ message: 'Only authorized vendors can post products' });
//   else {
//     req.vendor = vendor;
//   }
//   next();
// };

module.exports = (authenticateToken);
