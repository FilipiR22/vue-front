import axios from 'axios'

const api = axios.create({
    baseURL: 'https://vue-back-simulado.onrender.com',
    timeout: 8000
})

export default api