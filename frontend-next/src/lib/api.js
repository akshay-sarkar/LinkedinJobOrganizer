import axios from 'axios';

// Create axios instance - uses relative URLs that Next.js will proxy to backend
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (runs before every request)
api.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔵 ${config.method.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (runs after every response)
api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🟢 ${response.config.method.toUpperCase()} ${response.config.url} - Success`);
    }
    return response;
  },
  (error) => {
    console.error(`🔴 ${error.config?.method?.toUpperCase()} ${error.config?.url} - Error:`, error.message);
    return Promise.reject(error);
  }
);

// Job API endpoints
export const jobAPI = {
  // Get all jobs with filters (supports pagination with limit/offset)
  getAll: (params = {}) => api.get('/jobs', { params }),

  // Get paginated jobs for infinite scroll
  getPaginated: (params = {}) => {
    const { limit = 20, offset = 0, ...rest } = params;
    return api.get('/jobs', { params: { limit, offset, ...rest } });
  },

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
