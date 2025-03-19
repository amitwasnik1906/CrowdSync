const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// Admin Registration
const adminRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if admin already exists
        const existingAdmin = await prisma.admin.findUnique({
            where: { email }
        });

        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Create new admin
        const admin = await prisma.admin.create({
            data: {
                name,
                email,
                password_hash
            }
        });

        res.status(201).json({
            message: "Admin registered successfully",
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Error registering admin", error: error.message });
    }
};

// Admin Login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find admin
        const admin = await prisma.admin.findUnique({
            where: { email }
        });

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, admin.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const refreshToken = jwt.sign(
            { id: admin.id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        // Save refresh token to database
        await prisma.admin.update({
            where: { id: admin.id },
            data: { refreshToken }
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        }).status(200).json({
            message: "Login successful",
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email
            },
            refreshToken
        });

    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};

// Admin Logout
const adminLogout = async (req, res) => {
    try {
        const { id } = req.admin; // Assuming middleware sets this

        // Clear refresh token in database
        await prisma.admin.update({
            where: { id },
            data: { refreshToken: null }
        });

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        }).status(200).json({ message: "Logged out successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error logging out", error: error.message });
    }
};

// User Register
const userRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Create new user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password_hash
            }
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
};

// User Login
const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        // Save refresh token to database
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken }
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        }).status(200).json({
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            refreshToken
        });

    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};

// User Logout
const userLogout = async (req, res) => {
    try {
        const { id } = req.user; // Assuming middleware sets this

        // Clear refresh token in database
        await prisma.user.update({
            where: { id },
            data: { refreshToken: null }
        });

        res.status(200).json({ message: "Logged out successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error logging out", error: error.message });
    }
};


module.exports = {
    adminRegister,
    adminLogin,
    adminLogout,
    userRegister,
    userLogin,
    userLogout
};
