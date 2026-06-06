// src/routes/analyticsRoutes.js
const express = require('express');
const { getDashboardStats } = require('../controllers/analyticsController');
const { verifyToken } = require('../middlewares/authMiddleware');
const router = express.Router();

// Any internal user can view the dashboard
router.get('/dashboard', verifyToken, getDashboardStats);

module.exports = router;
