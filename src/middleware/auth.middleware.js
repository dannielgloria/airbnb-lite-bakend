const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

function authMiddleware(req, res, next) {
    const auth = req.headers.authorization;
    const token = auth && auth.startsWith('Bearer ') ? auth.split(' ')[1] : null;

    if (!token) throw new ApiError(401, 'Unauthorized');

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload; // { sub, email }
        next();
    } catch {
        throw new ApiError(401, 'Invalid token');
    }
}

module.exports = authMiddleware;