const express = require('express');
const router = express.Router();
const { getPost, getPosts, addPost } = require('../controllers/api-post-controller');
//Get All Posts
router.get('/api/posts', getPosts);
//Add New Post
router.post('/api/post', addPost);
//Get Post by ID
router.get('/api/post/:id', getPost)

module.exports = router;