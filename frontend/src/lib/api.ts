/**
 * Axios instance — the single HTTP client for all API calls.
 * 
 * WHY AXIOS over fetch()?
 * - Automatic JSON parsing (no .json() needed)
 * - Request/response interceptors (add auth headers, handle errors globally)
 * - Better error objects (error.response.status vs checking response.ok)
 * - Timeout support built-in
 */

import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

export default api;
