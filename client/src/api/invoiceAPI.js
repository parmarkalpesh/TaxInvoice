/**
 * Invoice API Service
 * Centralized service for all invoice-related API calls
 */

import api from "./config";
import config from "../config/environment";

const invoiceAPI = {
  /**
   * Fetch all invoices
   */
  getAllInvoices: async () => {
    try {
      const response = await api.get(config.endpoints.invoices);
      return response.data;
    } catch (error) {
      console.error("Error fetching invoices:", error);
      throw error;
    }
  },

  /**
   * Get a single invoice by ID
   */
  getInvoiceById: async (id) => {
    try {
      const response = await api.get(config.endpoints.getInvoice(id));
      return response.data;
    } catch (error) {
      console.error(`Error fetching invoice ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new invoice
   */
  createInvoice: async (invoiceData) => {
    try {
      const response = await api.post(
        config.endpoints.createInvoice,
        invoiceData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating invoice:", error);
      throw error;
    }
  },

  /**
   * Update an existing invoice
   */
  updateInvoice: async (id, invoiceData) => {
    try {
      const response = await api.put(
        config.endpoints.getInvoice(id),
        invoiceData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating invoice ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete an invoice
   */
  deleteInvoice: async (id) => {
    try {
      const response = await api.delete(config.endpoints.deleteInvoice(id));
      return response.data;
    } catch (error) {
      console.error(`Error deleting invoice ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get API base URL
   */
  getBaseUrl: () => config.getApiUrl(),
};

export default invoiceAPI;
