const { ApiError } = require('../utils/apiError');

function errorMiddleware(err, req, res, next) {
    const status = err instanceof ApiError ? err.statusCode : 500;
    const message = err.message || 'Internal Server Error';

    if (process.env.NODE_ENV !== 'production') {
        console.error('Error:', err);
    }

    res.status(status).json({
        success: false,
        status,
        message,
    });
}

module.exports = errorMiddleware;