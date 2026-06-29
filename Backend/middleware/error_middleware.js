const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    const message = err.message || 'Something went wrong on the server';

    console.error(`[Error] ${statusCode} - ${message}`);

    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: message,
        
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

module.exports = errorHandler;