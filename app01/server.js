const chalk = require('chalk');

const bcrypt = require('bcryptjs');

const express = require('express');

const app = express();

const morgan = require('morgan');

const mongoose = require('mongoose');

const postRoutes = require('./routes/post-routes');

const log_regRoutes = require('./routes/log_reg-routes');

const createPath = require('./helpers/create-path');

const postApiRoutes = require('./routes/api-post-routes');
const errorMsg = chalk.bgKeyword('white').red;

const successMsg = chalk.bgKeyword('white').green;

const session = require('express-session')

const MongoStore = require('connect-mongo'); 

const methodOverride = require('method-override');

const { handleError } = require('./controllers/error-controller');
require('dotenv').config()
mongoose
  .connect(process.env.MONGO_URL)
  .then((res) => console.log(successMsg('Connected to DB')))
  .catch((error) => console.log(errorMsg(error)));

  app.set('view engine', 'ejs');

app.listen(process.env.PORT, (error) => {
    error ? console.log(errorMsg(error)) : console.log(successMsg(`listening port ${process.env.PORT}`));
  });
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
  
  app.use(express.urlencoded({ extended: false}));
  
  app.use(express.static('app01/ejs-public'));
  app.use(session({ 
    name: 'SessionName123', 
    secret: 'Super-omega-secret', 
    resave: false, 
    saveUninitialized: false, 
    store: MongoStore. create ({ 
        mongoUrl: process.env.MONGO_URL 
    }),
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 30
    }
})); 
app.use(methodOverride('_method'));
  app.get('/', (req, res) => { 
    const title = 'Домашня сторінка';
    res.render(createPath('index'), { title });
  });
  app.get('/home', (req, res) => {
    res.redirect('/');
  });
  app.get('/index.html', (req, res) => {
    res.redirect('/');
  });
  
  app.use(log_regRoutes);
  app.use(postRoutes);
  app.use(postApiRoutes);
   app.use((req, res) => {
    const title = 'Помилка 404';
    const error = "Сторінку не знайдено";
    handleError(req, res, title, error);
  });
  
  