import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the token
api.interceptors.request.use(
  (config) => {
    try {
      const userInfoStr = localStorage.getItem('userInfo');
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr);
        if (userInfo?.token) {
          config.headers.Authorization = `Bearer ${userInfo.token}`;
        }
      }
    } catch (e) {
      console.error('Failed to parse userInfo from localStorage:', e);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardized error message extraction
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred.';
    
    // Dispatch global event for NotificationContext
    const event = new CustomEvent('app-notify', {
      detail: { message, type: 'error' }
    });
    window.dispatchEvent(event);

    return Promise.reject(error);
  }
);

export default api;
