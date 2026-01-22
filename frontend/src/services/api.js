import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5500/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (runs before every request)
api.interceptors.request.use(
  (config) => {
    console.log(`🔵 ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (runs after every response)
api.interceptors.response.use(
  (response) => {
    console.log(`🟢 ${response.config.method.toUpperCase()} ${response.config.url} - Success`);
    return response;
  },
  (error) => {
    console.error(`🔴 ${error.config?.method?.toUpperCase()} ${error.config?.url} - Error:`, error.message);
    return Promise.reject(error);
  }
);

// Job API endpoints
export const jobAPI = {
  // Get all jobs with filters
  getAll: (params = {}) => api.get('/jobs', { params }),

  // Get single job by ID
  getById: (id) => api.get(`/jobs/${id}`),

  // Fetch new jobs from email
  fetchFromEmail: (limit = 10) => api.post('/jobs/fetch', { limit }),

  // Update job
  update: (id, data) => api.put(`/jobs/${id}`, data),

  // Delete job
  delete: (id) => api.delete(`/jobs/${id}`),

  // Delete all jobs
  deleteAll: () => api.delete('/jobs/deleteAll'),

  // Get statistics
  getStats: () => api.get('/jobs/stats'),
};

export default api;
