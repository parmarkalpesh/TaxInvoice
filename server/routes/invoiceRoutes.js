const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');

// Helper function to generate invoice number
const generateInvoiceNumber = async () => {
    const count = await Invoice.countDocuments();
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    return `INV-${year}${month}-${String(count + 1).padStart(4, '0')}`;
};

// GET all invoices
router.get('/', async (req, res) => {
    try {
        const invoices = await Invoice.find().sort({ createdAt: -1 });
        res.json(invoices);
    } catch (error) {
        console.error('Error fetching invoices:', error);
        res.status(500).json({ message: 'Server error while fetching invoices' });
    }
});

// GET single invoice by ID
router.get('/:id', async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.json(invoice);
    } catch (error) {
        console.error('Error fetching invoice:', error);
        res.status(500).json({ message: 'Server error while fetching invoice' });
    }
});

// POST create new invoice
router.post('/', async (req, res) => {
    try {
        const { customerName, mobileNumber, customerAddress, items, subtotal, totalGst, grandTotal } = req.body;

        // Validation
        if (!customerName || !mobileNumber || !customerAddress) {
            return res.status(400).json({ message: 'Customer details are required' });
        }

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'At least one billing item is required' });
        }

        // Generate invoice number
        const invoiceNumber = await generateInvoiceNumber();

        const invoice = new Invoice({
            invoiceNumber,
            customerName,
            mobileNumber,
            customerAddress,
            items,
            subtotal,
            totalGst,
            grandTotal
        });

        const savedInvoice = await invoice.save();
        res.status(201).json(savedInvoice);
    } catch (error) {
        console.error('Error creating invoice:', error);
        res.status(500).json({ message: 'Server error while creating invoice', error: error.message });
    }
});

// DELETE invoice by ID
router.delete('/:id', async (req, res) => {
    try {
        const invoice = await Invoice.findByIdAndDelete(req.params.id);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        console.error('Error deleting invoice:', error);
        res.status(500).json({ message: 'Server error while deleting invoice' });
    }
});

module.exports = router;
