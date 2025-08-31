const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.header("Authorization");
        
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                msg: "No token, authorization denied"
            });
        }

        // Extract token from "Bearer <token>" format
        const token = authHeader.split(" ")[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                msg: "No token, authorization denied"
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add user info to request object
        req.user = decoded; // {adminId, name, iat, exp}
        
        // Move to the next middleware/route
        next();
        
    } catch (err) {
        console.error('Auth middleware error:', err);
        res.status(401).json({
            success: false,
            msg: "Token is not valid"
        });
    }
};

module.exports = authMiddleware;
