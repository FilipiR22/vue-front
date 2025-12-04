import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // Prefixo para chamadas à API
    timeout: 8000,
});

export default api;