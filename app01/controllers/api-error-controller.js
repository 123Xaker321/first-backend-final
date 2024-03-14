const handleError = (res, error) => {
    res.status(500).send(error.message);
}
module.exports = {
    handleError
}