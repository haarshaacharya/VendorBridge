// src/controllers/invoiceController.js
const { PrismaClient } = require('@prisma/client');
const { generateInvoicePDF } = require('../services/pdfService');
const { sendInvoiceEmail } = require('../services/emailService');
const prisma = new PrismaClient();

exports.downloadInvoice = async (req, res) => {
    try {
        const { poId } = req.params;

        // Fetch everything related to this PO
        const invoice = await prisma.invoice.findUnique({ where: { poId } });
        const po = await prisma.purchaseOrder.findUnique({
            where: { id: poId },
            include: {
                quotation: {
                    include: { vendor: true }
                }
            }
        });

        if (!invoice || !po) {
            return res.status(404).json({ error: "Invoice or PO not found." });
        }

        // Generate and stream PDF directly to frontend
        generateInvoicePDF(invoice, po.quotation.vendor, po, res);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to generate invoice." });
    }
};

exports.emailInvoiceToVendor = async (req, res) => {
    try {
        const { poId } = req.params;

        const invoice = await prisma.invoice.findUnique({ where: { poId } });
        const po = await prisma.purchaseOrder.findUnique({
            where: { id: poId },
            include: { quotation: { include: { vendor: { include: { user: true } } } } }
        });

        if (!invoice || !po) return res.status(404).json({ error: "Data not found." });

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
