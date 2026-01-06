import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { FileText, History } from 'lucide-react';
import InvoiceForm from './components/InvoiceForm';
import InvoiceHistory from './components/InvoiceHistory';
import './App.css';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleInvoiceSaved = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Router>
      <div className="app">
        {/* Header */}
        <header className="header">
          <div className="container">
            <h1 className="logo">
              <FileText size={28} />
              <span>BillPro</span>
            </h1>
            <nav className="nav">
              <NavLink
                to="/"
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                end
              >
                <FileText size={18} />
                <span>Create Invoice</span>
              </NavLink>
              <NavLink
                to="/history"
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                <History size={18} />
                <span>History</span>
              </NavLink>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="main">
          <div className="container">
            <Routes>
              <Route
                path="/"
                element={<InvoiceForm onInvoiceSaved={handleInvoiceSaved} />}
              />
              <Route
                path="/history"
                element={<InvoiceHistory key={refreshKey} />}
              />
            </Routes>
          </div>
        </main>

        {/* Footer */}
        <footer className="footer no-print">
          <div className="container">
            <p>&copy; {new Date().getFullYear()} BillPro. Professional Billing Made Simple.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
