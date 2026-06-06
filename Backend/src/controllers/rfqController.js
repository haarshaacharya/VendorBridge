// src/controllers/rfqController.js
const { PrismaClient } = require('@prisma/client');
const { createLog } = require('./logController');
const { sendRFQNotification } = require('../services/emailService');
const prisma = new PrismaClient();

// 1. Create a new RFQ (Only for Admin & Officer)
exports.createRFQ = async (req, res) => {
    try {
        const { title, description, deadline, items, category, assignedVendors, status } = req.body;
        const userId = req.user.userId;

        // Determine RFQ status: 'Sent' or 'Draft'
        const rfqStatus = status === 'Sent' ? 'ACTIVE' : 'ACTIVE'; // Keep as ACTIVE for both for now

        // Prisma Nested Write: RFQ and its Items saved together in DB
        const newRFQ = await prisma.rFQ.create({
            data: {
                title,
                description,
                deadline: new Date(deadline),
                category: category || null,
                assignedVendors: assignedVendors || [],
                status: rfqStatus,
                items: {
                    // Frontend sends lineItems with 'item' and 'qty' keys
                    // Backend schema uses 'description' and 'quantity'
                    create: items.map((i) => ({
                        description: i.description || i.item,
                        quantity: i.quantity || i.qty,
                        unit: i.unit
                    }))
                }
            },
            include: {
                items: true
            }
        });

        // If status is 'Sent' and vendors are assigned, send notification emails
        if (status === 'Sent' && assignedVendors && assignedVendors.length > 0) {
            try {
                // Get vendor emails from assigned vendor names
                const vendors = await prisma.vendor.findMany({
                    where: {
                        companyName: { in: assignedVendors }
                    },
                    include: { user: true }
                });

                const vendorEmails = vendors
                    .filter(v => v.user && v.user.email)
                    .map(v => v.user.email);

                if (vendorEmails.length > 0) {
                    // Send RFQ notification to all assigned vendors
                    await sendRFQNotification(newRFQ, vendorEmails);
                    await createLog(userId, `RFQ "${title}" sent to ${vendorEmails.length} vendor(s).`, 'rfq');
                } else {
                    console.warn(`No vendor emails found for assigned vendors: ${assignedVendors.join(', ')}`);
                }
            } catch (emailError) {
                console.error('Error sending RFQ notifications:', emailError);
                // Continue - RFQ is created even if email fails
            }
        }

        await createLog(userId, `RFQ created: "${title}" with ${items.length} line item(s).`, 'rfq');

        res.status(201).json({ message: "RFQ Created Successfully", rfq: newRFQ });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create RFQ" });
    }
};

// 2. Get All Active RFQs (For Vendors to see)
exports.getAllRFQs = async (req, res) => {
    try {
        const rfqs = await prisma.rFQ.findMany({
            where: { status: 'ACTIVE' },
            include: { items: true }
        });

        // Map items to also expose frontend-friendly field names
        const mapped = rfqs.map((rfq) => ({
            ...rfq,
            lineItems: rfq.items.map((item) => ({
                id: item.id,
                item: item.description,        // frontend uses 'item'
                description: item.description,
                qty: item.quantity,            // frontend uses 'qty'
                quantity: item.quantity,
                unit: item.unit
            }))
        }));

        res.status(200).json({ rfqs: mapped });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch RFQs" });
    }
};
