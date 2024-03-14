const express = require('express');
const router = express.Router();
const { getPost, getPosts, addPost, getaddPost } = require('../controllers/post-controller');
router.get('/posts/:id', getPost);
router.get('/posts', getPosts);
router.post('/add-post', addPost);
router.get('/add-post', getaddPost);
module.exports = router;