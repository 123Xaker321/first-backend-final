const Post = require('../models/post');
const { handleError } = require('../controllers/api-error-controller');
const getPost = (req, res) => {
    Post
      .findById(req.params.id)
      .then((post) => res.status(200).json(post))
      .catch((error) => handleError(res, error));
};
const getPosts = (req, res) => {
    Post
      .find()
      .sort({ createdAt: -1 })
      .then((posts) => res.status(200).json(posts))
      .catch((error) => handleError(res, error));
}
const addPost = (req, res) => {
    const { title, author, text} = req.body;
    const post = new Post({ title, author, text });
    post
      .save()
      .then((result) => res.redirect('/posts'))
      .catch((error) => handleError(res, error));
}
module.exports = {
    getPost,
    getPosts,
    addPost,
}