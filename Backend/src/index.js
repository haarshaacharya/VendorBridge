const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

// Import Routes
const authRoutes = require('./routes/authRoutes');
const rfqRoutes = require('./routes/rfqRoutes');
const quotationRoutes = require('./routes/quotationRoutes');
const approvalRoutes = require('./routes/approvalRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const logRoutes = require('./routes/logRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const vendorRoutes = require('./routes/vendorRoutes');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/rfq', rfqRoutes);
app.use('/api/quotation', quotationRoutes);
app.use('/api/approval', approvalRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/invoice', invoiceRoutes);
app.use('/api/vendors', vendorRoutes);

// Base Route
app.get('/', (req, res) => {
    res.send("VendorBridge ERP API is Running!");
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
