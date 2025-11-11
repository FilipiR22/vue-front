import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'https://vue-back-simulado.onrender.com'

const api = axios.create({
    baseURL,
    timeout: 8000
})

export default api