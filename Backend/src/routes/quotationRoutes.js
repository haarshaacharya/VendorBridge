// src/routes/quotationRoutes.js
const express = require('express');
const { submitQuotation, compareQuotations } = require('../controllers/quotationController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// Only VENDOR can submit a quotation
router.post('/submit', verifyToken, checkRole(['VENDOR']), submitQuotation);

// Only OFFICER, MANAGER, or ADMIN can compare quotations
router.get('/compare/:rfqId', verifyToken, checkRole(['ADMIN', 'OFFICER', 'MANAGER']), compareQuotations);

module.exports = router;
