import { useEffect } from 'react';
import { X } from 'lucide-react';

const InvoicePrint = ({ invoice, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            window.print();
        }, 500);

        return () => clearTimeout(timer);
    }, []);

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
            <button className="print-close-btn no-print" onClick={onClose}>
                <X size={24} />
            </button>

            <div className="print-container">
                <div className="invoice-print">
                    {/* Header */}
                    <div className="print-header">
                        <div className="shop-info">
                            <h1 className="shop-name">YOUR SHOP NAME</h1>
                            <p className="shop-address">Shop Address Line 1, City - PIN Code</p>
                            <p className="shop-contact">Phone: +91 98765 43210 | Email: shop@example.com</p>
                            <p className="shop-gst">GSTIN: 00AAAAA0000A0Z0</p>
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
                                <th className="col-price">Unit Price</th>
                                <th className="col-gst">GST %</th>
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

                    {/* Footer */}
                    <div className="print-footer">
                        <div className="footer-left">
                            <p><strong>Terms & Conditions:</strong></p>
                            <p>1. Goods once sold will not be taken back.</p>
                            <p>2. All disputes subject to local jurisdiction.</p>
                        </div>
                        <div className="footer-right">
                            <p className="auth-sig">Authorized Signatory</p>
                            <div className="sig-line"></div>
                            <p className="shop-name-footer">Your Shop Name</p>
                        </div>
                    </div>

                    {/* Thank You */}
                    <div className="thank-you">
                        <p>Thank you for your business!</p>
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
