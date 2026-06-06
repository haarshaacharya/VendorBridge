// src/controllers/approvalController.js
const { PrismaClient } = require('@prisma/client');
const { createLog } = require('./logController');
const prisma = new PrismaClient();

exports.approveQuotation = async (req, res) => {
    try {
        const { quotationId } = req.params;
        const { remarks } = req.body;
        const userId = req.user.userId;

        // Fetch the quotation to ensure it exists and is pending
        const quotation = await prisma.quotation.findUnique({
            where: { id: quotationId },
            include: { vendor: true, rfq: true }
        });
        if (!quotation) return res.status(404).json({ error: "Quotation not found." });
        if (quotation.status !== 'PENDING') return res.status(400).json({ error: "Quotation is already processed." });

        // Prisma Transaction: if any step fails, all changes are reverted (Data Consistency)
        const result = await prisma.$transaction(async (tx) => {

            // Step A: Approve Quotation
            const updatedQuotation = await tx.quotation.update({
                where: { id: quotationId },
                data: { status: 'APPROVED', remarks }
            });

            // Step B: Auto-generate Purchase Order (PO)
            const poNumber = `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
            const purchaseOrder = await tx.purchaseOrder.create({
                data: {
                    poNumber,
                    quotationId: updatedQuotation.id,
                    status: 'APPROVED'
                }
            });

            // Step C: Auto-generate Invoice (18% GST calculation)
            const subtotal = updatedQuotation.totalAmount;
            const taxAmount = parseFloat((subtotal * 0.18).toFixed(2));
            const grandTotal = parseFloat((subtotal + taxAmount).toFixed(2));
            const invoiceNumber = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;

            const invoice = await tx.invoice.create({
                data: {
                    poId: purchaseOrder.id,
                    invoiceNumber,
                    taxAmount,
                    grandTotal,
                    status: 'Pending Payment'
                }
            });

            return { updatedQuotation, purchaseOrder, invoice };
        });

        // Audit log — after transaction succeeds
        await createLog(
            userId,
            `Quotation approved for ${quotation.vendor.companyName} — RFQ: ${quotation.rfq.title}. PO generated.`,
            'approvals'
        );
        await createLog(
            userId,
            `PO ${result.purchaseOrder.poNumber} and Invoice ${result.invoice.invoiceNumber} auto-generated.`,
            'invoices'
        );

        // Map response to frontend-compatible shape
        res.status(200).json({
            message: "Approval successful! PO and Invoice auto-generated.",
            data: {
                ...result,
                // Frontend uses these keys
                poNo: result.purchaseOrder.poNumber,
                invoiceNo: result.invoice.invoiceNumber,
                amount: result.updatedQuotation.totalAmount,
                grandTotal: result.invoice.grandTotal
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to process approval workflow." });
    }
};
