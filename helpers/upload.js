const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const dotenv = require('dotenv');
const cloudinaryStorage = require('cloudinary-multer');

dotenv.config();

const { CLOUD_NAME, API_KEY, API_SECRET } = process.env;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

const storage = cloudinaryStorage({
  cloudinary,
});

const upload = multer({
  storage,
});

module.exports = upload;
