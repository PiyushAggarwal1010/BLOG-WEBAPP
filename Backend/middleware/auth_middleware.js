const jwt = require('jsonwebtoken');
const config = require('../config/config')

const authMiddleware=(req,res,next)=>{
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: 'Not authorized, token missing'
            });
        }
        
        const decoded = jwt.verify(token, config.JWT_SECRET);

        req.user= decoded;

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
}

module.exports = authMiddleware;