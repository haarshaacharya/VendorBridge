// src/routes/logRoutes.js
const express = require('express');
const { getActivityLogs } = require('../controllers/logController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');
const router = express.Router();

// Only ADMIN and MANAGER can view audit logs
router.get('/', verifyToken, checkRole(['ADMIN', 'MANAGER']), getActivityLogs);

module.exports = router;
