// rohmans234/sistem-informasi-penempatan-santri-baru/.../frontend/src/utils/api.ts
import axios from 'axios';

// URL API Backend
export const API_BASE_URL = 'http://localhost:3000/api';

// Create a custom Axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;