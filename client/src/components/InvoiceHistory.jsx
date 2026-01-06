import { useState, useEffect } from 'react';
import { Trash2, Printer, Eye } from 'lucide-react';
import api from '../api/config';
import InvoicePrint from './InvoicePrint';

const InvoiceHistory = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showPrint, setShowPrint] = useState(false);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const response = await api.get('/invoices');
            setInvoices(response.data);
        } catch (err) {
            setError('Failed to fetch invoices');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this invoice?')) {
            return;
        }

        try {
            await api.delete(`/invoices/${id}`);
            setInvoices(invoices.filter(inv => inv._id !== id));
        } catch (err) {
            setError('Failed to delete invoice');
            console.error(err);
        }
    };

    const handlePrint = (invoice) => {
        setSelectedInvoice(invoice);
        setShowPrint(true);
    };

    const closePrint = () => {
        setShowPrint(false);
        setSelectedInvoice(null);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p>Loading invoices...</p>
            </div>
        );
    }

    if (showPrint && selectedInvoice) {
        return <InvoicePrint invoice={selectedInvoice} onClose={closePrint} />;
    }

    return (
        <div className="invoice-history">
            <h2 className="section-title">Invoice History</h2>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {invoices.length === 0 ? (
                <div className="empty-state">
                    <p>No invoices found. Create your first invoice to get started!</p>
                </div>
            ) : (
                <div className="history-list">
                    {invoices.map((invoice) => (
                        <div key={invoice._id} className="history-card">
                            <div className="card-header">
                                <span className="invoice-number">{invoice.invoiceNumber}</span>
                                <span className="invoice-date">{formatDate(invoice.createdAt)}</span>
                            </div>
                            <div className="card-body">
                                <h3 className="customer-name">{invoice.customerName}</h3>
                                <p className="customer-mobile">{invoice.mobileNumber}</p>
                            </div>
                            <div className="card-footer">
                                <span className="grand-total">₹{invoice.grandTotal.toFixed(2)}</span>
                                <div className="card-actions">
                                    <button
                                        className="btn-icon btn-view"
                                        onClick={() => handlePrint(invoice)}
                                        title="Print Invoice"
                                    >
                                        <Printer size={18} />
                                    </button>
                                    <button
                                        className="btn-icon btn-delete"
                                        onClick={() => handleDelete(invoice._id)}
                                        title="Delete Invoice"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InvoiceHistory;
