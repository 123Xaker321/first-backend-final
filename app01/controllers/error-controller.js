const createPath = require('../helpers/create-path');
const handleError = (req, res, title, error) => {
    try{
return res.render(createPath('error'), { title, error });
    }
    catch(err){
        console.log(err)
    }
}
module.exports = {
    handleError
}