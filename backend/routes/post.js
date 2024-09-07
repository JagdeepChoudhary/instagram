import express from 'express';
const router = express.Router();
import { addNewPost, getallpost, getuserpost, likeDislike, addcomment, getcomment, deletePost, bookmark } from '../controller/post/post.controller.js';
import validateuser from '../middleware/validateUser.js';
import upload from '../middleware/multer.js';
// const upload = require('../middleware/multer')
// const validateuser = require('../middleware/validateUser');
// const addNewPost = require('../controller/post/creatpost.controller');
// const getallpost = require('../controller/post/getallpost.controller');
// const getuserpost = require('../controller/post/getuserpost.controller');
// // const like = require('../controller/post/liked.controller');
// const likeDislike = require('../controller/post/likeDislike.controller');
// const comment = require('../controller/post/comments.controller');
// const getcomment = require('../controller/post/getcomment.controller');
// const deletePost = require('../controller/post/deletepost.controller');
// const bookmark = require('../controller/post/bookmark.controller');

router.route('/addnewpost').post(validateuser, upload.single('postphoto'), addNewPost);
router.route('/getpost').get(validateuser, getallpost);
router.route('/getuserpost').get(validateuser, getuserpost);
// router.route('/like/:id').post(validateuser, );
router.route('/dislike/:id').post(validateuser, likeDislike);
router.route('/comment/:id').post(validateuser, addcomment);
router.route('/getcomment/:id').get(validateuser, getcomment);
router.route('/deletepost/:id').delete(validateuser, deletePost);
router.route('/bookmark/:id').post(validateuser, bookmark);

export default router;