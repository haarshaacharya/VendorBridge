// src/controllers/vendorController.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { createLog } = require('./logController');
const prisma = new PrismaClient();

// GET /api/vendors — Get all vendors with their user info
exports.getAllVendors = async (req, res) => {
    try {
        const vendors = await prisma.vendor.findMany({
            include: {
                user: { select: { name: true, email: true, createdAt: true } }
            },
            orderBy: { user: { createdAt: 'desc' } }
        });

        // Map to frontend-compatible shape (matches StoreContext vendor structure)
        const mapped = vendors.map((v) => ({
            id: v.id,
            name: v.companyName,          // frontend uses 'name'
            companyName: v.companyName,
            category: v.category,
            gstNo: v.gstNumber,           // frontend uses 'gstNo'
            gstNumber: v.gstNumber,
            contactNo: v.contactNo,
            status: v.status === 'ACTIVE' ? 'Active'
                  : v.status === 'PENDING' ? 'Pending'
                  : v.status === 'BLOCKED' ? 'Blocked'
                  : v.status,
            userId: v.userId,
            email: v.user?.email || null,
            createdAt: v.user?.createdAt?.toISOString().split('T')[0] || null
        }));

        res.status(200).json({ vendors: mapped });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch vendors." });
    }
};

// POST /api/vendors — Register a new vendor (creates User + Vendor profile)
// Used when an ADMIN/OFFICER manually adds a vendor from the Vendors page
exports.addVendor = async (req, res) => {
    try {
        const { name, category, gstNo, gstNumber, contactNo, status, email } = req.body;

        const resolvedGst = gstNo || gstNumber;
        const resolvedStatus = (status || 'PENDING').toUpperCase();
        const resolvedEmail = email || `vendor_${Date.now()}@vendorbridge.internal`;

        // Check if GST already exists
        const existingVendor = await prisma.vendor.findUnique({ where: { gstNumber: resolvedGst } });
        if (existingVendor) {
            return res.status(400).json({ error: "A vendor with this GST number already exists." });
        }

        // Create a user account for the vendor with a temp password
        const tempPassword = await bcrypt.hash('VendorBridge@123', 10);
        const user = await prisma.user.create({
            data: {
                name,
                email: resolvedEmail,
                password: tempPassword,
                role: 'VENDOR'
            }
        });

        // Create the vendor profile
        const vendor = await prisma.vendor.create({
            data: {
                userId: user.id,
                companyName: name,
                category: category || 'Uncategorized',
                gstNumber: resolvedGst,
                contactNo: contactNo || 'Pending',
                status: resolvedStatus
            }
        });

        // Audit log — use the admin/officer's userId from JWT
        await createLog(
            req.user.userId,
            `Vendor registered manually: ${name} (GST: ${resolvedGst})`,
            'vendors'
        );

        res.status(201).json({
            message: "Vendor registered successfully.",
            vendor: {
                id: vendor.id,
                name: vendor.companyName,
                category: vendor.category,
                gstNo: vendor.gstNumber,
                contactNo: vendor.contactNo,
                status: resolvedStatus === 'ACTIVE' ? 'Active'
                       : resolvedStatus === 'PENDING' ? 'Pending'
                       : 'Blocked',
                userId: vendor.userId
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to register vendor." });
    }
};

// PUT /api/vendors/:id/status — Update vendor status (ACTIVE/BLOCKED/PENDING)
exports.updateVendorStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['ACTIVE', 'BLOCKED', 'PENDING'];
        const resolvedStatus = status.toUpperCase();
        if (!validStatuses.includes(resolvedStatus)) {
            return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
        }

        const vendor = await prisma.vendor.update({
            where: { id },
            data: { status: resolvedStatus }
        });

        await createLog(
            req.user.userId,
            `Vendor status updated to ${resolvedStatus}: ${vendor.id}`,
            'vendors'
        );

        res.status(200).json({
            message: "Vendor status updated.",
            vendor: { id: vendor.id, status: resolvedStatus }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update vendor status." });
    }
};
