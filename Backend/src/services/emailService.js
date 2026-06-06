// src/services/emailService.js
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Generate PDF as a Buffer (for email attachment without saving to disk)
const generatePDFBuffer = (invoice, vendor, po) => {
    return new Promise((resolve) => {
        const doc = new PDFDocument({ margin: 50 });
        let buffers = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));

        // Basic PDF Design
        doc.fontSize(20).text('TAX INVOICE', { align: 'center' }).moveDown();
        doc.fontSize(12).text(`Invoice Number: ${invoice.invoiceNumber}`);
        doc.text(`PO Number: ${po.poNumber}`).moveDown();
        doc.text(`Billed To: ${vendor.companyName} (${vendor.email || 'vendor@test.com'})`);
        doc.moveDown();
        doc.text(`Subtotal: Rs. ${po.quotation.totalAmount}`);
        doc.text(`GST (18%): Rs. ${invoice.taxAmount}`);
        doc.fontSize(14).text(`Grand Total: Rs. ${invoice.grandTotal}`, { bold: true });

        doc.end();
    });
};

exports.sendInvoiceEmail = async (invoice, vendor, po) => {
    try {
        const pdfBuffer = await generatePDFBuffer(invoice, vendor, po);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: "vendor_ki_actual_email@gmail.com",
            subject: `Invoice Generated: ${invoice.invoiceNumber} - VendorBridge ERP`,
            text: `Hello ${vendor.companyName},\n\nYour invoice for PO ${po.poNumber} has been generated. Please find the PDF attached.\n\nRegards,\nVendorBridge Team`,
            attachments: [
                {
                    filename: `${invoice.invoiceNumber}.pdf`,
                    content: pdfBuffer
                }
            ]
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error("Email sending failed:", error);
        return false;
    }
};
