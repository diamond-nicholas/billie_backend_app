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
    res.locals.user = req.user;
    next();
  });
};

// const authorizedVendor = (req, res, next) => {
//   const { email } = res.locals.user;
//   const vendor = VendorModel.GetVendor(email);
//   if (vendor.rows[0].length < 1) return res.status(200).json({ mesage: 'Only authorized vendors can post' });

//   req.vendor = vendor;
//   next();
// };

module.exports = (authenticateToken);
