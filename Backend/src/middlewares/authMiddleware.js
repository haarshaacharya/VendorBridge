// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: "Access Denied. No token provided." });

    try {
        const verified = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET || 'super_secret_hackathon_key');
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ error: "Invalid Token" });
    }
};

exports.checkRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Access Forbidden. You don't have permission." });
        }
        next();
    };
};