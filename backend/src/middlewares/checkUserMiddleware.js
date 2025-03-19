const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const checkUser = async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        
        // Check if user exists and has valid refresh token
        const user = await prisma.user.findUnique({
            where: { id: decoded.id }
        });

        if (!user || !user.refreshToken) {
            return res.status(401).json({ message: "User not authorized" });
        }

        // Attach user to request
        req.user = {
            id: user.id,
            email: user.email,
            name: user.name
        };

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Invalid token" });
        }
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = checkUser;
