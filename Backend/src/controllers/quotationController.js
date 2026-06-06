// src/controllers/quotationController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Vendor submits a quotation
exports.submitQuotation = async (req, res) => {
    try {
        const { rfqId, deliveryDays, totalAmount, remarks } = req.body;
        const userId = req.user.userId;

        // Check if logged-in user is a registered Vendor
        const vendor = await prisma.vendor.findUnique({ where: { userId } });
        if (!vendor) {
            return res.status(403).json({ error: "Only registered vendors can submit quotations." });
        }

        // Check if RFQ is active and deadline has not passed
        const rfq = await prisma.rFQ.findUnique({ where: { id: rfqId } });
        if (!rfq || rfq.status !== 'ACTIVE' || new Date() > new Date(rfq.deadline)) {
            return res.status(400).json({ error: "RFQ is closed or deadline has passed." });
        }

        // Create quotation
        const quotation = await prisma.quotation.create({
            data: {
                rfqId,
                vendorId: vendor.id,
                deliveryDays,
                totalAmount,
                remarks
            }
        });

        res.status(201).json({ message: "Quotation submitted successfully", quotation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to submit quotation" });
    }
};

// 2. Compare Quotations (For Officers/Managers)
exports.compareQuotations = async (req, res) => {
    try {
        const { rfqId } = req.params;

        // Fetch all quotations for this RFQ along with Vendor Details, sorted by lowest price
        const quotations = await prisma.quotation.findMany({
            where: { rfqId },
            include: {
                vendor: {
                    select: { companyName: true, category: true, gstNumber: true }
                }
            },
            orderBy: { totalAmount: 'asc' }
        });

        if (quotations.length === 0) {
            return res.status(404).json({ message: "No quotations received yet." });
        }

        // Add a flag to highlight the lowest price (L1 Vendor)
        const comparedData = quotations.map((q, index) => ({
            ...q,
            isLowestPrice: index === 0
        }));

        res.status(200).json({
            rfqId,
            totalQuotations: quotations.length,
            quotations: comparedData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to compare quotations" });
    }
};
