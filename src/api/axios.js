import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

// Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    const publicPaths = [
      '/users',                 // POST register
      '/users/login',           // POST login
      '/users/check-username',  // GET check username
    ];
    const isPublic = publicPaths.some((path) => config.url.startsWith(path));

    if (token && !isPublic) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Auto logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Invalid token or expired session
      console.warn('Unauthorized. Logging out...');
      localStorage.removeItem('token');
      window.location.href = '/'; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;