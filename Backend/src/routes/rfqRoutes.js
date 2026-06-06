// src/routes/rfqRoutes.js
const express = require('express');
const { createRFQ, getAllRFQs } = require('../controllers/rfqController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// Only ADMIN and OFFICER can create an RFQ
router.post('/', verifyToken, checkRole(['ADMIN', 'OFFICER']), createRFQ);

// Any logged-in user (including Vendor) can view RFQs
router.get('/', verifyToken, getAllRFQs);

module.exports = router;
