import axios from 'axios';
import axiosRetry from 'axios-retry';

const api = axios.create({
  baseURL: "https://mandi-connect.onrender.com/api/",
  timeout: 15000,
});

// Auto-retry failing requests (network drops, 5xx errors)
axiosRetry(api, {
  retries: 3,
  retryDelay: (retryCount) => {
    return retryCount * 2000; // time interval increases with each retry 2s, 4s, 6s...
  },
  retryCondition: (error) => {
    // True if network connection drops or latency is too high
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.code === 'ECONNABORTED';
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Caching layer for GET requests to support slow internets immediately
api.interceptors.response.use(
  (response) => {
    // Cache successful GET responses silently
    if (response.config.method === 'get') {
      localStorage.setItem(`cache_${response.config.url}`, JSON.stringify(response.data));
    }
    return response;
  },
  (error) => {
    // If a GET request completely fails due to lack of network, attempt to serve it from our offline cache layer
    if (error.config && error.config.method === 'get' && (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED')) {
      const cachedData = localStorage.getItem(`cache_${error.config.url}`);
      if (cachedData) {
        console.warn(`[Network Offline] Serving ${error.config.url} from local cache due to high latency.`);
        return Promise.resolve({ data: JSON.parse(cachedData), status: 200, cached: true });
      }
    }
    return Promise.reject(error);
  }
);

export default api;
