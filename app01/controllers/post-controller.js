const Post = require('../models/post');
const createPath = require('../helpers/create-path');
const { handleError } = require('../controllers/error-controller');
const getPost = (req, res) => {
    try{
    const title = 'Пост';
    let error = "500 - помилка серверу";
    Post
      .findById(req.params.id)
      .then((post) => res.render(createPath('post'), { post, title }))
    }
    catch(error){handleError(req, res, title, error)};
};
const getPosts = (req, res) => {
    try{
    const title = 'Пости';
    let error = "500 - помилка серверу";
    Post
      .find()
      .sort({ createdAt: -1 })
      .then((posts) => res.render(createPath('posts'), { posts, title }))
    }
      catch(error){handleError(req, res, title, error)}
}
const addPost = (req, res) => {
    try{
    const { title, text } = req.body;
    let error = "500 - помилка серверу";
    if(!(!req.session || req.session.user)){
      error = "Ви не зареєстровані";
      handleError(req, res, title, error);
    }
    const author = req.session.user.username;
    const post = new Post({ title, text, author });
    post
      .save()
      .then((result) => res.redirect('/posts'))
      }
      catch(error){
      handleError(req, res, title, error)
      };
}
const getaddPost = (req, res) => {
    const title = 'Створити пост';
    res.render(createPath('add-post'), { title });
}
module.exports = {
    getPost,
    getPosts,
    addPost,
    getaddPost
}