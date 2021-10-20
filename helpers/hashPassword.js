const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hashSync(password, 10);
  return hashedPassword;
};

const comparePassword = async (password, passwordHash) => {
  await bcrypt.compare(password, passwordHash);
};

module.exports = (hashPassword, comparePassword);
