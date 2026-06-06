// src/controllers/analyticsController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getDashboardStats = async (req, res) => {
    try {
        // Count Active RFQs
        const activeRFQs = await prisma.rFQ.count({
            where: { status: 'ACTIVE' }
        });

        // Count Pending Approvals
        const pendingApprovals = await prisma.quotation.count({
            where: { status: 'PENDING' }
        });

        // Count Total POs generated
        const totalPOs = await prisma.purchaseOrder.count();

        // Calculate Total Spends (Sum of all Invoice grand totals)
        const spendAggregation = await prisma.invoice.aggregate({
            _sum: { grandTotal: true }
        });
        const totalSpend = spendAggregation._sum.grandTotal || 0;

        // Recent Purchase Orders for the table
        const recentPOs = await prisma.purchaseOrder.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { quotation: { include: { vendor: true } } }
        });

        res.status(200).json({
            activeRFQs,
            pendingApprovals,
            totalPOs,
            totalSpend,
            recentPOs
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch dashboard stats." });
    }
};
