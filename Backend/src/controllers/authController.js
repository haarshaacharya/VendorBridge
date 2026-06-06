// src/controllers/authController.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// Valid roles in DB — map frontend role strings to backend enum
const ROLE_MAP = {
    'admin':    'ADMIN',
    'officer':  'OFFICER',
    'manager':  'MANAGER',
    'vendor':   'VENDOR',
    // Frontend RegisterCard sends these — map them to closest backend role
    'developer':  'OFFICER',
    'designer':   'OFFICER',
    'analyst':    'OFFICER',
    'student':    'VENDOR',
    'other':      'VENDOR',
};

exports.register = async (req, res) => {
    try {
        // Frontend sends: firstName + lastName separately, or name as single field
        const {
            name,
            firstName,
            lastName,
            email,
            password,
            role,
            phone,       // extra frontend fields — stored but not in DB schema (ignored gracefully)
            country,
            additionalInfo
        } = req.body;

        // Compose full name — support both single 'name' and 'firstName'+'lastName'
        const fullName = name || `${firstName || ''} ${lastName || ''}`.trim() || 'Unknown';

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists with this email." });
        }

        // Map role string to valid enum — default VENDOR
        const resolvedRole = ROLE_MAP[(role || '').toLowerCase()] || 'VENDOR';

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                name: fullName,
                email,
                password: hashedPassword,
                role: resolvedRole
            }
        });

        // If user is a VENDOR, also create an empty Vendor profile
        if (user.role === 'VENDOR') {
            await prisma.vendor.create({
                data: {
                    userId: user.id,
                    companyName: `${fullName}'s Company`,
                    category: "Uncategorized",
                    gstNumber: `PENDING-${Date.now()}`,
                    contactNo: phone || "Pending"
                }
            });
        }

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Registration failed." });
    }
};

exports.login = async (req, res) => {
    try {
        // Frontend sends 'username' field but it contains email value
        // Accept both 'email' and 'username' keys
        const { email, username, password } = req.body;
        const resolvedEmail = email || username;

        if (!resolvedEmail || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        // Find user
        const user = await prisma.user.findUnique({ where: { email: resolvedEmail } });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET || 'super_secret_hackathon_key',
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user.id, name: user.name, role: user.role }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Login failed." });
    }
};
