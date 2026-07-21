const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
        const error = new Error("invalid Authorization header !")
        error.statusCode = 401;
        throw error
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;

    try {
        decodedToken = jwt.verify(token, 'ShoundShound');
    } catch (error) {
        error.statusCode = 401
        throw error
    }

    if (!decodedToken) {
        const error = new Error("invalid token!")
        error.statusCode = 401;
        throw error
    }
    req.userId = decodedToken.userId
    next()

}