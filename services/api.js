import axios from 'axios'

const baseURL = 'https://vue-back-simulado.onrender.com'

const api = axios.create({
    baseURL,
    timeout: 8000
})

export default api