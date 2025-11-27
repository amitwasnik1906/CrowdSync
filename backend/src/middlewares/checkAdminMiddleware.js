const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const checkAdmin = async (req, res, next) => {
    try {
        // Get token from authorization header
        // const token =
        // req.cookies?.refresToken ||
        // req.header("Authorization")?.replace("Bearer ", "");
        // // const token = req.cookies.refreshToken;
        // if (!token) {
        //     return res.status(401).json({ message: "No token provided" });
        // }        
        
        // // Verify token
        // const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        
        // // Check if admin exists and has valid refresh token
        // const admin = await prisma.admin.findUnique({
        //     where: { id: decoded.id }
        // });

        // if (!admin || !admin.refreshToken) {
        //     return res.status(401).json({ message: "Invalid token :" });
        // }

        // // Attach admin to request object
        // req.admin = {
        //     id: admin.id,
        //     name: admin.name,
        //     email: admin.email
        // };

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" });
        }
        return res.status(500).json({ message: "Error authenticating admin", error: error.message });
    }
};

module.exports = checkAdmin;
