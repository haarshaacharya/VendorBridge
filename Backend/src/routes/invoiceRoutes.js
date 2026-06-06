// src/routes/invoiceRoutes.js
const express = require('express');
const { downloadInvoice, emailInvoiceToVendor, getAllInvoices, markInvoiceAsPaid } = require('../controllers/invoiceController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Get all invoices (mapped to frontend field names)
router.get('/', verifyToken, getAllInvoices);

// Download invoice as PDF
router.get('/download/:poId', verifyToken, downloadInvoice);

// Email invoice to vendor
router.post('/send-email/:poId', verifyToken, emailInvoiceToVendor);

// Mark invoice as paid
router.put('/mark-paid/:poId', verifyToken, markInvoiceAsPaid);

module.exports = router;
