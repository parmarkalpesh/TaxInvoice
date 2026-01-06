import { useEffect, useState } from 'react';
import { X, Printer } from 'lucide-react';

const InvoicePrint = ({ invoice, onClose }) => {
    const [paperSize, setPaperSize] = useState('A4');

    // Inject dynamic print styles based on paper size
    useEffect(() => {
        const styleId = 'dynamic-print-style';
        let styleEl = document.getElementById(styleId);

        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = styleId;
            document.head.appendChild(styleEl);
        }

        const pageStyles = {
            'A4': '@page { size: A4 portrait; margin: 5mm; }',
            'A5': '@page { size: A5 landscape; margin: 4mm; }',
            'Letter': '@page { size: letter portrait; margin: 5mm; }',
            'Legal': '@page { size: legal portrait; margin: 5mm; }'
        };

        styleEl.textContent = pageStyles[paperSize] || pageStyles['A4'];

        return () => {
            if (styleEl && styleEl.parentNode) {
                styleEl.parentNode.removeChild(styleEl);
            }
        };
    }, [paperSize]);

    const handlePrint = () => {
        window.print();
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount);
    };

    return (
        <>
            {/* Controls - Hide when printing */}
            <div className="print-controls no-print">
                <button className="print-close-btn" onClick={onClose}>
                    <X size={20} />
                </button>
                <div className="paper-selector">
                    <label>Paper Size:</label>
                    <select value={paperSize} onChange={(e) => setPaperSize(e.target.value)}>
                        <option value="A4">A4 (Portrait)</option>
                        <option value="A5">A5 (Landscape)</option>
                        <option value="Letter">Letter</option>
                        <option value="Legal">Legal</option>
                    </select>
                </div>
                <button className="print-btn" onClick={handlePrint}>
                    <Printer size={18} /> Print Invoice
                </button>
            </div>

            <div className={`print-container paper-${paperSize.toLowerCase()}`}>
                <div className="invoice-print">
                    {/* Header */}
                    <div className="print-header">
                        <div className="shop-info">
                            <h1 className="shop-name">Vikalp Electronics</h1>
                            <p className="shop-address">Jamnagar, Gujarat</p>
                            <p className="shop-contact">Contact: +91 7016223029</p>
                        </div>
                    </div>

                    {/* Invoice Title */}
                    <div className="invoice-title-bar">
                        <h2>TAX INVOICE</h2>
                    </div>

                    {/* Invoice Meta & Customer */}
                    <div className="invoice-details-row">
                        <div className="customer-box">
                            <h3>Bill To:</h3>
                            <p className="customer-name-print">{invoice.customerName}</p>
                            <p>Mobile: {invoice.mobileNumber}</p>
                            <p className="customer-address-print">{invoice.customerAddress}</p>
                        </div>
                        <div className="invoice-meta-box">
                            <table className="meta-table">
                                <tbody>
                                    <tr>
                                        <td><strong>Invoice No:</strong></td>
                                        <td>{invoice.invoiceNumber}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Date:</strong></td>
                                        <td>{formatDate(invoice.createdAt)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Items Table */}
                    <table className="print-items-table">
                        <thead>
                            <tr>
                                <th className="col-sr">Sr.</th>
                                <th className="col-product">Product / Service</th>
                                <th className="col-qty">Qty</th>
                                <th className="col-price">Price</th>
                                <th className="col-gst">GST</th>
                                <th className="col-total">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items.map((item, index) => (
                                <tr key={index}>
                                    <td className="col-sr">{index + 1}</td>
                                    <td className="col-product">{item.productName}</td>
                                    <td className="col-qty">{item.quantity}</td>
                                    <td className="col-price">{formatCurrency(item.price)}</td>
                                    <td className="col-gst">{item.gst}%</td>
                                    <td className="col-total">{formatCurrency(item.rowTotal)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Totals */}
                    <div className="print-totals-section">
                        <div className="totals-box">
                            <div className="total-line">
                                <span>Subtotal:</span>
                                <span>{formatCurrency(invoice.subtotal)}</span>
                            </div>
                            <div className="total-line">
                                <span>GST Amount:</span>
                                <span>{formatCurrency(invoice.totalGst)}</span>
                            </div>
                            <div className="total-line grand">
                                <span>Grand Total:</span>
                                <span>{formatCurrency(invoice.grandTotal)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Amount in Words */}
                    <div className="amount-words">
                        <p><strong>Amount in Words:</strong> {numberToWords(invoice.grandTotal)} Only</p>
                    </div>

                    {/* Signature Area */}
                    <div className="signature-section">
                        <div className="signature-box">
                            <p className="auth-sig">Authorized Signatory</p>
                            <div className="sig-line"></div>
                            <p className="shop-name-footer">Vikalp Electronics</p>
                        </div>
                    </div>

                    {/* Computer Generated Notice */}
                    <div className="computer-generated">
                        <p className="generated-text">This is a computer generated Invoice</p>
                        <div className="madhav-tech-info">
                            <img src="/MadhavTech.png" alt="MadhavTech" className="madhav-logo" />
                            <p>This software managed by <strong>MadhavTech</strong> | For any query contact us: +91 7016223029</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

// Helper function to convert number to words
function numberToWords(num) {
    if (num === 0) return 'Zero';

    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
        'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const numToWords = (n) => {
        if (n < 20) return ones[n];
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
        if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + numToWords(n % 100) : '');
        if (n < 100000) return numToWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + numToWords(n % 1000) : '');
        if (n < 10000000) return numToWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + numToWords(n % 100000) : '');
        return numToWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + numToWords(n % 10000000) : '');
    };

    const rupees = Math.floor(num);
    const paise = Math.round((num - rupees) * 100);

    let result = 'Rupees ' + numToWords(rupees);
    if (paise > 0) {
        result += ' and ' + numToWords(paise) + ' Paise';
    }

    return result;
}

export default InvoicePrint;
