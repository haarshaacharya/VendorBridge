// src/controllers/logController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fetch Logs for the Audit Screen
exports.getActivityLogs = async (req, res) => {
    try {
        const { type } = req.query; // optional filter: ?type=rfq

        const where = {};
        if (type && type !== 'all') {
            where.type = type;
        }

        const logs = await prisma.activityLog.findMany({
            where,
            orderBy: { timestamp: 'desc' },
            include: {
                user: {
                    select: { name: true, role: true }
                }
            }
        });

        // Map fields to match frontend expectations
        const mapped = logs.map((log) => ({
            id: log.id,
            message: log.action,       // frontend uses 'message'
            action: log.action,
            type: log.type,
            time: new Date(log.timestamp).toLocaleString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }),
            timestamp: log.timestamp,
            user: log.user
        }));

        res.status(200).json({ logs: mapped });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch activity logs." });
    }
};

// Utility function to create a log entry (used in other controllers)
exports.createLog = async (userId, action, type = 'general') => {
    try {
        await prisma.activityLog.create({
            data: { userId, action, type }
        });
    } catch (error) {
        console.error("Audit Log Error:", error);
    }
};
