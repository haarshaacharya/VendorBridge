// src/routes/approvalRoutes.js
const express = require('express');
const { approveQuotation } = require('../controllers/approvalController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// Route: PUT /api/approval/approve/:quotationId
// Only MANAGER or ADMIN can approve
router.put('/approve/:quotationId', verifyToken, checkRole(['MANAGER', 'ADMIN']), approveQuotation);

module.exports = router;
