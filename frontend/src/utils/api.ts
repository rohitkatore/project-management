import axios from 'axios';

// Create a configured axios instance with the backend URL from environment variable
const API = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000',
});

export default API;
