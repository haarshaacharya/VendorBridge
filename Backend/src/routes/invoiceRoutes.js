// src/routes/invoiceRoutes.js
const express = require('express');
const { downloadInvoice, emailInvoiceToVendor } = require('../controllers/invoiceController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Download invoice as PDF
router.get('/download/:poId', verifyToken, downloadInvoice);

// Email invoice to vendor
router.post('/send-email/:poId', verifyToken, emailInvoiceToVendor);

module.exports = router;
