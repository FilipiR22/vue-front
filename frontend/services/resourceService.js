import api from './api'

export default {
    list(params) {
        // garante que os params vindos do componente sejam enviados ao json-server
        return api.get('/recurso', { params })
    },
    create(data) { return api.post('/recurso', data) },
    update(id, data) { return api.put(`/recurso/${id}`, data) },
    remove(id) { return api.delete(`/recurso/${id}`) }
}
