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

        // Overdue invoices (status = 'Overdue')
        const overdueInvoices = await prisma.invoice.count({
            where: { status: 'Overdue' }
        });

        // Recent Purchase Orders — mapped to match frontend field names
        const recentPOsRaw = await prisma.purchaseOrder.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                quotation: {
                    include: {
                        vendor: true,
                        rfq: { select: { title: true, category: true, id: true } }
                    }
                },
                invoice: { select: { status: true, grandTotal: true } }
            }
        });

        // Map to frontend-compatible shape (matches StoreContext PO structure)
        const recentPOs = recentPOsRaw.map((po) => ({
            poNo: po.poNumber,           // frontend uses poNo
            rfqId: po.quotation.rfq?.id || '',
            vendorName: po.quotation.vendor.companyName,  // frontend uses vendorName
            amount: po.quotation.totalAmount,              // frontend uses amount
            status: po.status === 'APPROVED' ? 'Approved' : po.status,
            createdAt: po.createdAt.toISOString().split('T')[0],
            dueDate: po.invoice
                ? new Date(new Date(po.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000)
                    .toISOString().split('T')[0]
                : null
        }));

        res.status(200).json({
            activeRFQs,
            pendingApprovals,
            totalPOs,
            totalSpend,
            overdueInvoices,
            recentPOs
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch dashboard stats." });
    }
};
