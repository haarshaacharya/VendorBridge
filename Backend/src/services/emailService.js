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

// Send RFQ notification to vendors
exports.sendRFQNotification = async (rfq, vendorEmails) => {
    try {
        if (!vendorEmails || vendorEmails.length === 0) {
            console.log("No vendor emails to send RFQ notification to");
            return false;
        }

        const rfqDetails = rfq.items
            .map((item, idx) => `${idx + 1}. ${item.description} - Qty: ${item.quantity} ${item.unit}`)
            .join('\n');

        const deadlineDate = new Date(rfq.deadline).toLocaleDateString('en-IN');

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: vendorEmails.join(', '),
            subject: `New RFQ: ${rfq.title} - VendorBridge`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #10b981;">New Request for Quotation</h2>
                    <p>Dear Vendor,</p>
                    <p>A new Request for Quotation (RFQ) has been issued. Please find the details below:</p>
                    
                    <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>RFQ Title:</strong> ${rfq.title}</p>
                        <p><strong>Category:</strong> ${rfq.category || 'N/A'}</p>
                        <p><strong>Deadline:</strong> ${deadlineDate}</p>
                        <p><strong>Description:</strong> ${rfq.description || 'No description provided'}</p>
                    </div>

                    <h3 style="color: #374151;">Line Items:</h3>
                    <pre style="background: #f9fafb; padding: 10px; border-radius: 5px; overflow-x: auto;">${rfqDetails}</pre>

                    <p style="margin-top: 20px;">Please submit your quotation by the deadline mentioned above.</p>
                    <p>If you have any questions, please contact the procurement team.</p>
                    
                    <p style="margin-top: 30px; color: #6b7280;">Best regards,<br/>VendorBridge Team</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`RFQ notification sent to ${vendorEmails.length} vendor(s)`);
        return true;
    } catch (error) {
        console.error("RFQ notification email failed:", error);
        return false;
    }
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
