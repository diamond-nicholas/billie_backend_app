const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (token === null) return res.status(401).json({ error: 'Null token' });
  // eslint-disable-next-line consistent-return
  jwt.verify(token, process.env.SECRET, (error, user) => {
    if (error) return res.status(403).json({ error: error.message });
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
