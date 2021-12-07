/* eslint-disable no-await-in-loop */
/* eslint-disable no-return-await */
/* eslint-disable no-restricted-syntax */
const express = require('express');

const router = express.Router();
const UserController = require('../controllers/UserController');
const authenticateToken = require('../auth/auth');
const upload = require('../helpers/upload');

router.post('/create-user/', UserController.CreateUser);
router.post('/signin/', UserController.LoginUser);
router.patch('/edit/:id', authenticateToken, UserController.EditUser);
router.patch(
  '/profileimage/:id',
  authenticateToken,
  upload.single('image'),
  UserController.AddProfileImage
);
router.delete('/delete/:id', authenticateToken, UserController.DeleteUser);
router.get('/get/:id', authenticateToken, UserController.GetUser);
router.get('/get/', UserController.GetAllUsers);

module.exports = router;
