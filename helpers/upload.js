const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const dotenv = require('dotenv');
const cloudinaryStorage = require('cloudinary-multer');

dotenv.config();

const { CLOUDINARY_CLOUD_NAME, 
  CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const storage = cloudinaryStorage({
  cloudinary,
});

const upload = multer({
  storage,
});

module.exports = upload;
