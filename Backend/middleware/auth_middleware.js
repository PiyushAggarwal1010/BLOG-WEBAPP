const jwt = require('jsonwebtoken');
const config = require('../config/config')

const authMiddleware=(req,res,next)=>{
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Not authorized, token missing' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, config.JWT_SECRET);

        req.user= decoded;

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
}

module.exports = authMiddleware;