const jwt = require("jsonwebtoken")
require("dotenv").config();

const generateToken = (user) => {
    // Exclude sensitive data drom the token payload
    const payload = {
        userId: user._id, // to be updated
        username: user.username,
        roles: user.roles
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES});
}; 

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({error: "Unauthorized"});
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user; 
        next();
    } catch (err) {
        res.clearCookie("token");
        return res.status(403).json({error: "Forbidden"});
    }
};

module.exports = {
    generateToken, 
    authenticateToken
}