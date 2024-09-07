import express from 'express';
const router = express.Router();
import { register, login, logout, getprofile, editprofile, suggestuser, followandunfollow } from '../controller/user/user.controller.js';
import validateuser from '../middleware/validateUser.js';
import upload from '../middleware/multer.js';
// const upload = require('../middleware/multer')
// const validateuser = require('../middleware/validateUser')
// const register = require('../controller/user/signup.controller');
// const login = require('../controller/user/login.controller');
// const logout = require('../controller/user/logout.controller');
// const getprofile = require('../controller/user/getprofile.controller');
// const editprofile = require('../controller/user/editprofile.controller')
// const suggestuser = require('../controller/user/suggestuser.controller');
// const followandunfollow = require('../controller/user/followandunfollow');

router.route('/signup').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/getprofile/:id').get(validateuser, getprofile);
router.route('/editprofile').post(validateuser, upload.single('profilePhoto'), editprofile);
router.route('/suggestuser').get(validateuser, suggestuser);
router.route('/followandunfollow/:id').get(validateuser, followandunfollow);

export default router;
