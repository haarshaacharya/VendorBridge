// src/controllers/logController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fetch Logs for the Audit Screen
exports.getActivityLogs = async (req, res) => {
    try {
        const logs = await prisma.activityLog.findMany({
            orderBy: { timestamp: 'desc' },
            include: {
                user: {
                    select: { name: true, role: true }
                }
            }
        });

        res.status(200).json({ logs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch activity logs." });
    }
};

// Utility function to create a log entry (can be used in other controllers)
exports.createLog = async (userId, action) => {
    try {
        await prisma.activityLog.create({
            data: { userId, action }
        });
    } catch (error) {
        console.error("Audit Log Error:", error);
    }
};
