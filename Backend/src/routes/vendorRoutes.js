// src/routes/vendorRoutes.js
const express = require('express');
const { getAllVendors, addVendor, updateVendorStatus } = require('../controllers/vendorController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// Any logged-in user can view vendors list
router.get('/', verifyToken, getAllVendors);

// Only ADMIN or OFFICER can manually register a vendor
router.post('/', verifyToken, checkRole(['ADMIN', 'OFFICER']), addVendor);

// Only ADMIN can change vendor status (block/unblock/approve)
router.put('/:id/status', verifyToken, checkRole(['ADMIN', 'MANAGER']), updateVendorStatus);

module.exports = router;
