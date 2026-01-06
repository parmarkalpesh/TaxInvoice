import { useState } from 'react';
import { Plus, Trash2, Save, Download } from 'lucide-react';
import api from '../api/config';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const InvoiceForm = ({ onInvoiceSaved }) => {
    const [customer, setCustomer] = useState({
        customerName: '',
        mobileNumber: '',
        customerAddress: ''
    });

    const [items, setItems] = useState([
        { productName: '', quantity: 1, price: 0, gst: 0, rowTotal: 0 }
    ]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const calculateRowTotal = (quantity, price, gst) => {
        const baseAmount = quantity * price;
        const gstAmount = (baseAmount * gst) / 100;
        return baseAmount + gstAmount;
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;

        if (field === 'quantity' || field === 'price' || field === 'gst') {
            const qty = parseFloat(newItems[index].quantity) || 0;
            const price = parseFloat(newItems[index].price) || 0;
            const gst = parseFloat(newItems[index].gst) || 0;
            newItems[index].rowTotal = calculateRowTotal(qty, price, gst);
        }

        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { productName: '', quantity: 1, price: 0, gst: 0, rowTotal: 0 }]);
    };

    const removeItem = (index) => {
        if (items.length > 1) {
            const newItems = items.filter((_, i) => i !== index);
            setItems(newItems);
        }
    };

    const calculateTotals = () => {
        let subtotal = 0;
        let totalGst = 0;

        items.forEach(item => {
            const qty = parseFloat(item.quantity) || 0;
            const price = parseFloat(item.price) || 0;
            const gst = parseFloat(item.gst) || 0;

            const baseAmount = qty * price;
            subtotal += baseAmount;
            totalGst += (baseAmount * gst) / 100;
        });

        return {
            subtotal: subtotal,
            totalGst: totalGst,
            grandTotal: subtotal + totalGst
        };
    };

    const totals = calculateTotals();

    const resetForm = () => {
        setCustomer({ customerName: '', mobileNumber: '', customerAddress: '' });
        setItems([{ productName: '', quantity: 1, price: 0, gst: 0, rowTotal: 0 }]);
        setError('');
    };

    const generatePDF = (invoiceData) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Header
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('INVOICE', pageWidth / 2, 25, { align: 'center' });

        // Shop Name
        doc.setFontSize(14);
        doc.text('Your Shop Name', pageWidth / 2, 35, { align: 'center' });

        // Invoice Number & Date
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Invoice #: ${invoiceData.invoiceNumber}`, 14, 50);
        doc.text(`Date: ${new Date(invoiceData.createdAt).toLocaleDateString()}`, 14, 58);

        // Customer Details
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Bill To:', 14, 72);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(invoiceData.customerName, 14, 80);
        doc.text(`Mobile: ${invoiceData.mobileNumber}`, 14, 88);

        const addressLines = doc.splitTextToSize(invoiceData.customerAddress, 80);
        doc.text(addressLines, 14, 96);

        // Items Table
        const tableData = invoiceData.items.map((item, index) => [
            index + 1,
            item.productName,
            item.quantity,
            `₹${item.price.toFixed(2)}`,
            `${item.gst}%`,
            `₹${item.rowTotal.toFixed(2)}`
        ]);

        autoTable(doc, {
            startY: 115,
            head: [['#', 'Product', 'Qty', 'Price', 'GST', 'Total']],
            body: tableData,
            theme: 'striped',
            headStyles: { fillColor: [51, 51, 51] },
            styles: { fontSize: 9 }
        });

        // Totals
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(10);
        doc.text(`Subtotal: ₹${invoiceData.subtotal.toFixed(2)}`, pageWidth - 60, finalY);
        doc.text(`GST Amount: ₹${invoiceData.totalGst.toFixed(2)}`, pageWidth - 60, finalY + 8);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text(`Grand Total: ₹${invoiceData.grandTotal.toFixed(2)}`, pageWidth - 60, finalY + 20);

        // Footer
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text('Thank you for your business!', pageWidth / 2, 280, { align: 'center' });

        doc.save(`Invoice_${invoiceData.invoiceNumber}.pdf`);
    };

    const handleSave = async () => {
        setError('');

        // Validation
        if (!customer.customerName.trim()) {
            setError('Customer name is required');
            return;
        }
        if (!customer.mobileNumber.trim()) {
            setError('Mobile number is required');
            return;
        }
        if (!customer.customerAddress.trim()) {
            setError('Customer address is required');
            return;
        }

        const validItems = items.filter(item => item.productName.trim());
        if (validItems.length === 0) {
            setError('At least one product is required');
            return;
        }

        setLoading(true);
        try {
            const invoiceData = {
                ...customer,
                items: validItems.map(item => ({
                    ...item,
                    quantity: parseFloat(item.quantity) || 0,
                    price: parseFloat(item.price) || 0,
                    gst: parseFloat(item.gst) || 0,
                    rowTotal: parseFloat(item.rowTotal) || 0
                })),
                subtotal: totals.subtotal,
                totalGst: totals.totalGst,
                grandTotal: totals.grandTotal
            };

            const response = await api.post('/invoices', invoiceData);
            resetForm();
            if (onInvoiceSaved) {
                onInvoiceSaved(response.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save invoice');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        setError('');

        // Validation
        if (!customer.customerName.trim()) {
            setError('Customer name is required');
            return;
        }
        if (!customer.mobileNumber.trim()) {
            setError('Mobile number is required');
            return;
        }
        if (!customer.customerAddress.trim()) {
            setError('Customer address is required');
            return;
        }

        const validItems = items.filter(item => item.productName.trim());
        if (validItems.length === 0) {
            setError('At least one product is required');
            return;
        }

        // Generate temporary invoice data for PDF
        const tempInvoice = {
            invoiceNumber: `TEMP-${Date.now()}`,
            createdAt: new Date(),
            customerName: customer.customerName,
            mobileNumber: customer.mobileNumber,
            customerAddress: customer.customerAddress,
            items: validItems.map(item => ({
                ...item,
                quantity: parseFloat(item.quantity) || 0,
                price: parseFloat(item.price) || 0,
                gst: parseFloat(item.gst) || 0,
                rowTotal: parseFloat(item.rowTotal) || 0
            })),
            subtotal: totals.subtotal,
            totalGst: totals.totalGst,
            grandTotal: totals.grandTotal
        };

        generatePDF(tempInvoice);
    };

    return (
        <div className="invoice-form">
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {/* Customer Information */}
            <div className="section">
                <h2 className="section-title">Customer Information</h2>
                <div className="customer-grid">
                    <div className="form-group">
                        <label>Customer Name *</label>
                        <input
                            type="text"
                            value={customer.customerName}
                            onChange={(e) => setCustomer({ ...customer, customerName: e.target.value })}
                            placeholder="Enter customer name"
                        />
                    </div>
                    <div className="form-group">
                        <label>Mobile Number *</label>
                        <input
                            type="tel"
                            value={customer.mobileNumber}
                            onChange={(e) => setCustomer({ ...customer, mobileNumber: e.target.value })}
                            placeholder="Enter mobile number"
                        />
                    </div>
                    <div className="form-group full-width">
                        <label>Customer Address *</label>
                        <textarea
                            value={customer.customerAddress}
                            onChange={(e) => setCustomer({ ...customer, customerAddress: e.target.value })}
                            placeholder="Enter customer address"
                            rows="2"
                        />
                    </div>
                </div>
            </div>

            {/* Billing Items */}
            <div className="section">
                <h2 className="section-title">Billing Items</h2>
                <div className="items-table-wrapper">
                    <table className="items-table">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Quantity</th>
                                <th>Price (₹)</th>
                                <th>GST (%)</th>
                                <th>Row Total (₹)</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <input
                                            type="text"
                                            value={item.productName}
                                            onChange={(e) => handleItemChange(index, 'productName', e.target.value)}
                                            placeholder="Product name"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={item.price}
                                            onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={item.gst}
                                            onChange={(e) => handleItemChange(index, 'gst', e.target.value)}
                                        />
                                    </td>
                                    <td className="row-total">
                                        ₹{item.rowTotal.toFixed(2)}
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className="btn-icon btn-delete"
                                            onClick={() => removeItem(index)}
                                            disabled={items.length === 1}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button type="button" className="btn btn-secondary" onClick={addItem}>
                    <Plus size={18} /> Add Item
                </button>
            </div>

            {/* Totals */}
            <div className="section totals-section">
                <div className="totals-grid">
                    <div className="total-row">
                        <span>Subtotal:</span>
                        <span>₹{totals.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="total-row">
                        <span>GST Amount:</span>
                        <span>₹{totals.totalGst.toFixed(2)}</span>
                    </div>
                    <div className="total-row grand-total">
                        <span>Grand Total:</span>
                        <span>₹{totals.grandTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="actions">
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSave}
                    disabled={loading}
                >
                    <Save size={18} /> {loading ? 'Saving...' : 'Save Invoice'}
                </button>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleDownload}
                >
                    <Download size={18} /> Download Invoice
                </button>
            </div>
        </div>
    );
};

export default InvoiceForm;
