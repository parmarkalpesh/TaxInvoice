import { useEffect, useState } from "react";
import { Printer } from "lucide-react";

const InvoicePrint = ({ invoice, onClose, loading = false }) => {
  const [displayInvoice, setDisplayInvoice] = useState(null);
  const [displayShop, setDisplayShop] = useState(null);
  const [paperSize, setPaperSize] = useState("A4");

  useEffect(() => {
    // Map invoice data to display format
    if (invoice) {
      setDisplayInvoice({
        invoiceNumber: invoice.invoiceNumber || invoice._id,
        date: invoice.createdAt || new Date(),
        customer: {
          name: invoice.customerName || "",
          address: invoice.customerAddress || "",
          mobile: invoice.mobileNumber || "",
        },
        items: invoice.items || [],
        subtotal: invoice.subtotal || 0,
        totalGst: invoice.totalGst || 0,
        grandTotal: invoice.grandTotal || 0,
        status: invoice.status || "Pending",
      });

      setDisplayShop({
        name: "Vikalp Electronics",
        address: "123 Business Street",
        city: "Jamnagar",
        state: "Gujarat",
        zip: "361001",
        mobile: "+91 7016223029",
        email: "info@vikalpelectronics.com",
        gstin: "27AABCT1234H1Z0",
      });
    }
  }, [invoice]);

  // Inject dynamic print styles based on paper size
  useEffect(() => {
    const styleId = "dynamic-print-style";
    let styleEl = document.getElementById(styleId);

    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    const pageStyles = {
      A4: "@page { size: A4 portrait; margin: 5mm; }",
      A5: "@page { size: A5 landscape; margin: 4mm; }",
    };

    styleEl.textContent = pageStyles[paperSize] || pageStyles["A4"];

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
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "0.00";
    return parseFloat(amount).toFixed(2);
  };

  if (!displayInvoice || !displayShop) {
    return <div className="print-loading">Loading invoice...</div>;
  }

  const id = invoice?._id;

  return (
    <div className="relative">
      <div className="print-controls no-print">
        <button
          onClick={handlePrint}
          disabled={loading}
          className={`print-button ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          title="Print Invoice"
        >
          <Printer size={18} />
          {loading ? "Fetching Data..." : "Print Invoice"}
        </button>

        <div className="paper-size-selector no-print">
          <label htmlFor="paper-size">Paper Size:</label>
          <select
            id="paper-size"
            value={paperSize}
            onChange={(e) => setPaperSize(e.target.value)}
          >
            <option value="A4">A4 (Portrait)</option>
            <option value="A5">A5 (Landscape)</option>
          </select>
        </div>
      </div>

      <div
        id={id || "invoice-print"}
        className={`invoice-container paper-${paperSize.toLowerCase()}`}
      >
        {/* ===== HEADER SECTION ===== */}
        <div className="invoice-header-row">
          <div className="invoice-company-info">
            <h1 className="invoice-logo">INVOICE</h1>
          </div>
          <div className="invoice-meta-info">
            <div className="invoice-meta-row">
              <span className="invoice-meta-label">INVOICE NO. & DATE</span>
              <span className="invoice-meta-value">
                {displayInvoice.invoiceNumber}
              </span>
            </div>
            <div className="invoice-meta-row">
              <span className="invoice-meta-label">DATE</span>
              <span className="invoice-meta-value">
                {formatDate(displayInvoice.date)}
              </span>
            </div>
          </div>
        </div>

        {/* ===== BILL TO SECTION ===== */}
        <div className="invoice-billto-section">
          <div className="billto-left">
            <h3 className="billto-label">BILL TO</h3>
            <p className="billto-customer-name">
              {displayInvoice.customer.name}
            </p>
            <p className="billto-address">{displayInvoice.customer.address}</p>
            <p className="billto-phone">{displayInvoice.customer.mobile}</p>
          </div>
          <div className="billto-right">
            <div className="company-details">
              <p className="company-name">{displayShop.name}</p>
              <p className="company-line">{displayShop.address}</p>
              <p className="company-line">
                {displayShop.city}, {displayShop.state} {displayShop.zip}
              </p>
              <p className="company-line">Email: {displayShop.email}</p>
              <p className="company-line">Phone: {displayShop.mobile}</p>
              <p className="company-line">GSTIN: {displayShop.gstin}</p>
            </div>
          </div>
        </div>

        {/* ===== ITEMS TABLE ===== */}
        <table className="invoice-items-table">
          <thead>
            <tr className="table-header">
              <th className="col-desc">DESCRIPTION</th>
              <th className="col-qty">QTY</th>
              <th className="col-rate">RATE</th>
              <th className="col-gst">GST %</th>
              <th className="col-amount">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {displayInvoice.items &&
              displayInvoice.items.map((item, idx) => (
                <tr key={idx} className="table-row">
                  <td className="col-desc">{item.productName || item.name}</td>
                  <td className="col-qty">{item.quantity}</td>
                  <td className="col-rate">₹{formatCurrency(item.price)}</td>
                  <td className="col-gst">{item.gst}%</td>
                  <td className="col-amount">
                    ₹{formatCurrency(item.rowTotal || item.total)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* ===== SUMMARY SECTION ===== */}
        <div className="invoice-summary-section">
          <div className="summary-left">
            <div className="summary-notes">
              <h4 className="notes-label">NOTES</h4>
              <p className="notes-text">
                Thank you for your business. Payment terms: Due upon receipt.
              </p>
            </div>
          </div>
          <div className="summary-right">
            <div className="summary-totals">
              <div className="total-row">
                <span className="total-label">Subtotal</span>
                <span className="total-value">
                  ₹{formatCurrency(displayInvoice.subtotal)}
                </span>
              </div>
              <div className="total-row">
                <span className="total-label">GST Total</span>
                <span className="total-value">
                  ₹{formatCurrency(displayInvoice.totalGst)}
                </span>
              </div>
              <div className="total-row total-grand">
                <span className="total-label">TOTAL</span>
                <span className="total-value">
                  ₹{formatCurrency(displayInvoice.grandTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== SIGNATURE SECTION ===== */}
        <div className="invoice-footer-section">
          <div className="footer-left">
            <p className="footer-text">
              <strong>Payment Status:</strong>{" "}
              <span
                className={`status-badge ${
                  displayInvoice.status === "Paid"
                    ? "status-paid"
                    : "status-pending"
                }`}
              >
                {displayInvoice.status}
              </span>
            </p>
          </div>
          <div className="footer-right">
            <div className="signature-box">
              <div className="signature-line"></div>
              <p className="signature-name">Authorized Signature</p>
            </div>
          </div>
        </div>

        {/* ===== FOOTER TEXT ===== */}
        <div className="invoice-bottom-footer">
          <p>This is a computer generated invoice. No signature required.</p>
          <p>
            Invoice managed by <strong>MadhavTech</strong> | Support: +91
            7016223029
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePrint;
