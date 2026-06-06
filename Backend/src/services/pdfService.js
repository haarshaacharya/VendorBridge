// src/services/pdfService.js
const PDFDocument = require('pdfkit');

exports.generateInvoicePDF = (invoiceData, vendorData, poData, res) => {
    const doc = new PDFDocument({ margin: 50 });

    // Set response headers so the browser treats this as a downloadable PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${invoiceData.invoiceNumber}.pdf`);

    doc.pipe(res);

    // Header
    doc.fontSize(20).text('TAX INVOICE', { align: 'center' }).moveDown();
    doc.fontSize(12).text(`Invoice Number: ${invoiceData.invoiceNumber}`);
    doc.text(`Date: ${new Date(invoiceData.createdAt).toLocaleDateString()}`);
    doc.text(`PO Number: ${poData.poNumber}`).moveDown();

    // Vendor Details
    doc.fontSize(14).text('Billed To:');
    doc.fontSize(12).text(`Company: ${vendorData.companyName}`);
    doc.text(`GSTIN: ${vendorData.gstNumber}`);
    doc.text(`Contact: ${vendorData.contactNo}`).moveDown();

    // Amount Details
    doc.moveTo(50, 250).lineTo(550, 250).stroke();
    doc.moveDown();
    doc.text(`Subtotal Amount: Rs. ${poData.quotation.totalAmount.toLocaleString()}`);
    doc.text(`GST (18%): Rs. ${invoiceData.taxAmount.toLocaleString()}`);

    doc.moveDown();
    doc.fontSize(14).text(`Grand Total: Rs. ${invoiceData.grandTotal.toLocaleString()}`, { bold: true });

    // Footer
    doc.moveDown(5);
    doc.fontSize(10).text('This is an auto-generated invoice by VendorBridge ERP.', { align: 'center', color: 'gray' });

    doc.end();
};
