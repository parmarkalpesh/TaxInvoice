import axios from "axios";
import config from "../config/environment";

/**
 * API Configuration
 * Centralized axios instance with environment-based configuration
 */

const api = axios.create({
  baseURL: `${config.api.url}/api`,
  timeout: config.api.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use(
  (requestConfig) => {
    if (config.features.enableLogging) {
      console.log(
        `[API Request] ${requestConfig.method?.toUpperCase()} ${
          requestConfig.url
        }`
      );
    }
    return requestConfig;
  },
  (error) => {
    if (config.features.enableLogging) {
      console.error("[API Request Error]", error);
    }
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    if (config.features.enableLogging) {
      console.log(`[API Response] ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    if (config.features.enableLogging) {
      console.error(
        "[API Response Error]",
        error.response?.status,
        error.message
      );
    }

    // Handle common errors
    if (error.response?.status === 401) {
      console.error("Unauthorized: Please login again");
    } else if (error.response?.status === 404) {
      console.error("Resource not found");
    } else if (error.response?.status === 500) {
      console.error("Server error: Please try again later");
    }

    return Promise.reject(error);
  }
);

export default api;
