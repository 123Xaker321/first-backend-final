const Users = require('../models/users');
const createPath = require('../helpers/create-path');
const { handleError } = require('./error-controller');
const bcrypt = require('bcryptjs');
const getLogsuccess = (req, res) => {
  const title = 'Ви ввійшли в акаунт';
  res.render(createPath('login_success'), { title });
}
const getLog = (req, res) => {
  const title = 'Логін';
  res.render(createPath('login'), { title });
}
const getAcc = (req, res) => {
  const title = 'Акаунт';
  res.render(createPath('account'), { title, req: req });
}
const getEditAcc = (req, res) => {
  const title = 'Змінення даних';
  res.render(createPath('edit-account'), { title, req: req });
}
const postEditAcc = async (req, res) => {
  const { name } = req.body;
  const IsMatch = await Users.findOne({ name: name });
  let title = "";
  let error = "";
  if (IsMatch) {
    title = "Проблема зміни даних";
    error = "Це ім'я зайняте, або ви не внесли змін у своє ім'я";
    return handleError(req, res, title, error)
  }
  const user = await Users.findOne({ name: req.session.user.username });
  req.session.user.username = name;
  await Users.updateOne({ name: user.name }, { $set: { name: name } })
  res.redirect('/account');
}
const postLog = async (req, res) => {


  try {
    const { login, password, RememberMe } = req.body;
    const user = await Users.findOne({ login: login });
    let title = "";
    let error = "";
    if (!user) {
      title = "Помилка автентифікації";
    error = "Користувача з таким ім'ям не існує";
    return handleError(req, res, title, error)
    }
    const hashedPass = bcrypt.hashSync(toString(password), 7);
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (passwordMatch == false) {
      title = "Помилка автентифікації";
    error = "Неправильний пароль";
    return handleError(req, res, title, error)
    }
    if (!req.session || req.session.user) {
      title = "Помилка автентифікації";
    error = "Вийдіть з свого акаунту перед входом в інший";
    return handleError(req, res, title, error)
    }
    if (RememberMe) {
      req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 365;
    }
    req.session.clientId = 'abc123';
    const name = user.name;
    // new session
    req.session.user = { username: name, login: login };
    res.redirect('/login_success');
  } catch (error) {
    title = "Помилка автентифікації";
    error = "Не вдалось ввійти в акаунт";
    return handleError(req, res, title, error)

  }
};
const getRegsuccess = (req, res) => {
  const title = 'Акаунт зареєстрован';
  res.render(createPath('registration_success'), { title });
}
const postReg = async (req, res) => {
  try{
    let title = "";
  let error = "";
  const { login, password, RememberMe } = req.body;
  const user = await Users.findOne({ login: login });
  if (user) {
    title = "Помилка реєстрації";
    error = "Користувач з таким ім'ям вже існує";
    return handleError(req, res, title, error)
  }
  console.log(!req.session, !req.session.user)
  if (!req.session || req.session.user) {
    title = "Помилка реєстрації";
    error = "Вийдіть з свого акаунту перед реєстрацієй";
    return handleError(req, res, title, error)
  }

  let hashPassword = bcrypt.hashSync(password, 7);
  const name = `User${Math.floor(Math.random() * 100000)}`;
  title = "Помилка реєстрації";
  error = "Не вдалося зареєструватися";
  req.session.user = {
    login: login,
    username: name
  }
  if (RememberMe) {
    req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 365;
  }
  await req.session.save();
  const newUser = new Users({ login, password: hashPassword, roles: "USER", name });
  newUser
    .save()
    .then((result) => res.redirect('/registration_success'))
}
    catch(error){
      handleError(req, res, title, error)
    };
}
const getLogout = (req, res) => {
  res.status(200).json({ message: "Почекайте кілька секунд" });
}
const postLogout = async (req, res) => {
  req.session.destroy();
  res.redirect('/account');
}
const getReg = (req, res) => {
  const title = 'Реєстрація';
  res.render(createPath('registration'), { title });
}
const getDelete = (req, res) => {
  res.status(200).json({ message: "Почекайте кілька секунд" });
}
const postDelete = async (req, res) => {
  await Users.findOneAndDelete({ login: req.session.user.login });
  req.session.destroy();
  res.redirect('/account');
}
module.exports = {
  getLogsuccess,
  postLog,
  getLog,
  getRegsuccess,
  postReg,
  getReg,
  getAcc,
  getLogout,
  postLogout,
  getEditAcc,
  postEditAcc,
  getDelete,
  postDelete
}