// src/controllers/rfqController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Create a new RFQ (Only for Admin & Officer)
exports.createRFQ = async (req, res) => {
    try {
        const { title, description, deadline, items } = req.body;

        // Prisma Nested Write: RFQ and its Items saved together in DB
        const newRFQ = await prisma.rFQ.create({
            data: {
                title,
                description,
                deadline: new Date(deadline),
                items: {
                    create: items // Array of items [{ description: "Chair", quantity: 50, unit: "NOS" }]
                }
            },
            include: {
                items: true
            }
        });

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
        res.status(200).json({ rfqs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch RFQs" });
    }
};
