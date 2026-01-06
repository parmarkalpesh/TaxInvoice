/**
 * Environment Configuration
 * Centralized configuration for all environment variables
 */

export const config = {
  // API Configuration
  api: {
    url: import.meta.env.VITE_API_URL || "http://localhost:5000",
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
    retryAttempts: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS) || 3,
  },

  // Application Configuration
  app: {
    env: import.meta.env.VITE_APP_ENV || "development",
    name: import.meta.env.VITE_APP_NAME || "TaxInvoice",
    version: import.meta.env.VITE_APP_VERSION || "1.0.0",
  },

  // Feature Flags
  features: {
    enableLogging: import.meta.env.VITE_ENABLE_LOGGING === "true",
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
  },

  // API Endpoints
  endpoints: {
    invoices: "/invoices",
    createInvoice: "/invoices",
    getInvoice: (id) => `/invoices/${id}`,
    deleteInvoice: (id) => `/invoices/${id}`,
  },

  // Helper methods
  isDevelopment: () => import.meta.env.DEV,
  isProduction: () => import.meta.env.PROD,
  getApiUrl: () => `${config.api.url}/api`,
};

export default config;
