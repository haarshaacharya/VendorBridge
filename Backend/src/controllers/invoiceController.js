// src/controllers/invoiceController.js
const { PrismaClient } = require('@prisma/client');
const { generateInvoicePDF } = require('../services/pdfService');
const { sendInvoiceEmail } = require('../services/emailService');
const prisma = new PrismaClient();

// Helper: fetch full invoice+PO data or return 404
async function getInvoiceData(poId, res) {
    const invoice = await prisma.invoice.findUnique({ where: { poId } });
    const po = await prisma.purchaseOrder.findUnique({
        where: { id: poId },
        include: {
            quotation: {
                include: { vendor: { include: { user: true } }, rfq: true }
            }
        }
    });

    if (!invoice || !po) {
        res.status(404).json({ error: "Invoice or PO not found." });
        return null;
    }
    return { invoice, po };
}

exports.downloadInvoice = async (req, res) => {
    try {
        const { poId } = req.params;
        const data = await getInvoiceData(poId, res);
        if (!data) return;

        const { invoice, po } = data;
        generateInvoicePDF(invoice, po.quotation.vendor, po, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to generate invoice." });
    }
};

exports.emailInvoiceToVendor = async (req, res) => {
    try {
        const { poId } = req.params;
        const data = await getInvoiceData(poId, res);
        if (!data) return;

        const { invoice, po } = data;
        const emailSent = await sendInvoiceEmail(invoice, po.quotation.vendor, po);

        if (emailSent) {
            res.status(200).json({ message: "Invoice PDF successfully emailed to Vendor!" });
        } else {
            res.status(500).json({ error: "Failed to send email." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error during email process." });
    }
};

// GET /api/invoice/list — returns all invoices mapped to frontend field names
exports.getAllInvoices = async (req, res) => {
    try {
        const invoices = await prisma.invoice.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                purchaseOrder: {
                    include: {
                        quotation: {
                            include: { vendor: true }
                        }
                    }
                }
            }
        });

        // Map to frontend-compatible shape (matches StoreContext invoice structure)
        const mapped = invoices.map((inv) => ({
            invoiceNo: inv.invoiceNumber,          // frontend uses invoiceNo
            poNo: inv.purchaseOrder.poNumber,       // frontend uses poNo
            vendorName: inv.purchaseOrder.quotation.vendor.companyName,
            amount: inv.grandTotal,                 // frontend uses amount
            status: inv.status,
            dateCreated: inv.createdAt.toISOString().split('T')[0],
            dueDate: new Date(new Date(inv.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000)
                .toISOString().split('T')[0],
            // Keep original IDs for API calls
            id: inv.id,
            poId: inv.poId,
            taxAmount: inv.taxAmount,
            grandTotal: inv.grandTotal
        }));

        res.status(200).json({ invoices: mapped });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch invoices." });
    }
};

// PUT /api/invoice/mark-paid/:poId — mark invoice as Paid
exports.markInvoiceAsPaid = async (req, res) => {
    try {
        const { poId } = req.params;

        const invoice = await prisma.invoice.findUnique({ where: { poId } });
        if (!invoice) return res.status(404).json({ error: "Invoice not found." });

        const updated = await prisma.invoice.update({
            where: { poId },
            data: { status: 'Paid' }
        });

        res.status(200).json({ message: "Invoice marked as Paid.", invoice: updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update invoice status." });
    }
};
