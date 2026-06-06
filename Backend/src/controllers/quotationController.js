// src/controllers/quotationController.js
const { PrismaClient } = require('@prisma/client');
const { createLog } = require('./logController');
const prisma = new PrismaClient();

// 1. Vendor submits a quotation
exports.submitQuotation = async (req, res) => {
    try {
        // Frontend sends: grandTotal (as totalAmount), notes (as remarks), gstPercent, vendorRating, paymentTerms
        const {
            rfqId,
            deliveryDays,
            totalAmount,   // frontend may also send as grandTotal
            grandTotal,
            remarks,
            notes,         // frontend sends 'notes', we accept both
            gstPercent,
            vendorRating,
            paymentTerms
        } = req.body;

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

        // Create quotation — accept both field name variants from frontend
        const quotation = await prisma.quotation.create({
            data: {
                rfqId,
                vendorId: vendor.id,
                deliveryDays,
                totalAmount: totalAmount || grandTotal,
                gstPercent: gstPercent || 18,
                vendorRating: vendorRating || null,
                paymentTerms: paymentTerms || null,
                remarks: remarks || notes || null
            }
        });

        await createLog(
            userId,
            `Quotation submitted by ${vendor.companyName} for RFQ ${rfqId}. Amount: ${totalAmount || grandTotal}.`,
            'rfq'
        );

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
        // Also map fields to match frontend expectations
        const comparedData = quotations.map((q, index) => ({
            ...q,
            vendorName: q.vendor.companyName,  // frontend uses vendorName
            grandTotal: q.totalAmount,           // frontend uses grandTotal
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
