const path = require('path');
const createPath = (page) => path.resolve(__dirname, '../ejs-public', `${page}.ejs`);
module.exports = createPath;